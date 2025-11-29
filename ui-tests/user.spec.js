import { test, expect } from 'playwright/test';

const APP_URL = 'http://localhost:3000/users';

const API_URL = 'http://localhost:3000/api/users'

test.describe('Testes de UI para a Página de Users', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('Deve validar elementos da página', async ({ page }) => {

    // --- Seção: Título e textos ---
    await test.step('Valida o título e textos principais', async () => {
      await expect(page).toHaveTitle('Cadastro de Usuários');

      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cadastrar Usuário');
      await expect(page.locator('.subtitle')).toHaveText('Crie o seu usuário');

      await expect(page.getByRole('heading', { level: 2 })).toHaveText('Usuários Cadastrados');

    });

    // --- Seção: Campos de texto ---
    await test.step('Valida os campos de entrada', async () => {
      await expect(page.getByRole('textbox', { name: 'Nome' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Usuário' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Senha' })).toBeVisible();
      await expect(page.locator('.input-field')).toHaveCount(4);
    });

    // --- Seção: Checkbox ---
    await test.step('Valida o checkbox de termos', async () => {
      await page.getByLabel(' Eu concordo com os termos').check();
      await expect(page.getByLabel(' Eu concordo com os termos')).toBeChecked();
    });

    // --- Seção: Botões de rádio ---
    await test.step('Valida os botões de seleção de gênero', async () => {
      await page.getByRole('radio', { name: 'Masculino' }).check();
      await expect(page.getByRole('radio', { name: 'Masculino' })).toBeChecked();
      await expect(page.getByRole('radio', { name: 'Feminino' })).not.toBeChecked();
      await expect(page.getByRole('radio', { name: 'Outro' })).not.toBeChecked();
    });

    // --- Seção: Botão Criar ---
    await test.step('Valida o botão Criar', async () => {
      await expect(page.getByRole('button', { name: 'Criar' })).toBeVisible();
    });

  });

  test('Deve preencher e validar todos os campos do formulário', async ({ page }) => {

    // --- Seção: Preenchimento ---
    await test.step('Preenche os campos com dados', async () => {
      await page.getByPlaceholder('Nome').fill('Teste com Playwright');
      await page.getByPlaceholder('Usuário').fill('TestePw');
      await page.getByPlaceholder('Email').fill('testePW@gmail.com');
      await page.getByPlaceholder('Senha').fill('123456');
      await page.check('#radio2'); // Feminino
      await page.check('#checkbox');
    });

    // --- Seção: Captura e validação do alerta ---
    await test.step('Captura o alerta e valida os dados enviados', async () => {
      page.on('dialog', async dialog => {
        const message = dialog.message();

        expect(message).toContain('Teste com Playwright');
        expect(message).toContain('TestePw');
        expect(message).toContain('testePW@gmail.com');
        expect(message).toContain('123456');
        expect(message).toContain('Feminino');
        expect(message).toContain('true');

        await dialog.accept();
      });

      await page.click('#btn-submit');
    });

  });

  test('Testes envolvendo os dados da API local', async ({ page, request }) => {

    await test.step('Valida os dados de um usuário estático', async () => {
      const res = await request.get(API_URL);
      expect(res.ok()).toBeTruthy();

      const data = await res.json();

      // Valida se o usuário estático existe
      expect(data.length).toBeGreaterThan(0);

      expect(data[0]).toHaveProperty("nome");
      expect(data[0]).toHaveProperty("user");
      expect(data[0]).toHaveProperty("genero");
      expect(data[0]).toHaveProperty("email");
      expect(data[0]).toHaveProperty("senha");
      expect(data[0]).toHaveProperty("termo");

      // Valida se os dados estão coerentes
      await expect(page.getByText('Este é um usuário estático | user | Masculino | user@gmail.com')).toBeVisible();

      // Exemplo de dados esperados
      expect(data[0].nome).toBe("Este é um usuário estático");
    });

    await test.step('Verifica se um novo usuário pode ser criado', async () => {

      const novoUsuario = {
        nome: "Brunno",
        user: "brunno",
        genero: "Masculino",
        email: "b@test.com"
      };

      // Envia POST
      const resPost = await request.post(API_URL, {
        data: novoUsuario
      });

      expect(resPost.ok()).toBeTruthy();

      const salvo = await resPost.json();

      // Valida o objeto salvo
      expect(salvo).toMatchObject(novoUsuario);
      expect(salvo).toHaveProperty("id");

      // Valida se o novo usuário está na API
      const resGet = await request.get(API_URL);
      const lista = await resGet.json();

      const encontrado = lista.find(u => u.user === "brunno");
      expect(encontrado).toBeTruthy();
      expect(encontrado.nome).toBe("Brunno");
    });

  });

  test('Teste de ERROS de UI', async ({ page }) => {

    await test.step('Verificar se o link "Retornar" existe', async () => {
      await expect(page.locator('.nav-link.return'), 'Link "Retornar" deveria existir').toBeVisible();
    });

    await test.step('Verificar se o botão CRIAR está presente', async () => {
      await expect(page.locator('#btn-submit'), 'Botão #btn-submit deveria existir').toBeVisible();
    });

    await test.step('Lista de usuários deve ter ao menos 1 usuário', async () => {
      const listUsers = page.locator('#lista-users li');
      await expect(listUsers, 'A lista deveria conter ao menos 1 usuário').toHaveCount(1);
    });

    await test.step('Campo email deve rejeitar valores inválidos', async () => {
      await page.fill('#email', 'email_invalido');
      const isValid = await page.$eval('#email', el => el.checkValidity());
      expect(isValid, 'Campo email aceitou valor inválido').toBeFalsy();
    });

    await test.step('Formulário não deve permitir submit com campos vazios', async () => {
      let dialogOpened = false;

      page.on('dialog', () => {
        dialogOpened = true; // Significa que o submit ocorreu
      });

      await page.click('#btn-submit');

      expect(dialogOpened, 'Formulário permitiu submit com campos vazios').toBeFalsy();
    });

  });

});
