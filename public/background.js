chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentTab = tabs[0];

  // Injetar o script de conteúdo na aba ativa
  chrome.scripting.executeScript(
    {
      target: { tabId: currentTab.id },
      files: ['content.js']
    },
    () => {
      console.log('Script de conteúdo injetado');
    }
  );
});

// Escutar por mensagens enviadas pelo script de conteúdo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.htmlText) {
    console.log('HTML extraído da página:', request.htmlText);
    // Armazenar o HTML extraído em armazenamento local
    chrome.storage.local.set({ extractedHTML: request.htmlText }, () => {
      console.log('HTML armazenado');
    });
    sendResponse({ status: 'HTML recebido com sucesso' });
  }
});