import { defineConfig, devices } from '@playwright/test';
import { CONNECTION_FILE } from './tests/e2e/db.config';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	reporter: [['html', { outputFolder: './tests/e2e/report' }]],
	use: { trace: 'retain-on-failure', screenshot: 'only-on-failure', video: 'on' },
	outputDir: './tests/e2e/out',
	timeout: 10_000,
	expect: { timeout: 10_000 },
	projects: [
		// Setup + connect and cleanup of db
		{
			name: 'setup db',
			testMatch: /global\.setup\.ts/,
			teardown: 'cleanup db',
			timeout: 30_000,
		},
		{
			name: 'setup connection',
			testMatch: /connect\.setup\.ts/,
			dependencies: ['setup db'],
		},
		{
			name: 'cleanup db',
			testMatch: /global\.teardown\.ts/,
		},
		// Main browser tests
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: CONNECTION_FILE },
			dependencies: ['setup connection'],
		},
		// { // only chromium right now
		// 	name: 'firefox',
		// 	use: { ...devices['Desktop Firefox'] },
		// 	dependencies: ['setup connection'],
		// },
		// {
		// 	name: 'webkit',
		// 	use: { ...devices['Desktop Safari'] },
		// 	dependencies: ['setup connection'],
		// },
	],
});
