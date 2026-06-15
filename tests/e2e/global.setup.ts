import { test as setup } from '@playwright/test';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { dbConnection, dbCredentials } from './db.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let postgresContainer: StartedPostgreSqlContainer;

setup('start and seed temporary postgres', async () => {
	postgresContainer = await new PostgreSqlContainer('postgres:17-alpine')
		.withDatabase(dbCredentials.database)
		.withUsername(dbCredentials.user)
		.withPassword(dbCredentials.password)
		.start();

	const configData = {
		uri: postgresContainer.getConnectionUri(),
		host: postgresContainer.getHost(),
		port: String(postgresContainer.getPort()),
	};

	const tempConfigPath = path.join(__dirname, '../.test-db-config.json');
	fs.writeFileSync(tempConfigPath, JSON.stringify(configData, null, 2));

	// For teardown script
	(globalThis as any).__POSTGRES_CONTAINER__ = postgresContainer;

	const client = postgres(dbConnection.uri);
	await client`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE
    );
  `;
	await client`
    INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('John Doe', 'john.doe@example.com')
    ;
  `;
	await client.end();
});
