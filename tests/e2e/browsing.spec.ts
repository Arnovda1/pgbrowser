import { expect, test } from '@playwright/test';

test('should browse table data', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public/table/users/select');

	await expect(page.getByText('Alice', { exact: true })).toBeVisible();
	await expect(page.getByText('alice@example.com', { exact: true })).toBeVisible();
	await expect(page.getByText('Bob', { exact: true })).toBeVisible();
	await expect(page.getByText('bob@example.com', { exact: true })).toBeVisible();
	await expect(page.getByText('John Doe', { exact: true })).toBeVisible();
	await expect(page.getByText('john.doe@example.com', { exact: true })).toBeVisible();
});
