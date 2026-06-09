import {
	getAllColumns,
	getDatabases,
	getRoutines,
	getSchemas,
	getTables,
	getTriggers,
	getViews,
} from '$lib/services/db-service';
import type { Routine, Trigger } from '$lib/types';

export const load = async ({ params }) => {
	const { schema } = params;

	let views: string[] = [];
	let tables: string[] = [];
	let databases: string[] = [];
	let schemas: string[] = [];
	let routines: Routine[] = [];
	let triggers: Trigger[] = [];
	let columns: { tableName: string; columnName: string }[] = [];

	try {
		if (schema) {
			views = await getViews(params);
			tables = await getTables(params);
			routines = await getRoutines(params);
			triggers = await getTriggers(params);
			columns = await getAllColumns(params);
		}

		schemas = await getSchemas(params);
		databases = await getDatabases(params);
	} catch {}

	return { views, tables, schemas, databases, routines, triggers, columns };
};
