import postgres from 'postgres';
import { dbUrlRaw } from './helpers';

const client = postgres(dbUrlRaw);

type SuccessMeta = {
	query: string;
	count: number;
	command: string;
	columns: {
		name: string;
		number: number;
		type: string;
	}[];
	executionTimeMs: number;
};

type FailureMeta = {
	query: string;
	executionTimeMs: number;
};

type QueryRes =
	| {
			success: true;
			error: null;
			data: unknown[];
			meta: SuccessMeta;
	  }
	| {
			success: false;
			error: string;
			data: never[];
			meta: FailureMeta;
	  };

const pgTypeMap: Record<number, string> = {
	16: 'boolean',
	20: 'bigint',
	21: 'smallint',
	23: 'integer',
	700: 'real',
	701: 'double precision',
	1042: 'char',
	1043: 'varchar',
	1082: 'date',
	1114: 'timestamp',
	1184: 'timestamptz',
	1700: 'numeric',
	3802: 'jsonb',
};

const getPgTypeName = (oid: number): string => pgTypeMap[oid] || `unknown(${oid})`;

export const executeQuery = async (query: string): Promise<QueryRes> => {
	const startTime = performance.now();

	try {
		let result = await client.unsafe(query);

		// if user executes multiple statements in 1 query
		if (Array.isArray(result) && !('command' in result)) {
			const resArray = result as any;
			result = resArray[resArray.length - 1];
		}

		const { count, command, columns: rawColumns } = result;

		const columns = rawColumns
			? rawColumns.map(col => ({
					name: col.name,
					number: col.number,
					type: getPgTypeName(col.type),
				}))
			: [];

		return {
			success: true,
			error: null,
			data: [...result],
			meta: {
				count: count ?? 0,
				command: command || 'UNKNOWN',
				columns,
				query,
				executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
			},
		};
	} catch (err: any) {
		return {
			success: false,
			error: err.message || 'An unknown database error occurred',
			data: [],
			meta: { query, executionTimeMs: Number((performance.now() - startTime).toFixed(2)) },
		};
	}
};

const res = await executeQuery('SELECT * FROM lego_sets LIMIT 3');

console.log(res);
if (!res.success) throw new Error();

console.log('------');
console.log(res.meta.columns);
