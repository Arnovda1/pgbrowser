import {
	getCheckConstraints,
	getForeignKeys,
	getTableColumns,
	getTableIndexes,
	getTableRLS,
} from '$lib/services/db-service.js';
import type { CheckConstraint, Column, ForeignKey, RLSInfo, TableIndex } from '$lib/types.js';

export const load = async ({ params }) => {
	let columns: Column[] = [];
	let foreignKeys: ForeignKey[] = [];
	let indexes: TableIndex[] = [];
	let checkConstraints: CheckConstraint[] = [];
	let rls: RLSInfo[] = [];

	try {
		columns = await getTableColumns(params);
		foreignKeys = await getForeignKeys(params);
		indexes = await getTableIndexes(params);
		checkConstraints = await getCheckConstraints(params);
		rls = await getTableRLS(params);
	} catch {}

	return { columns, foreignKeys, indexes, checkConstraints, rls };
};
