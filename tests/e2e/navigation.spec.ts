import { expect, test } from '@playwright/test';

test('should navigate through schemas and tables', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db');

	const sidebar = page.locator('aside, [data-sidebar="sidebar"]');

	await sidebar.getByRole('button', { name: 'public', exact: true }).click();
	await page.waitForURL(/\/db\/db\/schema\/public/);

	await expect(sidebar.getByRole('button', { name: 'users', exact: true })).toBeVisible();

	await sidebar.getByRole('button', { name: 'users', exact: true }).click();
	await page.waitForURL(/\/db\/db\/schema\/public\/table\/users/);

	const structurePanel = page
		.getByRole('tabpanel', { name: 'Table structure' })
		.or(page.locator('main'));
	await expect(structurePanel.getByText('id', { exact: true }).first()).toBeVisible();
	await expect(structurePanel.getByText('name', { exact: true }).first()).toBeVisible();
	await expect(structurePanel.getByText('email', { exact: true }).first()).toBeVisible();
});

test('should navigate to views', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public');
	await expect(page.getByRole('tabpanel', { name: 'Tables' })).toBeVisible();

	const sidebar = page.locator('aside, [data-sidebar="sidebar"]');
	await expect(sidebar.getByRole('button', { name: 'user_emails', exact: true })).toBeVisible();

	await sidebar.getByRole('button', { name: 'user_emails', exact: true }).click();
	await page.waitForURL(/\/db\/db\/schema\/public\/view\/user_emails/);
});

test('should navigate to routines tab', async ({ page }) => {
	await page.goto('http://localhost:5173/db/db/schema/public');
	await expect(page.getByRole('tabpanel', { name: 'Tables' })).toBeVisible();

	const tabs = page.getByRole('tablist');
	const routinesTab = tabs.getByRole('tab', { name: 'Routines', exact: true });

	await expect(routinesTab).toBeVisible();
	await routinesTab.click();

	await expect(page).toHaveURL(/\/db\/db\/schema\/public\?tab=routines/);

	const mainContent = page.locator('main');
	await expect(mainContent.getByRole('link', { name: 'get_user_count' })).toBeVisible();
	await expect(mainContent.getByRole('link', { name: 'add_new_user' })).toBeVisible();
});
