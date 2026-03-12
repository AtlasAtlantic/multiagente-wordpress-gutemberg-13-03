const { test, expect } = require('@playwright/test');
const { loginToWpAdmin } = require('./helpers/wp-admin');

test('wp-admin login smoke', async ({ page }) => {
	await loginToWpAdmin(page);
	await expect(page).toHaveURL(/wp-admin/);
});
