import { expect, test } from '@playwright/test';

test('should execute a function (get_user_count)', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public/routine/get_user_count');

	const runButton = page.getByRole('button', { name: 'Run', exact: true });
	await runButton.click();

	await expect(page.getByRole('table').getByText('3', { exact: true })).toBeVisible();
});

test('should execute a procedure (add_new_user)', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public/routine/add_new_user');

	const editors = page.locator('.cm-content');
	const executorEditor = editors.nth(1);
	await executorEditor.click();

	await page.keyboard.press('Meta+A'); // select all
	await page.keyboard.press('Backspace');
	await page.keyboard.type("CALL add_new_user('Charlie', 'charlie@example.com');");

	const runButton = page.getByRole('button', { name: 'Run', exact: true });
	await runButton.click();

	await expect(page.locator('text=Error')).not.toBeVisible();

	await page.goto('http://localhost:5173/db/db/schema/public/routine/get_user_count');
	await page.getByRole('button', { name: 'Run', exact: true }).click();
	await expect(page.getByText('4', { exact: true })).toBeVisible();
});
