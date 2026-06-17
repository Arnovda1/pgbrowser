import { test as setup } from '@playwright/test';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import fs from 'node:fs';
import postgres from 'postgres';
import { dbConnection, dbCredentials, TEMP_CONFIG_FILE } from './db.config';

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

	fs.writeFileSync(TEMP_CONFIG_FILE, JSON.stringify(configData, null, 2));

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

	await client`
    CREATE VIEW user_emails AS
    SELECT email FROM users;
  `;

	await client`
    CREATE FUNCTION get_user_count() RETURNS integer AS $$
    BEGIN
      RETURN (SELECT count(*) FROM users);
    END;
    $$ LANGUAGE plpgsql;
  `;

	await client`
    CREATE PROCEDURE add_new_user(new_name VARCHAR, new_email VARCHAR) AS $$
    BEGIN
      INSERT INTO users (name, email) VALUES (new_name, new_email);
    END;
    $$ LANGUAGE plpgsql;
  `;

	await client.end();
});
