import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:3000/';

test.describe('Testes de UI para a Página Index', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('Deve validar elementos da página', async ({ page }) => {

    // --- Seção: Título e textos ---
    await test.step('Valida o título e textos principais', async () => {
      await expect(page).toHaveTitle('Login');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Log-In Usuário');
      await expect(page.locator('.subtitle')).toHaveText('Adicione as informações do teu usuário');
    });

    // --- Seção: Campos de entrada ---
    await test.step('Valida os campos de usuário e senha', async () => {
      await expect(page.getByRole('textbox', { name: 'Usuário' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Senha' })).toBeVisible();
      await expect(page.locator('.input-field')).toHaveCount(2);
    });

    // --- Seção: Botão Logar ---
    await test.step('Valida o botão LOGAR', async () => {
      await expect(page.getByRole('button', { name: 'LOGAR' })).toBeVisible();
    });

  });

  test('Valida o redirecionamento através do link', async ({ page }) => {

    // --- Seção: Link para /users ---
    await test.step('Clica no link de Cadastre-se e valida a URL', async () => {
      await page.getByRole('link', { name: 'Cadastre-se' }).click();
      await expect(page).toHaveURL('http://localhost:3000/users');
    });

  });

  test('Deve preencher e validar a mensagem no alerta', async ({ page }) => {

    // --- Seção: Preenchimento do formulário ---
    await test.step('Preencher campos de login', async () => {
      await page.getByPlaceholder('Usuário').fill('TestePw');
      await page.getByPlaceholder('Senha').fill('123456');
    });

    // --- Seção: Captura e validação do alerta ---
    await test.step('Valida a mensagem no alerta', async () => {
      page.on('dialog', async dialog => {
        const message = dialog.message();

        expect(message).toEqual('Bem vindo(a) TestePw!');

        await dialog.accept();
      });

      await page.click('#btn-submit');
    });

  });

});
