import { z } from 'zod';

// const baseConnectSchena = z.object({
// 	host: z.string().min(1, 'Host is required'),
// 	username: z.string().min(1, 'Username is required'),
// 	password: z.string().optional(),
// 	database: z.string(),
// });

const postgresSchema = z.object({
	host: z.string().min(1, 'Host is required'),
	username: z.string().min(1, 'Username is required').default('postgres'),
	password: z.string().optional(),
	database: z.string().default('postgres'),
	type: z.literal('postgres'),
	port: z.number().int().positive().default(5432),
	ssl: z.boolean().default(false),
});

// const mariadbSchema = baseConnectSchena.extend({
// 	type: z.literal('mariadb'),
// 	port: z.number().int().positive().default(3306),
// });

// const mongodbSchema = baseConnectSchena.extend({
// 	type: z.literal('mongodb'),
// 	port: z.number().int().positive().default(3306),
// });

// const sqliteSchema = z.object({
// 	type: z.literal('sqlite'),
// 	// Handles either a file path or the special ':memory:' string
// 	filePath: z.string().min(1, 'File path or ":memory:" is required'),
// 	inMemory: z.boolean().default(false),
// });

export const dbConnectionSchema = z.discriminatedUnion('type', [
	postgresSchema,
	// mariadbSchema,
	// mongodbSchema,
	// sqliteSchema,
]);

export type DbConnectionConfig = z.infer<typeof dbConnectionSchema>;
