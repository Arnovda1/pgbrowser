import db from '$lib/stores/db.svelte';
import type {
	CheckConstraint,
	CheckConstraintQueryResult,
	Column,
	ColumnQueryResult,
	DbResponse,
	ForeignKey,
	ForeignKeyQueryResult,
	QueryResult,
	RLSInfo,
	RLSQueryResult,
	Routine,
	RoutineDetails,
	RoutineDetailsQueryResult,
	RoutineQueryResult,
	TableIndex,
	TableIndexQueryResult,
	TableSizeMetrics,
	TableSizeMetricsQueryResult,
	Trigger,
	TriggerQueryResult,
} from '$lib/types';
import { oneLineQuery } from '$lib/util/db-helpers';
import apiClient from './api-client';

interface Params {
	database?: string;
	schema?: string;
	table?: string;
}

const encodedDbUrl = (params: Params): string | undefined => {
	if (!params.database) return;
	const dbUrl = db.getUrl(params.database, params.schema);
	if (!dbUrl) return;

	return encodeURIComponent(dbUrl);
};

export const query = async <T>(params: Params, query: string): Promise<DbResponse<T>> => {
	const res = await apiClient.post(`/api/query?db=${encodedDbUrl(params)}`, {
		query: oneLineQuery(query),
	});

	return res.data;
};

export const checkConnection = async (
	dbUrl: string,
	signal?: AbortSignal,
): Promise<DbResponse<any>> => {
	const res = await apiClient.post<DbResponse<any>>(
		`/api/query?db=${encodeURIComponent(dbUrl)}`,
		{ query: 'SELECT 1' },
		{ signal },
	);
	return res.data;
};

export const getViews = async (params: Params): Promise<string[]> => {
	const result = await query<{ viewName: string }>(
		params,
		`SELECT c.relname AS "viewName" FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = '${params.schema || 'public'}' AND c.relkind IN ('v', 'm') ORDER BY c.relname;`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data.map(r => r.viewName);
};

export const getTables = async (params: Params): Promise<string[]> => {
	const result = await query<{ tableName: string }>(
		params,
		`SELECT table_name AS "tableName" FROM information_schema.tables WHERE table_schema = '${params.schema || 'public'}' AND table_type = 'BASE TABLE' ORDER BY table_name;`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data.map(r => r.tableName);
};

export const getAllColumns = async (
	params: Params,
): Promise<{ tableName: string; columnName: string }[]> => {
	const result = await query<{ tableName: string; columnName: string }>(
		params,
		`SELECT table_name AS "tableName", column_name AS "columnName" FROM information_schema.columns WHERE table_schema = '${params.schema || 'public'}' ORDER BY table_name, ordinal_position;`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getSchemas = async (params: Params): Promise<string[]> => {
	const result = await query<{ schemaName: string }>(
		params,
		`SELECT schema_name AS "schemaName" FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema';`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data.map(s => s.schemaName);
};

export const getDatabases = async (params: Params): Promise<string[]> => {
	const result = await query<{ databaseName: string }>(
		params,
		`SELECT datname AS "databaseName" FROM pg_catalog.pg_database WHERE datistemplate = false ORDER BY datname;`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data.map(d => d.databaseName);
};

export const getRecords = async (params: Params, offset?: number): Promise<QueryResult> => {
	const offsetString = offset ? ` OFFSET ${offset}` : '';
	return await query<QueryResult>(
		params,
		`SELECT * FROM ${params.schema}.${params.table} LIMIT 50${offsetString};`,
	);
};

export const getTableColumns = async (params: Params): Promise<Column[]> => {
	const { data: result } = await apiClient.get<ColumnQueryResult>(
		`/api/schemas/${params.schema}/tables/${params.table}/columns?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getRoutines = async (params: Params): Promise<Routine[]> => {
	const { data: result } = await apiClient.get<RoutineQueryResult>(
		`/api/schemas/${params.schema}/routines?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getRoutineDetails = async (
	params: Params & { routineName: string },
): Promise<RoutineDetails[]> => {
	const { data: result } = await apiClient.get<RoutineDetailsQueryResult>(
		`/api/schemas/${params.schema}/routines/${params.routineName}?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getTriggers = async (params: Params): Promise<Trigger[]> => {
	const { data: result } = await apiClient.get<TriggerQueryResult>(
		`/api/schemas/${params.schema}/triggers?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getCheckConstraints = async (params: Params): Promise<CheckConstraint[]> => {
	const { data: result } = await apiClient.get<CheckConstraintQueryResult>(
		`/api/schemas/${params.schema}/tables/${params.table}/check-constraints?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getForeignKeys = async (params: Params): Promise<ForeignKey[]> => {
	const { data: result } = await apiClient.get<ForeignKeyQueryResult>(
		`/api/schemas/${params.schema}/tables/${params.table}/foreign-keys?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getTableIndexes = async (params: Params): Promise<TableIndex[]> => {
	const { data: result } = await apiClient.get<TableIndexQueryResult>(
		`/api/schemas/${params.schema}/tables/${params.table}/indexes?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getSchemaSizeMetrics = async (params: Params): Promise<TableSizeMetrics[]> => {
	const { data: result } = await apiClient.get<TableSizeMetricsQueryResult>(
		`/api/schemas/${params.schema}/size-metrics?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};

export const getTableRLS = async (params: Params): Promise<RLSInfo[]> => {
	const { data: result } = await apiClient.get<RLSQueryResult>(
		`/api/schemas/${params.schema}/tables/${params.table}/rls?db=${encodedDbUrl(params)}`,
	);

	if (!result.success) throw new Error(result.error);

	return result.data;
};
