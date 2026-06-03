import { dbUrl, headers, logRes } from './helpers';

const res = await fetch(`http://localhost:5173/api/query${dbUrl}`, {
	method: 'POST',
	headers,
	body: JSON.stringify({
		query: 'SELECT * FROM lego_sets LIMIT 10',
	}),
});

logRes(res);

export {};
