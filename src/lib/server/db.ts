import type {
	CheckConstraint,
	CheckConstraintQueryResult,
	Column,
	ColumnQueryResult,
	DbResponse,
	ForeignKey,
	ForeignKeyQueryResult,
	Func,
	FuncDetails,
	FuncDetailsQueryResult,
	FuncQueryResult,
	QueryResult,
	RLSInfo,
	RLSQueryResult,
	TableIndex,
	TableIndexQueryResult,
	TableSizeMetrics,
	Trigger,
	TriggerQueryResult,
} from '$lib/types';
import getPgTypeName from '$lib/util/pg-type-map';
import postgres, { type Sql } from 'postgres';

const dbClients = new Map<string, Sql>();

const getClient = (dbUrl: string): Sql => {
  let client = dbClients.get(dbUrl);

  if (!client) {
    client = postgres(dbUrl, { 
      max: 1, // required for transactions
      idle_timeout: 120,
    });
    dbClients.set(dbUrl, client);
  }

  return client;
};

const formatExecutionTime = (startTime: number): number => {
	return Number((performance.now() - startTime).toFixed(2));
};

const formatSuccessResponse = <T>(
	result: any,
	startTime: number,
	customQuery?: string,
): DbResponse<T> => {
	let processedResult = result;

	if (Array.isArray(processedResult) && !('command' in processedResult)) {
		const resArray = processedResult as any[];
		processedResult = resArray[resArray.length - 1];
	}

	const { count, command, columns: rawColumns, statement } = processedResult;

	const columns = rawColumns
		? rawColumns.map((col: any) => ({
				name: col.name,
				number: col.number,
				type: getPgTypeName(col.type),
			}))
		: [];

	return {
		success: true,
		error: null,
		data: [...processedResult],
		meta: {
			count: count ?? 0,
			command: command || 'UNKNOWN',
			columns,
			query: customQuery || statement?.string || '',
			executionTimeMs: formatExecutionTime(startTime),
		},
	};
};

export const executeQuery = async (dbUrl: string, query: string): Promise<QueryResult> => {
	const startTime = performance.now();

	try {
		const client = getClient(dbUrl);
		let result = await client.unsafe(query);
		return formatSuccessResponse<unknown>(result, startTime, query);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'An unknown database error occurred',
			data: [],
			meta: { query, executionTimeMs: formatExecutionTime(startTime) },
		};
	}
};

export const getTableColumns = async (
	dbUrl: string,
	tableName: string,
	schemaName = 'public',
): Promise<ColumnQueryResult> => {
	const startTime = performance.now();
	try {
		const client = getClient(dbUrl);

		const result = await client`
			SELECT
				c.column_name AS "columnName",
				c.data_type AS "dataType",
				(c.is_nullable = 'YES') AS "isNullable",
				c.column_default AS "columnDefault",
				EXISTS (
					SELECT 1
					FROM information_schema.table_constraints tc
					JOIN information_schema.key_column_usage kcu
						ON tc.constraint_name = kcu.constraint_name
						AND tc.table_schema = kcu.table_schema
					WHERE tc.constraint_type = 'PRIMARY KEY'
						AND tc.table_name = c.table_name
						AND tc.table_schema = c.table_schema
						AND kcu.table_name = c.table_name
						AND kcu.table_schema = c.table_schema
						AND kcu.column_name = c.column_name
				) AS "isPrimaryKey",
				(
					SELECT ccu.table_name
					FROM information_schema.key_column_usage kcu
					JOIN information_schema.referential_constraints rc 
						ON kcu.constraint_name = rc.constraint_name
						AND kcu.constraint_schema = rc.constraint_schema
					JOIN information_schema.constraint_column_usage ccu
						ON rc.unique_constraint_name = ccu.constraint_name
						AND rc.unique_constraint_schema = ccu.table_schema
					WHERE kcu.table_name = c.table_name
						AND kcu.table_schema = c.table_schema
						AND kcu.column_name = c.column_name
					LIMIT 1
				) AS "referencedTable",
				(
					SELECT ccu.column_name
					FROM information_schema.key_column_usage kcu
					JOIN information_schema.referential_constraints rc 
						ON kcu.constraint_name = rc.constraint_name
						AND kcu.constraint_schema = rc.constraint_schema
					JOIN information_schema.constraint_column_usage ccu
						ON rc.unique_constraint_name = ccu.constraint_name
						AND rc.unique_constraint_schema = ccu.table_schema
					WHERE kcu.table_name = c.table_name
						AND kcu.table_schema = c.table_schema
						AND kcu.column_name = c.column_name
					LIMIT 1
				) AS "referencedColumn"
			FROM information_schema.columns c
			WHERE c.table_name = ${tableName}
				AND c.table_schema = ${schemaName}
			ORDER BY c.ordinal_position;
    `;

		return formatSuccessResponse<Column>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve table columns',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: formatExecutionTime(startTime),
			},
		};
	}
};

export const getFunctions = async (dbUrl: string, schemaName: string = 'public'): Promise<FuncQueryResult> => {
	const startTime = performance.now();

	try {
		const client = getClient(dbUrl);

		const result = await client`
      SELECT 
        routine_name AS "name",
        data_type AS "returnType"
      FROM 
        information_schema.routines
      WHERE 
        routine_schema = ${schemaName}
        AND routine_type = 'FUNCTION'
      ORDER BY 
        routine_name;
    `;

		return formatSuccessResponse<Func>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve schema functions',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: formatExecutionTime(startTime),
			},
		};
	}
};

export const getFunctionDetails = async (
	dbUrl: string,
	schemaName: string,
	functionName: string,
): Promise<FuncDetailsQueryResult> => {
	const startTime = performance.now();

	try {
		const client = getClient(dbUrl);

		const result = await client`
      SELECT 
        p.oid AS "oid",
        p.proname AS "name",
        l.lanname AS "language",
        pg_get_function_result(p.oid) AS "returnType",
        pg_get_function_arguments(p.oid) AS "argumentSignature",
        pg_get_functiondef(p.oid) AS "body",
        CASE p.provolatile
          WHEN 'i' THEN 'IMMUTABLE'
          WHEN 's' THEN 'STABLE'
          WHEN 'v' THEN 'VOLATILE'
        END AS "behaviorType"
      FROM 
        pg_catalog.pg_proc p
      JOIN 
        pg_catalog.pg_namespace n ON n.oid = p.pronamespace
      JOIN 
        pg_catalog.pg_language l ON l.oid = p.prolang
      WHERE 
        n.nspname = ${schemaName}
        AND p.proname = ${functionName}
        AND p.prokind = 'f';
    `;

		return formatSuccessResponse<FuncDetails>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve function details',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
			},
		};
	}
};

export const getTriggers = async (
	dbUrl: string,
	schemaName = 'public',
): Promise<TriggerQueryResult> => {
	const startTime = performance.now();

	try {
		const client = getClient(dbUrl);

		const result = await client`
      SELECT 
        t.tgname AS "triggerName",
        rel.relname AS "tableName",
        CASE (t.tgtype::integer & 2)
          WHEN 2 THEN 'BEFORE'
          ELSE 'AFTER'
        END AS "actionTiming",
        concat_ws(' OR ',
          CASE WHEN (t.tgtype::integer & 4) = 4 THEN 'INSERT' END,
          CASE WHEN (t.tgtype::integer & 16) = 16 THEN 'UPDATE' END,
          CASE WHEN (t.tgtype::integer & 8) = 8 THEN 'DELETE' END,
          CASE WHEN (t.tgtype::integer & 64) = 64 THEN 'TRUNCATE' END
        ) AS "eventManipulation",
        pg_get_triggerdef(t.oid) AS "actionStatement",
        CASE t.tgenabled
          WHEN 'D' THEN false
          ELSE true
        END AS "isEnabled"
      FROM 
        pg_catalog.pg_trigger t
      JOIN 
        pg_catalog.pg_class rel ON rel.oid = t.tgrelid
      JOIN 
        pg_catalog.pg_namespace n ON n.oid = rel.relnamespace
      WHERE 
        n.nspname = ${schemaName}
        AND NOT t.tgisinternal
      ORDER BY 
        rel.relname, t.tgname;
    `;

		return formatSuccessResponse<Trigger>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve schema triggers',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
			},
		};
	}
};

export const getTableIndexes = async (
	dbUrl: string,
	tableName: string,
	schemaName = 'public',
): Promise<TableIndexQueryResult> => {
	const startTime = performance.now();
	try {
		const client = getClient(dbUrl);

		const result = await client`
			SELECT
				i.relname AS "indexName",
				ARRAY_TO_STRING(ARRAY(
					SELECT attname FROM pg_catalog.pg_attribute
					WHERE attrelid = t.oid AND attnum = ANY(ix.indkey)
					ORDER BY array_position(ix.indkey, attnum)
				), ', ') AS "columns",
				ix.indisunique AS "isUnique",
				ix.indisprimary AS "isPrimaryKey",
				pg_get_indexdef(ix.indexrelid) AS "indexDefinition"
			FROM pg_catalog.pg_class t
			JOIN pg_catalog.pg_index ix ON t.oid = ix.indrelid
			JOIN pg_catalog.pg_class i ON i.oid = ix.indexrelid
			JOIN pg_catalog.pg_namespace n ON n.oid = t.relnamespace
			WHERE t.relname = ${tableName}
				AND n.nspname = ${schemaName}
			ORDER BY i.relname;
		`;

		return formatSuccessResponse<TableIndex>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve table indexes',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: formatExecutionTime(startTime),
			},
		};
	}
};

export const getTableCheckConstraints = async (
	dbUrl: string,
	tableName: string,
	schemaName = 'public',
): Promise<CheckConstraintQueryResult> => {
	const startTime = performance.now();
	try {
		const client = getClient(dbUrl);

		const result = await client`
			SELECT
				tc.constraint_name AS "constraintName",
				cc.check_clause AS "checkExpression"
			FROM information_schema.table_constraints tc
			JOIN information_schema.check_constraints cc
				ON tc.constraint_name = cc.constraint_name
				AND tc.table_schema = cc.constraint_schema
			WHERE tc.constraint_type = 'CHECK'
				AND tc.table_name = ${tableName}
				AND tc.table_schema = ${schemaName}
			ORDER BY tc.constraint_name;
		`;

		return formatSuccessResponse<CheckConstraint>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve table check constraints',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: formatExecutionTime(startTime),
			},
		};
	}
};

export const getTableForeignKeys = async (
	dbUrl: string,
	tableName: string,
	schemaName = 'public',
): Promise<ForeignKeyQueryResult> => {
	const startTime = performance.now();
	try {
		const client = getClient(dbUrl);

		const result = await client`
			SELECT
				con.conname AS "constraintName",
				(SELECT attname FROM pg_catalog.pg_attribute WHERE attrelid = con.conrelid AND attnum = con.conkey[pos]) AS "columnName",
				cl_ref.relname AS "referencedTable",
				(SELECT attname FROM pg_catalog.pg_attribute WHERE attrelid = con.confrelid AND attnum = con.confkey[pos]) AS "referencedColumn",
				CASE con.confupdtype
					WHEN 'c' THEN 'CASCADE'
					WHEN 'n' THEN 'SET NULL'
					WHEN 'd' THEN 'SET DEFAULT'
					WHEN 'r' THEN 'RESTRICT'
					WHEN 'a' THEN 'NO ACTION'
				END AS "onUpdate",
				CASE con.confdeltype
					WHEN 'c' THEN 'CASCADE'
					WHEN 'n' THEN 'SET NULL'
					WHEN 'd' THEN 'SET DEFAULT'
					WHEN 'r' THEN 'RESTRICT'
					WHEN 'a' THEN 'NO ACTION'
				END AS "onDelete"
			FROM pg_catalog.pg_constraint con
			JOIN pg_catalog.pg_class cl ON cl.oid = con.conrelid
			JOIN pg_catalog.pg_namespace ns ON ns.oid = cl.relnamespace
			JOIN pg_catalog.pg_class cl_ref ON cl_ref.oid = con.confrelid
			CROSS JOIN generate_subscripts(con.conkey, 1) pos
			WHERE con.contype = 'f'
				AND cl.relname = ${tableName}
				AND ns.nspname = ${schemaName}
			ORDER BY con.conname, pos;
		`;

		return formatSuccessResponse<ForeignKey>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve table foreign keys',
			data: [],
			meta: {
				query: 'Internal Schema Query',
				executionTimeMs: formatExecutionTime(startTime),
			},
		};
	}
};

export const getSchemaDataUsage = async (
	dbUrl: string,
	schemaName = 'public',
): Promise<DbResponse<TableSizeMetrics>> => {
	const startTime = performance.now();
	try {
		const client = getClient(dbUrl);

		const result = await client`
      SELECT
        c.relname AS "tableName",
        COALESCE(s.n_live_tup, 0) AS "rowCount",
        
        pg_relation_size(c.oid) AS "dataSizeRaw",
        pg_size_pretty(pg_relation_size(c.oid)) AS "dataSizePretty",
        
        pg_indexes_size(c.oid) AS "indexSizeRaw",
        pg_size_pretty(pg_indexes_size(c.oid)) AS "indexSizePretty",
        
        COALESCE(pg_relation_size(c.reltoastrelid), 0) AS "toastSizeRaw",
        pg_size_pretty(COALESCE(pg_relation_size(c.reltoastrelid), 0)) AS "toastSizePretty",
        
        pg_total_relation_size(c.oid) AS "totalSizeRaw",
        pg_size_pretty(pg_total_relation_size(c.oid)) AS "totalSizePretty"
      FROM pg_catalog.pg_class c
      JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      LEFT JOIN pg_catalog.pg_stat_user_tables s ON s.relid = c.oid
      WHERE n.nspname = ${schemaName}
        AND c.relkind = 'r'
      ORDER BY pg_total_relation_size(c.oid) DESC;
    `;

		return formatSuccessResponse<TableSizeMetrics>(result, startTime);
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'Failed to retrieve schema data usage metrics',
			data: [],
			meta: {
				query: 'Internal Size Metrics Query',
				executionTimeMs: formatExecutionTime(startTime),
			},
		};
	}
};

export const getTableRLS = async (
  dbUrl: string,
  tableName: string,
  schemaName = 'public',
): Promise<RLSQueryResult> => {
  const startTime = performance.now();
  try {
    const client = getClient(dbUrl);

    const result = await client`
      SELECT
        c.relrowsecurity AS "isRlsEnabled",
        c.relforcerowsecurity AS "isRlsForced",
        p.polname AS "policyName",
        CASE p.polcmd
          WHEN 'r' THEN 'SELECT'
          WHEN 'a' THEN 'INSERT'
          WHEN 'w' THEN 'UPDATE'
          WHEN 'd' THEN 'DELETE'
          WHEN '*' THEN 'ALL'
          ELSE NULL
        END AS "command",
        CASE 
          WHEN p.polroles = '{0}'::oid[] THEN 'PUBLIC'
          ELSE COALESCE(
            (SELECT string_agg(rolname, ', ') 
             FROM pg_catalog.pg_roles 
             WHERE oid = ANY(p.polroles)), 
            'PUBLIC'
          )
        END AS "roles",
        pg_catalog.pg_get_expr(p.polqual, p.polrelid) AS "usingExpression",
        pg_catalog.pg_get_expr(p.polwithcheck, p.polrelid) AS "withCheckExpression"
      FROM pg_catalog.pg_class c
      JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      LEFT JOIN pg_catalog.pg_policy p ON p.polrelid = c.oid
      WHERE c.relname = ${tableName}
        AND n.nspname = ${schemaName}
        AND c.relkind = 'r';
    `;

    return formatSuccessResponse<RLSInfo>(result, startTime);
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to retrieve row level security setup',
      data: [],
      meta: {
        query: 'Internal Schema Query',
        executionTimeMs: formatExecutionTime(startTime),
      },
    };
  }
};