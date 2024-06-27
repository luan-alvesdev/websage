# WebSage

## Capturas de Tela

### Telas de Login & lista de cartões. 

<div style="display: flex; justify-content: space-between;">
  <img src="https://raw.githubusercontent.com/luan-alvesdev/websage/main/assets/Captura_de_Tela_2024-06-26_as_16.27.47.png" alt="Tela login" width="45%">
  <img src="https://raw.githubusercontent.com/luan-alvesdev/websage/main/assets/Captura_de_Tela_2024-06-26_as_16.23.14.png" alt="Tela lista de cards" width="45%">
</div>

## Descrição

Web Sage é uma extensão do Chrome que permite adicionar páginas da web a uma lista de cartões personalizados. Cada cartão representa uma página adicionada, funcionando como uma lista de favoritos do navegador, mas com funcionalidades aprimoradas.

Ao adicionar uma página, um cartão é criado com um resumo da página, um título e tags relacionadas ao conteúdo principal. Isso permite que os usuários organizem e acessem suas páginas favoritas de maneira mais eficiente, clicando no link do cartão para abrir a página correspondente. A versão atual da extensão funciona somente em português. 

## Executando o WebSage localmente

### Rodando em modo desenvolvedor:
Certifique-se de ter o node.js instalado na versão 20 ou superiores. 

Instale as dependências:
```
npm install 
```

Inicie o modo de desenvolvimento:
```
npm run dev
```

Acesse localhost na porta 3000: http://localhost:3000

Com o método de desenvolvimento usando npm run dev, é possível ver os estilos e o layout da extensão em tempo real enquanto trabalha. Além disso, é fácil depurar, já que temos acesso ao console do navegador para analisar o comportamento da extensão. Podemos também fazer ajustes visuais em CSS e ver as mudanças imediatamente.

### Realizando build: 
Execute o seguite comando no terminal:
```
npm run build
```

Após isso, uma pasta chamada "out" será gerada na raiz do projeto, contendo todos os arquivos necessários da extensão. 

### Adicionando extensão a navegadores baseados em Chrome:
1. Abrir o Navegador:
    - Abra o navegador baseado em Chrome onde você deseja adicionar a extensão (Chrome, Edge, Chromium, Brave, etc.).


2. Acessar a Página de Extensões:
    - Clique no ícone de três pontos verticais no canto superior direito do navegador.
    - Navegue até "Mais Ferramentas" e depois selecione "Extensões".
    - Alternativamente, você pode digitar chrome://extensions/ na barra de endereços e pressionar Enter.


3. Ativar o Modo Desenvolvedor:
    - No canto superior direito da página de Extensões, ative o "Modo Desenvolvedor" clicando no interruptor.


4. Adicionar a Extensão:
    - Clique no botão "Carregar sem compactação" ou "Load unpacked".
    - Navegue até a pasta onde a extensão está armazenada no seu computador.
    - Selecione a pasta da extensão e clique em "Selecionar Pasta" ou "Select Folder".


5. Confirmar a Instalação:
    - A extensão deve agora aparecer na lista de extensões do navegador.
    - Certifique-se de que a extensão está ativada (interruptor deve estar ligado).

Pronto! A extensão foi adicionada ao seu navegador e está pronta para uso.

## Authors

- [@abel-cabral](https://www.github.com/abel-cabral)
- [@luan-alves](https://github.com/luan-alvesdev)

