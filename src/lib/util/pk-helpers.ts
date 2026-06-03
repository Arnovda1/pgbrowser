export const getPkValue = (
	record: Record<string, any>,
	primaryKey?: string | string[],
): string | undefined => {
	if (!primaryKey || !record) return undefined;

	if (Array.isArray(primaryKey)) {
		const keys = primaryKey.map(key => record[key]);
		return JSON.stringify(keys);
	}

	return record[primaryKey]?.toString();
};

export const getWhereClause = async (
	pkValue: string,
	primaryKey: string | string[],
): Promise<string> => {
	let whereClause = '';

	if (Array.isArray(primaryKey)) {
		const parsedValues: any[] = JSON.parse(pkValue as string);

		whereClause = primaryKey.map((col, idx) => `"${col}" = '${parsedValues[idx]}'`).join(' AND ');
	} else {
		whereClause = `"${primaryKey}" = '${pkValue}'`;
	}

	return whereClause;
};
