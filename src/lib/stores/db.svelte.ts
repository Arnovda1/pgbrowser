import { browser } from '$app/environment';
import type { DbConnection } from '$lib/types';
import { createDbUrl } from '$lib/util/db-helpers';
import { queryHistory } from './query-history.svelte';

class Db {
	#connection: DbConnection | undefined = $state(
		browser && localStorage.getItem('db_connection')
			? JSON.parse(localStorage.getItem('db_connection')!)
			: undefined,
	);
	#initialDatabase: string = $state(
		browser && localStorage.getItem('db_connection_initial_db')
			? localStorage.getItem('db_connection_initial_db')!
			: 'postgres',
	);

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					if (this.#connection) {
						localStorage.setItem('db_connection', JSON.stringify(this.#connection));
					} else {
						localStorage.removeItem('db_connection');
					}
					if (this.#initialDatabase) {
						localStorage.setItem('db_connection_initial_db', this.#initialDatabase);
					}
				});
			});
		}
	}

	get connection(): DbConnection | undefined {
		return this.#connection;
	}

	get initialDatabase(): string {
		return this.#initialDatabase;
	}

	getUrl(database: string, schema?: string): string | undefined {
		if (!this.#connection) return;
		return createDbUrl(this.#connection, database, schema);
	}

	setConnection(config: DbConnection, database: string): void {
		this.#connection = config;
		this.#initialDatabase = database;
	}

	disconnect(): void {
		this.#connection = undefined;
		this.#initialDatabase = 'postgres';
		queryHistory.clear();
	}
}

const db = new Db();
export default db;
