import { getTriggers } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { error } from 'console';

export const GET = async ({ url, params }) => {
	const dbUrl = url.searchParams.get('db');
	const { schema } = params;

	if (!dbUrl) throw error(400, { message: 'Missing dbUrl' });

	try {
		const result = await getTriggers(dbUrl, schema);
		return json(result);
	} catch (err: any) {
		return json({ error: err.message }, { status: 400 });
	}
};
