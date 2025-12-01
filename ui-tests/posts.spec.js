const { test, expect } = require('@playwright/test');

const APP_URL = 'http://localhost:3000/posts';

test.describe('Testes de UI para a Página de Posts', ()=>{
    test.beforeEach(async ({ page }) => {
        await page.goto(APP_URL);
    });

    test('Deve validar o titulo e subtitulo', async ({page})=>{
        
        await test.step('Deve conter o título CADASTRAR POST', async () =>{
            await expect(page.getByRole('heading', {name: 'CADASTRAR POST'})).toBeVisible();
        })
        await test.step('Deve conter o subtitulo Adicione o seu post', async () =>{
            await expect(page.locator('.subtitle')).toHaveText('Adicione o seu post');
        })
    });
    test('Valida os campos de textos', async ({page})=>{
        
        await test.step('Espera que tenha o campo Título do post e conteudo', async () =>{
            
            const campoTituloPost = page.getByPlaceholder('Título');
            await expect(campoTituloPost).toBeVisible;
            await expect(campoTituloPost).toHaveAttribute('placeholder', 'Título')
            
            const campoConteudo = page.getByPlaceholder('Adicione o conteudo do seu post');
            await expect(campoConteudo).toBeVisible();
            await expect(campoConteudo).toHaveAttribute('placeholder', 'Adicione o conteudo do seu post')
            
        });
        await test.step('Espera alterar os campos de titulo do poste e conteudo', async() =>{
            await page.getByPlaceholder('Título').fill('Consegui colocar o título');
            await page.getByPlaceholder('Adicione o conteudo do seu post').fill('Se passei no primeiro test eu consegui colocar o texto do conteúdo');
        });
    });
    test('Valida o dropdown Categoria', async ({page})=>{
        
        await test.step('Espera visualizar o campo Categora', async () =>{
            const locator = page.getByLabel('Categoria')
            await expect(locator).toBeVisible();
        });
        
        await test.step('Espera visualizar o campo Categora', async () =>{
            const dropdownCategoria = page.getByLabel('Categoria');
            await dropdownCategoria.selectOption('Tecnologia');
            await expect(dropdownCategoria).toHaveValue('tecnologia');
        });
    });
    
    test('Valida o botão', async ({page})=>{
        
        await test.step('Espera visualizar o botão', async () =>{
            const visualizarBotao = page.getByRole('button', 'Criar')
            await expect(visualizarBotao).toBeVisible();
        });
    });
    
    test('Valida o click e as informações do alertbox', async ({page})=>{
        
        await test.step('Espera clicar e visualizar as informações', async () =>{
            page.on('dialog', async dialog => {
                const message = dialog.message();

                expect(message).toContain('Consegui colocar o título');
                expect(message).toContain('Se passei no primeiro test eu consegui colocar o texto do conteúdo');
                expect(message).toContain('tecnologia');
                await dialog.accept();
            });

            await page.getByPlaceholder('Título').fill('Consegui colocar o título');
            await page.getByPlaceholder('Adicione o conteudo do seu post').fill('Se passei no primeiro test eu consegui colocar o texto do conteúdo');
            await page.getByLabel('Categoria').selectOption('tecnologia');
    

            await page.click('#btn-submit');
        });
    });
})
