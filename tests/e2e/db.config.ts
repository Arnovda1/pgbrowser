import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const dbCredentials = {
	user: 'user',
	password: 'password',
	database: 'db',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONNECTION_FILE = path.join(__dirname, '.connection.json');
const TEMP_CONFIG_PATH = path.join(__dirname, '../.test-db-config.json');

function getSavedConfig() {
	if (fs.existsSync(TEMP_CONFIG_PATH)) {
		try {
			return JSON.parse(fs.readFileSync(TEMP_CONFIG_PATH, 'utf-8'));
		} catch {
			return {};
		}
	}
	return {};
}

export const dbConnection = {
	get uri() {
		return getSavedConfig().uri || '';
	},
	get host() {
		return getSavedConfig().host || '';
	},
	get port() {
		return getSavedConfig().port || '';
	},
};
