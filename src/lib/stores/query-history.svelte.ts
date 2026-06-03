type Query = {
	id: string;
	query: string;
	error: boolean;
	amount: number;
	timestamp: Date;
};

class QueryHistoryStore {
	#queries = $state<Query[]>([]);
	#storageKey = 'query_history_store';

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem(this.#storageKey);
			if (saved) {
				try {
					this.#queries = JSON.parse(saved);
				} catch (e) {
					console.error('Failed to parse query_history_store from localStorage', e);
				}
			}

			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(this.#storageKey, JSON.stringify(this.#queries));
				});
			});
		}
	}

	get list() {
		return this.#queries;
	}

	add(query: string, error: boolean) {
		const prevQuery: undefined | Query = this.#queries[0];
		if (prevQuery?.query === query) {
			this.#queries[0] = {
				...prevQuery,
				amount: prevQuery.amount + 1,
			};
			return;
		}

		const newQuery: Query = {
			id: crypto.randomUUID(),
			query,
			error,
			amount: 1,
			timestamp: new Date(),
		};

		this.#queries.unshift(newQuery);
	}

	remove(id: string) {
		this.#queries = this.#queries.filter(q => q.id !== id);
	}

	clear() {
		this.#queries = [];
	}
}

export const queryHistory = new QueryHistoryStore();
