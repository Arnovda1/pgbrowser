import {
	getAllColumns,
	getDatabases,
	getFunctions,
	getSchemas,
	getTables,
	getTriggers,
	getViews,
} from '$lib/services/db-service';
import type { Func, Trigger } from '$lib/types';

export const load = async ({ params }) => {
	const { schema } = params;

	let views: string[] = [];
	let tables: string[] = [];
	let databases: string[] = [];
	let schemas: string[] = [];
	let funcs: Func[] = [];
	let triggers: Trigger[] = [];
	let columns: { tableName: string; columnName: string }[] = [];

	try {
		if (schema) {
			views = await getViews(params);
			tables = await getTables(params);
			funcs = await getFunctions(params);
			triggers = await getTriggers(params);
			columns = await getAllColumns(params);
		}

		schemas = await getSchemas(params);
		databases = await getDatabases(params);
	} catch {}

	return { views, tables, schemas, databases, funcs, triggers, columns };
};
