import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:3000/menu';

test.describe('Testes de UI para a Página de Menu', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('Deve validar elementos essenciais da página', async ({ page }) => {
    
    await test.step('Valida o título e textos principais', async () => {
      await expect(page).toHaveTitle('Menu de Opções');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Crie um Novo Registro');
      await expect(page.locator('.subtitle')).toHaveText('Selecione uma das opções a baixo');
    });

    await test.step('Validar links do Navbar', async () => {
      await expect(page.locator('.nav-link')).toHaveCount(6);
    });

    await test.step('Validar quantidade de botões de redirecionamento', async () => {
      await expect(page.locator('.btn-redirect')).toHaveCount(4);
    });

  });

  test('Deve validar redirecionamento pelo botão POST', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'POST' })).toBeVisible();

    await page.getByRole('button', { name: 'POST' }).click();
    await expect(page).toHaveURL('http://localhost:3000/posts');
  });

  test('Deve validar redirecionamento pelo botão ALBUM', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'ALBUM' })).toBeVisible();

    await page.getByRole('button', { name: 'ALBUM' }).click();
    await expect(page).toHaveURL('http://localhost:3000/albums');
  });

  test('Deve validar redirecionamento pelo botão TODOS', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'TODOS' })).toBeVisible();

    await page.getByRole('button', { name: 'TODOS' }).click();
    await expect(page).toHaveURL('http://localhost:3000/todos');
  });

  test('Deve validar navegação pelo link "Teste de Software" no Navbar', async ({ page }) => {
    const navbar = page.locator('nav');

    await expect(navbar.getByRole('link', { name: 'Teste de Software' })).toBeVisible();
    await navbar.getByRole('link', { name: 'Teste de Software' }).click();
    await expect(page).toHaveURL('http://localhost:3000/menu');
  });

  test('Deve validar navegação pelo link "Post" no Navbar', async ({ page }) => {
    const navbar = page.locator('nav');

    await expect(navbar.getByRole('link', { name: 'Post' })).toBeVisible();

    await navbar.getByRole('link', { name: 'Post' }).click();
    await expect(page).toHaveURL('http://localhost:3000/posts');

  });

  test('Deve validar navegação pelo link "Album" no Navbar', async ({ page }) => {
    const navbar = page.locator('nav');

    await expect(navbar.getByRole('link', { name: 'Album' })).toBeVisible();

    await navbar.getByRole('link', { name: 'Album' }).click();
    await expect(page).toHaveURL('http://localhost:3000/albums');

  });

  test('Deve validar navegação pelo link "Todos" no Navbar', async ({ page }) => {
    const navbar = page.locator('nav');

    await expect(navbar.getByRole('link', { name: 'Todos' })).toBeVisible();

    await navbar.getByRole('link', { name: 'Todos' }).click();
    await expect(page).toHaveURL('http://localhost:3000/todos');
  });

  test('Deve validar navegação pelo link "Log-out" no Navbar', async ({ page }) => {
    const navbar = page.locator('nav');

    await expect(navbar.getByRole('link', { name: 'Log-out' })).toBeVisible();

    await navbar.getByRole('link', { name: 'Log-out' }).click();
    await expect(page).toHaveURL('http://localhost:3000/');

  });

});
