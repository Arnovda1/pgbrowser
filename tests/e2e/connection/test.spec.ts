import { expect, test } from '@playwright/test';

test('should look at the database dashboard while already logged in', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db');

	await expect(page.locator('text=Alice')).toBeVisible();
});
