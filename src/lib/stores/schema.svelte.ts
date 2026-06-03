export interface SchemaStructure {
	[name: string]: any;
}

class SchemaStore {
	#structure = $state<SchemaStructure>({});
	#tables = $state<any[]>([]);

	get structure() {
		return this.#structure;
	}

	get tables() {
		return this.#tables;
	}

	setStructure(schema: string, columns: { tableName: string; columnName: string }[]) {
		const tableStructure: any = {};
		const tables: any[] = [];
		const seenTables = new Set<string>();

		const needsQuotes = (name: string) =>
			/[^a-zA-Z0-9_]/.test(name) || /[a-z][A-Z]/.test(name) || /^[0-9]/.test(name);

		for (const { tableName, columnName } of columns) {
			if (!tableStructure[tableName]) {
				const completion = {
					label: tableName,
					apply: needsQuotes(tableName) ? `"${tableName}"` : tableName,
					type: 'type',
					boost: 99,
				};
				tableStructure[tableName] = {
					self: completion,
					children: [],
				};
				if (!seenTables.has(tableName)) {
					tables.push(completion);
					seenTables.add(tableName);
				}
			}

			const columnCompletion = {
				label: columnName,
				apply: needsQuotes(columnName) ? `"${columnName}"` : columnName,
				type: 'property',
				boost: 90,
			};

			tableStructure[tableName].children.push(columnCompletion);
		}
		this.#structure = { [schema]: tableStructure };
		this.#tables = tables;
	}

	clear() {
		this.#structure = {};
		this.#tables = [];
	}
}

export const schemaStore = new SchemaStore();
