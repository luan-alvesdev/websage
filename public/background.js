chrome.tabs.onActivated.addListener((activeInfo) => {
  // Quando uma aba é ativada, injetar o script de conteúdo na aba ativa
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    injectContentScript(tab.id);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Quando uma aba é atualizada, injetar o script de conteúdo
    injectContentScript(tabId);
  }
});

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