import { getSchemaSizeMetrics } from '$lib/services/db-service';
import type { TableSizeMetrics } from '$lib/types';

export const load = async ({ params }) => {
	let sizeMetrics: TableSizeMetrics[] = [];

	try {
		sizeMetrics = await getSchemaSizeMetrics(params);
	} catch {}

	return { sizeMetrics };
};
