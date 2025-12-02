# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]: Teste de Software
      - generic [ref=e5]:
        - link "Post" [ref=e6] [cursor=pointer]:
          - /url: /posts
        - link "Album" [ref=e7] [cursor=pointer]:
          - /url: /albums
        - link "Todos" [ref=e8] [cursor=pointer]:
          - /url: /todos
        - link "Comments" [ref=e9] [cursor=pointer]:
          - /url: "#"
        - link "Log-out" [ref=e10] [cursor=pointer]:
          - /url: /index
  - main [ref=e11]:
    - generic [ref=e12]:
      - heading "CADASTRAR ÁLBUM" [level=1] [ref=e13]
      - paragraph [ref=e14]: Crie o seu novo álbum
      - generic [ref=e15]:
        - textbox "Título do Álbum" [ref=e17]
        - button "CRIAR" [ref=e19] [cursor=pointer]
    - generic [ref=e20]:
      - heading "Álbuns Carregados" [level=2] [ref=e21]
      - list [ref=e22]:
        - listitem [ref=e23]: Erro ao carregar dados.
```