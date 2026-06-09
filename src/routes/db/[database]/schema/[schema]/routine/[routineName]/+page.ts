import { getRoutineDetails } from '$lib/services/db-service';
import type { RoutineDetails } from '$lib/types';

export const load = async ({ params }) => {
	let routineDetails: RoutineDetails[] = [];

	try {
		routineDetails = await getRoutineDetails(params);
	} catch {}

	return { routineDetails };
};
