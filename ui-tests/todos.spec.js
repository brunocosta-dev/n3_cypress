import { test, expect } from '@playwright/test';

const APP_URL = 'http://localhost:3000/todos';

const API_URL = 'http://localhost:3000/api/todos'

test.describe('Testes de UI para a Página de Todos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('Deve validar elementos da página', async ({ page }) => {

    // --- Seção: Título e textos ---
    await test.step('Valida o título e textos principais', async () => {
      await expect(page).toHaveTitle('Cadastro de Tarefas');

      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cadastrar Tarefa');
      await expect(page.locator('.subtitle')).toHaveText('Crie a sua tarefa');

      await expect(page.getByRole('heading', { level: 2 })).toHaveText('Tarefas Cadastradas');
    });

    // --- Seção: Campos de texto ---
    await test.step('Valida os campos de entrada', async () => {
      await expect(page.getByRole('textbox', { name: 'Responsável' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Título' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Descrição' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Prazo' })).toBeVisible();
      await expect(page.locator('.input-field')).toHaveCount(4);
    });

    // --- Seção: Opções de prioridade ---
    await test.step('Valida as opções de prioridade', async () => {
      const options = page.getByRole('option');

      await expect(options).toHaveCount(3);
      await expect(options.nth(0)).toHaveText('Baixa');
      await expect(options.nth(1)).toHaveText('Média');
      await expect(options.nth(2)).toHaveText('Alta');
    });

    // --- Seção: Botão Criar ---
    await test.step('Valida o botão Criar', async () => {
      await expect(page.getByRole('button', { name: 'Criar' })).toBeVisible();
    });

  });

  test('Deve preencher e validar todos os campos do formulário', async ({ page }) => {

    // --- Seção: Preenchimento do formulário ---
    await test.step('Preenche os campos com dados', async () => {
      await page.getByPlaceholder('Responsável').fill('Nome para Teste');
      await page.getByPlaceholder('Título').fill('Teste com Playwright');
      await page.getByPlaceholder('Descrição').fill('Testes de UI criados com Playwright');
      await page.locator('#prazo').fill('2025-01-31');
      await page.locator('#prioridade').selectOption('alta');
    });

    // --- Seção: Diálogo de alerta ---
    await test.step('Captura alerta e valida informações enviadas', async () => {
      page.on('dialog', async dialog => {
        const message = dialog.message();

        expect(message).toContain('Nome para Teste');
        expect(message).toContain('Teste com Playwright');
        expect(message).toContain('Testes de UI criados com Playwright');
        expect(message).toContain('2025-01-31');
        expect(message).toContain('alta');

        await dialog.accept();
      });

      await page.click('#btn-submit');
    });

  });

  test('Testes envolvendo os dados da API local', async ({ page, request }) => {

    await test.step('Valida os dados de uma tarefa estática', async () => {
      const res = await request.get(API_URL);
      expect(res.ok()).toBeTruthy();

      const data = await res.json();

      // Valida se o usuário estático existe
      expect(data.length).toBeGreaterThan(0);

      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("responsavel");
      expect(data[0]).toHaveProperty("titulo");
      expect(data[0]).toHaveProperty("descricao");
      expect(data[0]).toHaveProperty("prazo");
      expect(data[0]).toHaveProperty("prioridade");

      // Valida se os dados estão coerentes
      await expect(page.getByText('Tarefa inicial | Sistema | baixa | 2025-01-01')).toBeVisible();

      // Espera o texto da tarefa estática que você definiu no server.js
      expect(data[0].titulo).toBe("Tarefa inicial");
    });

    await test.step('Verifica se uma nova tarefa pode ser criada', async () => {
      
      const novoTodo = {
        responsavel: "Brunno",
        titulo: "Criar testes",
        descricao: "Testar API local com Playwright",
        prazo: "2025-12-01",
        prioridade: "alta"
      };

      // Envia POST
      const resPost = await request.post(API_URL, {
        data: novoTodo
      });

      expect(resPost.ok()).toBeTruthy();

      const salvo = await resPost.json();

      // Valida o objeto salvo
      expect(salvo).toMatchObject(novoTodo);
      expect(salvo).toHaveProperty("id");

      // Valida se a nova tarefa está na API
      const resGet = await request.get(API_URL);
      const lista = await resGet.json();

      const encontrado = lista.find(t => t.titulo === "Criar testes");
      expect(encontrado).toBeTruthy();
      expect(encontrado.responsavel).toBe("Brunno");
      expect(encontrado.prioridade).toBe("alta");
    });

  });

});
