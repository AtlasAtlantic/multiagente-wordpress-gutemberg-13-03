// Tests E2E básicos para el plugin WP Multi Blocks

import { test, expect } from '@playwright/test';
import { loginToWpAdmin, ensurePluginActivated, openNewPostEditor, getEditorCanvas } from './helpers/wp-admin';

async function createPostWithTitle(page, title) {
	await openNewPostEditor(page);
	await getEditorCanvas(page).getByRole('textbox', { name: /Add title|Añadir título/i }).fill(title);
}

test.describe('WP Multi Blocks - bloques Gutenberg', () => {
	test.beforeEach(async ({ page }) => {
		await loginToWpAdmin(page);
		await ensurePluginActivated(page, 'wp-multi-blocks');
	});

	test('los bloques aparecen en el inserter', async ({ page }) => {
		await createPostWithTitle(page, 'Prueba bloques multi');

		await page.getByRole('button', { name: 'Añadir bloque' }).click();
		const search = page.getByPlaceholder('Buscar bloques');
		await search.fill('CTA');
		await expect(page.getByRole('option', { name: /CTA/i })).toBeVisible();

		await search.fill('Testimonio');
		await expect(page.getByRole('option', { name: /Testimonio/i })).toBeVisible();

		await search.fill('Lista de posts');
		await expect(page.getByRole('option', { name: /Lista de posts/i })).toBeVisible();
	});

	test('bloque CTA se inserta y se muestra en el frontal', async ({ page }) => {
		await createPostWithTitle(page, 'Prueba CTA');

		await page.getByRole('button', { name: 'Añadir bloque' }).click();
		await page.getByPlaceholder('Buscar bloques').fill('CTA');
		await page.getByRole('option', { name: /CTA/i }).click();

		await page.getByRole('textbox', { name: /Título de la llamada a la acción/i }).fill('Título CTA');
		await page.getByRole('textbox', { name: /Texto descriptivo/i }).fill('Texto CTA');
		await page.getByRole('textbox', { name: /Texto del botón/i }).fill('Ir a CTA');

		await page.getByRole('button', { name: 'Publicar' }).click();
		await page.getByRole('button', { name: 'Publicar' }).click();
		await page.getByRole('link', { name: 'Ver entrada' }).click();

		await expect(page.getByRole('heading', { name: 'Título CTA' })).toBeVisible();
		await expect(page.getByText('Texto CTA')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Ir a CTA' })).toBeVisible();
	});

	test('bloque Testimonio se inserta y se muestra en el frontal', async ({ page }) => {
		await createPostWithTitle(page, 'Prueba Testimonio');

		await page.getByRole('button', { name: 'Añadir bloque' }).click();
		await page.getByPlaceholder('Buscar bloques').fill('Testimonio');
		await page.getByRole('option', { name: /Testimonio/i }).click();

		const quoteBox = page.getByRole('textbox').nth(1);
		await quoteBox.fill('Esta es una cita de prueba.');

		const authorBox = page.getByRole('textbox').nth(2);
		await authorBox.fill('Nombre Autor');

		const roleBox = page.getByRole('textbox').nth(3);
		await roleBox.fill('Cargo de prueba');

		await page.getByRole('button', { name: 'Publicar' }).click();
		await page.getByRole('button', { name: 'Publicar' }).click();
		await page.getByRole('link', { name: 'Ver entrada' }).click();

		await expect(page.getByText('Esta es una cita de prueba.')).toBeVisible();
		await expect(page.getByText('Nombre Autor')).toBeVisible();
		await expect(page.getByText('Cargo de prueba')).toBeVisible();
	});

	test('bloque Lista de posts muestra entradas en el frontal', async ({ page }) => {
		// Crear un par de entradas rápidas
		for ( let i = 1; i <= 2; i++ ) {
			await page.goto('/wp-admin/post-new.php');
			await page.getByRole('textbox', { name: 'Añadir título' }).fill(`Entrada ${ i }`);
			await page.getByRole('button', { name: 'Publicar' }).click();
			await page.getByRole('button', { name: 'Publicar' }).click();
		}

		await createPostWithTitle(page, 'Prueba Lista de posts');

		await page.getByRole('button', { name: 'Añadir bloque' }).click();
		await page.getByPlaceholder('Buscar bloques').fill('Lista de posts');
		await page.getByRole('option', { name: /Lista de posts/i }).click();

		await page.getByRole('button', { name: 'Publicar' }).click();
		await page.getByRole('button', { name: 'Publicar' }).click();
		await page.getByRole('link', { name: 'Ver entrada' }).click();

		await expect(page.getByRole('list')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Entrada 1' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Entrada 2' })).toBeVisible();
	});
});

