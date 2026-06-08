import type { DbConnection } from '$lib/types';

export const createDbUrl = (
	config: DbConnection,
	database?: string,
	schema: string = 'public',
): string => {
	const protocol = `${config.type}://`;
	const url: URL = new URL(`${protocol}${config.host}`);

	url.username = config.username;
	if (config.password) url.password = config.password;
	if (config.port) url.port = String(config.port);

	url.pathname = `/${database}`;

	if (config.type === 'postgres') {
		if (config.ssl) {
			url.searchParams.set('sslmode', 'require');
		}
		if (schema) {
			url.searchParams.set('options', `-c search_path=${schema}`);
		}
	}

	return url.toString();
};


export const oneLineQuery = (str: string): string => {
  return str.split('\n').map(l => l.trim()).filter(Boolean).join(' ');
}
