import { expect, test } from '@playwright/test';
import { dbConnection, dbCredentials } from '../db.config';

test.use({ storageState: { cookies: [], origins: [] } });

test('should log into the database client', async ({ page }) => {
	await page.goto('http://localhost:5173');
	await expect(page).toHaveURL('http://localhost:5173/connect');

	await page.fill('input[name="username"]', dbCredentials.user);
	await page.fill('input[name="password"]', dbCredentials.password);
	await page.fill('input[name="host"]', String(dbConnection.host));
	await page.fill('input[name="port"]', String(dbConnection.port));
	await page.fill('input[name="database"]', String(dbCredentials.database));

	await page.click('button[type="submit"]');
	await expect(page.getByTitle(`${dbConnection.host}:${dbConnection.port}`)).toBeVisible();
});
