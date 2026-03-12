const { expect } = require('@playwright/test');

const WP_ADMIN_USER = process.env.WP_ADMIN_USER || 'admin';
const WP_ADMIN_PASSWORD = process.env.WP_ADMIN_PASSWORD || 'admin123456';

async function loginToWpAdmin(page) {
	await page.goto('/wp-login.php');

	if (page.url().includes('/wp-admin')) {
		return;
	}

	await page.fill('#user_login', WP_ADMIN_USER);
	await page.fill('#user_pass', WP_ADMIN_PASSWORD);
	await Promise.all([
		page.waitForNavigation(),
		page.click('#wp-submit'),
	]);

	await expect(page).toHaveURL(/wp-admin/);
}

async function dismissEditorChrome(page) {
	const selectors = [
		'button[aria-label="Close dialog"]',
		'button[aria-label="Close"]',
		'.components-guide__finish-button',
		'button:has-text("Got it")',
	];

	for (const selector of selectors) {
		const locator = page.locator(selector);
		if (await locator.count()) {
			await locator.first().click().catch(() => {});
		}
	}
}

async function openNewPostEditor(page) {
	await page.goto('/wp-admin/post-new.php');
	await page.waitForSelector('.edit-post-layout');
	await dismissEditorChrome(page);
}

module.exports = {
	loginToWpAdmin,
	openNewPostEditor,
};
