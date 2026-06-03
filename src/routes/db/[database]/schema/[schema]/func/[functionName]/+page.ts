import { getFunctionDetails } from '$lib/services/db-service';
import type { FuncDetails } from '$lib/types';

export const load = async ({ params }) => {
	let functionDetails: FuncDetails[] = [];

	try {
		functionDetails = await getFunctionDetails(params);
	} catch {}

	return { functionDetails };
};
