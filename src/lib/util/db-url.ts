import type { DbConnection } from '$lib/types';

const createDbUrl = (
	config: DbConnection,
	database?: string,
	schema: string = 'public',
): string => {
	// if (config.type === 'sqlite') {
	// 	return config.filePath;
	// }

	let protocol = `${config.type}://`;

	// if (config.type === 'mongodb' && config.host.includes('.mongodb.net')) {
	// 	protocol = 'mongodb+srv://';
	// }

	let url: URL = new URL(`${protocol}${config.host}`);

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

export default createDbUrl;
