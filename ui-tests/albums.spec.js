// ui-tests/albums.spec.js

const { test, expect } = require('@playwright/test');

// Define a URL base da nossa aplicação local
const APP_URL = 'http://localhost:3000/albums.html';

// Bloco de testes para a página de Álbuns
test.describe('Testes de UI para a Página de Álbuns', () => {

     //Teste 1: Verifica o carregamento dos elementos estáticos da página.
     //Cobre o requisito da N3: "Presença de elementos".
      
    test('Deve exibir o título e o formulário de cadastro corretamente', async ({ page }) => {
        // 1. Navega para a página de álbuns
        await page.goto(APP_URL);

        // 2. Verifica se o título principal da página está visível
        await expect(page.getByRole('heading', { name: 'CADASTRAR ÁLBUM' })).toBeVisible();
        
        // 3. Verifica se o subtítulo está visível
        await expect(page.getByText('Crie o seu novo álbum')).toBeVisible();

        // 4. Verifica se os campos do formulário estão presentes
        await expect(page.getByPlaceholder('Título do Álbum')).toBeVisible();
        await expect(page.getByRole('button', { name: 'CRIAR' })).toBeVisible();
    });

     //Teste 2: Verifica o carregamento dinâmico dos dados da API.
     //Cobre o requisito da N3: "Carregamento de dados da API local."
     
    test('Deve carregar e exibir a lista de álbuns da API local', async ({ page }) => {
        // 1. Navega para a página de álbuns
        await page.goto(APP_URL);

        // 2. Verifica se o título da seção de lista está visível
        await expect(page.getByRole('heading', { name: 'Álbuns Carregados' })).toBeVisible();

        // 3. Verifica se os itens da nossa API mock (do server.js) foram renderizados na tela.
        // O Playwright aguardará automaticamente o fetch() terminar e o texto aparecer.
        await expect(page.getByText('ID: 1 - Título: Fotos dos Bruninhos')).toBeVisible();
        await expect(page.getByText('ID: 2 - Título: Yan na Praia')).toBeVisible();
    });

});