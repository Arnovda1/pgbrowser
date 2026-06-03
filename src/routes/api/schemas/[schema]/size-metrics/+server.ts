import { getSchemaDataUsage } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ url, params }) => {
	const dbUrl = url.searchParams.get('db');
	const { schema } = params;

	if (!dbUrl) throw error(400, { message: 'Missing dbUrl' });

	try {
		const result = await getSchemaDataUsage(dbUrl, schema);
		return json(result);
	} catch (err: any) {
		return json({ error: err.message }, { status: 400 });
	}
};
