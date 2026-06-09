import type { DbConnectionConfig } from './schemas';

export const dbTypes = ['postgres'];

export type TableSizeMetrics = {
	tableName: string;
	rowCount: number;
	dataSizeRaw: number;
	dataSizePretty: string;
	indexSizeRaw: number;
	indexSizePretty: string;
	toastSizeRaw: number;
	toastSizePretty: string;
	totalSizeRaw: number;
	totalSizePretty: string;
};

export type Column = {
	columnName: string;
	dataType: string;
	isNullable: 'YES' | 'NO';
	columnDefault: string | null;
	isPrimaryKey: boolean;
	referencedTable: string | null;
	referencedColumn: string | null;
};

export type Row = Record<string, unknown>;

export type Routine = {
	name: string;
	routineType: 'FUNCTION' | 'PROCEDURE';
	returnType: 'trigger' | 'void' | 'boolean' | 'bigint' | 'record' | string;
};

export interface Trigger {
	triggerName: string;
	tableName: string;
	actionTiming: 'BEFORE' | 'AFTER' | 'INSTEAD OF' | string;
	eventManipulation: string;
	actionStatement: string;
	isEnabled: boolean;
}

export type RoutineDetails = {
	oid: number;
	name: string;
	routineType: 'FUNCTION' | 'PROCEDURE';
	language: string;
	returnType: string;
	argumentSignature: string;
	body: string;
	behaviorType: 'IMMUTABLE' | 'STABLE' | 'VOLATILE';
};

export type TableIndex = {
	indexName: string;
	columns: string;
	isUnique: boolean;
	isPrimaryKey: boolean;
	indexDefinition: string;
};

export type CheckConstraint = {
	constraintName: string;
	checkExpression: string;
};

export type ForeignKey = {
	constraintName: string;
	columnName: string;
	referencedTable: string;
	referencedColumn: string;
	onUpdate: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
	onDelete: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION';
};

export type DbConnection = Omit<DbConnectionConfig, 'database'>;

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

export type DbResponse<T> =
	| {
			success: true;
			error: null;
			data: T[];
			meta: SuccessMeta;
	  }
	| {
			success: false;
			error: string;
			data: never[];
			meta: FailureMeta;
	  };

export type RLSInfo = {
	isRlsEnabled: boolean;
	isRlsForced: boolean;
	policyName: string | null;
	command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL' | null;
	roles: string | null;
	usingExpression: string | null;
	withCheckExpression: string | null;
};

export type TableSizeMetricsQueryResult = DbResponse<TableSizeMetrics>;
export type QueryResult = DbResponse<unknown>;
export type ColumnQueryResult = DbResponse<Column>;
export type RoutineQueryResult = DbResponse<Routine>;
export type RoutineDetailsQueryResult = DbResponse<RoutineDetails>;
export type TriggerQueryResult = DbResponse<Trigger>;
export type CheckConstraintQueryResult = DbResponse<CheckConstraint>;
export type ForeignKeyQueryResult = DbResponse<ForeignKey>;
export type TableIndexQueryResult = DbResponse<TableIndex>;
export type RLSQueryResult = DbResponse<RLSInfo>;
