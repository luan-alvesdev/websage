// Injeta o script de conteúdo na aba ativa
function injectContentScript(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ['content.js']
    },
    () => {
      console.log('Script de conteúdo injetado');
    }
  );
}

// Escuta mensagens do script de conteúdo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.htmlText && request.url) {
    console.log('HTML extraído da página:', request.htmlText);
    console.log('URL da aba ativa:', request.url);

    // Armazena o HTML extraído e a URL da aba ativa
    chrome.storage.local.set({
      extractedHTML: request.htmlText,
      activeTabUrl: request.url
    }, () => {
      console.log('HTML e URL armazenados');
    });

    sendResponse({ status: 'Dados recebidos com sucesso' });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: 'index.html' }).catch((error) => console.error(error));
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
});