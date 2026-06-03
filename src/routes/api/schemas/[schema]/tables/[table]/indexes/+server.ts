import { getTableIndexes } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ url, params }) => {
	const dbUrl = url.searchParams.get('db');
	const { schema, table } = params;

	if (!dbUrl) throw error(400, { message: 'Missing dbUrl' });

	try {
		const result = await getTableIndexes(dbUrl, table, schema);
		return json(result);
	} catch (err: any) {
		return json({ error: err.message }, { status: 400 });
	}
};
