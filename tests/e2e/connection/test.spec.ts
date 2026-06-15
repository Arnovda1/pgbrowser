import { expect, test } from '@playwright/test';
import { dbConnection } from '../db.config';

test('should look at the database dashboard while already logged in', async ({ page }) => {
	await page.goto('http://localhost:5173');
	await expect(page).toHaveURL('http://localhost:5173/db/db');

	await expect(page.getByTitle(`${dbConnection.host}:${dbConnection.port}`)).toBeVisible();
});
