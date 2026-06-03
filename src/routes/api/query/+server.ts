import { executeQuery } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request, url }) => {
	const dbUrl = url.searchParams.get('db');
	const { query } = await request.json();

	if (!dbUrl || !query) throw error(400, { message: 'Missing dbUrl or query' });

	try {
		const result = await executeQuery(dbUrl, query);
		return json(result);
	} catch (err: any) {
		return json({ error: err.message }, { status: 400 });
	}
};
