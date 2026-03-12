const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
	testDir: './e2e',
	testMatch: ['**/*.spec.js'],
	timeout: 60000,
	expect: {
		timeout: 10000,
	},
	fullyParallel: false,
	retries: 0,
	reporter: 'list',
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://wordpress-ai.local',
		ignoreHTTPSErrors: true,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],
});
