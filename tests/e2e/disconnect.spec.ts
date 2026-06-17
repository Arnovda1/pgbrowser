import test, { expect } from '@playwright/test';

test('should disconnect from the database', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db');
	await page.waitForLoadState('networkidle');

	const disconnectBtn = page.getByTitle('Disconnect from server');
	await expect(disconnectBtn).toBeVisible();

	await disconnectBtn.click();

	const disconnectAction = page
		.locator('[data-slot="alert-dialog-action"]')
		.filter({ hasText: /^Disconnect$/ });
	await disconnectAction.click();

	await expect(page).toHaveURL('http://localhost:5173/connect');

	// Verify that navigating back to /db/db redirects to /connect
	await page.goto('http://localhost:5173/db/db');
	await expect(page).toHaveURL('http://localhost:5173/connect');
});
