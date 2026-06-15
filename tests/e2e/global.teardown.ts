import { test as teardown } from '@playwright/test';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

teardown('stop temporary postgres', async () => {
	const container: StartedPostgreSqlContainer = (globalThis as any).__POSTGRES_CONTAINER__;
	if (container) {
		fs.writeFileSync(path.join(__dirname, '../logs.txt'), (await container.logs()).read());
		await container.stop();
	}

	const tempConfigPath = path.join(__dirname, '../.test-db-config.json');
	if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
});
