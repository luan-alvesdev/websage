WebSage

## Authors

- [@abel-cabral](https://www.github.com/abel-cabral)
- [@luan-alves](https://github.com/luan-alvesdev)

## Demonstração

[Demonstração]()

## Descrição

Web Sage é uma extensão do Chrome que permite adicionar páginas da web a uma lista de cartões personalizados. Cada cartão representa uma página adicionada, funcionando como uma lista de favoritos do navegador, mas com funcionalidades aprimoradas.

Ao adicionar uma página, um cartão é criado com um resumo da página, um título e tags relacionadas ao conteúdo principal. Isso permite que os usuários organizem e acessem suas páginas favoritas de maneira mais eficiente, clicando no link do cartão para abrir a página correspondente. A versão atual da extensão funciona somente em português. 

# Instalação

## Método 1: Desenvolvimento com npm run dev

Este método permite que você visualize e teste a extensão em tempo real, facilitando ajustes visuais e análise de console.

Instale as dependências:

```
npm install 
```

Inicie o modo de desenvolvimento:

```
npm run dev
```

Acesse a aplicação com o link: http://localhost:3000/

Benefícios:

- Visualização em Tempo Real: Veja os estilos e layout da extensão enquanto trabalha.
- Debugging Facilitado: Acesse o console do navegador para depurar e analisar o comportamento da extensão.
- Ajustes Visuais: Faça ajustes em CSS e veja as mudanças imediatamente.

## Método 2: Produção com npm run build

Instale as dependências:

```
npm install 
```

Compile o projeto:

```
npm run build
```

Adicione a extensão ao Chrome:

- Abra o Chrome e vá para chrome://extensions/.
- Ative o "Modo do desenvolvedor".
- Clique em "Carregar sem compactação" e selecione o diretório build gerado.

Benefícios:

- Uso Completo da Extensão: Utilize todas as funcionalidades da extensão como planejado.
- Simulação Realista: Teste a extensão em um ambiente que simula o uso real pelos usuários finais.

