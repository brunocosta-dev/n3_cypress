/*
npx playwright test ui-tests/comments-ui.test.js
npx playwright test ui-tests/comments-ui.test.js --ui
*/

const { test, expect } = require('@playwright/test');
const path = require('path');

async function abrirPagina(page) {
  const filePath = path.join(__dirname, '..', 'public', 'comments.html');
  await page.goto('file://' + filePath);
}


test('teste carregamento pagina', async ({ page }) => {
  await abrirPagina(page);

  const titulo = page.locator('h3.title');
  await expect(titulo).toHaveText('PUBLICAR COMENTÁRIO');
});


test('teste possibilidade de digitar um comentário', async ({ page }) => {
  await abrirPagina(page);

  await page.fill('#comentario', '#yan');
  await expect(page.locator('#comentario')).toHaveValue('#yan');
});

//testes de visibilidades
test('testa visibilidade como público', async ({ page }) => {
  await abrirPagina(page);

  await page.check('#vis1');
  await expect(page.locator('#vis1')).toBeChecked();
});

test('testa visibilidade como amigos', async ({ page }) => {
  await abrirPagina(page);

  await page.check('#vis2');
  await expect(page.locator('#vis2')).toBeChecked();
});
test('testa visibilidade somente Eu', async ({ page }) => {
  await abrirPagina(page);

  await page.check('#vis3');
  await expect(page.locator('#vis3')).toBeChecked();
});

test('testa se apenas uma visibilidade esta selecionada', async ({ page }) => {
  await abrirPagina(page);

  await page.check('#vis1');
  await expect(page.locator('#vis1')).toBeChecked();
  await expect(page.locator('#vis2')).not.toBeChecked();
  await expect(page.locator('#vis3')).not.toBeChecked();

  await page.check('#vis2');
  await expect(page.locator('#vis2')).toBeChecked();
  await expect(page.locator('#vis1')).not.toBeChecked();
  await expect(page.locator('#vis3')).not.toBeChecked();

  await page.check('#vis3');
  await expect(page.locator('#vis3')).toBeChecked();
  await expect(page.locator('#vis1')).not.toBeChecked();
  await expect(page.locator('#vis2')).not.toBeChecked();
});


test('click no botão de publicar', async ({ page }) => {
  await abrirPagina(page);

  await page.fill('#comentario', 'Comentando...');
  await page.check('#vis1');

  await page.click('#btn-submit');

  await expect(page).toHaveURL(/comments\.html/);
});


test('teste  campo vazio', async ({ page }) => {
  await abrirPagina(page);
  await page.click('#btn-submit');
  await expect(page.locator('#comentario')).toHaveValue('');

});
