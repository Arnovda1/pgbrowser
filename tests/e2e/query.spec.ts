import { expect, test } from '@playwright/test';

test('should execute a SQL query and show results', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public/query');

	const editor = page.locator('.cm-content');
	await editor.click();
	await page.keyboard.type('SELECT name, email FROM users ORDER BY id;');

	await page.getByRole('button', { name: 'Execute', exact: true }).click();

	await expect(page.getByText('Alice', { exact: true })).toBeVisible();
	await expect(page.getByText('alice@example.com', { exact: true })).toBeVisible();
	await expect(page.getByText('Bob', { exact: true })).toBeVisible();
	await expect(page.getByText('bob@example.com', { exact: true })).toBeVisible();
});

test('should show query in history', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public/query');

	const editor = page.locator('.cm-content');
	await editor.click();
	const sql = `SELECT 'history-test-' || now();`;
	await page.keyboard.type(sql);

	await page.getByRole('button', { name: 'Execute', exact: true }).click();

	await expect(page.getByRole('button').filter({ hasText: "SELECT 'history" })).toBeVisible();
});
