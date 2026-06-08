import { describe, expect, test } from 'bun:test';
import { createDbUrl } from './db-helpers';

describe('createDbUrl', () => {
	const baseConfig = {
		type: 'postgres' as const,
		host: 'localhost',
		username: 'user',
		password: 'password',
		port: 5432,
		ssl: false,
	};

	test('should create a basic postgres URL', () => {
		const url = createDbUrl(baseConfig, 'mydb');
		expect(url).toBe(
			'postgres://user:password@localhost:5432/mydb?options=-c+search_path%3Dpublic',
		);
	});

	test('should include sslmode=require when ssl is true', () => {
		const url = createDbUrl({ ...baseConfig, ssl: true }, 'mydb');
		expect(url).toContain('sslmode=require');
		expect(url).toContain('options=-c+search_path%3Dpublic');
	});

	test('should set search_path when schema is provided', () => {
		const url = createDbUrl(baseConfig, 'mydb', 'myschema');
		expect(url).toContain('options=-c+search_path%3Dmyschema');
	});

	test('should handle missing password', () => {
		const configWithoutPass = { ...baseConfig, password: '' };
		const url = createDbUrl(configWithoutPass, 'mydb');
		expect(url).toBe('postgres://user@localhost:5432/mydb?options=-c+search_path%3Dpublic');
	});
});
