// Função para injetar o script de conteúdo na aba ativa
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

// Atualiza a URL da aba ativa e o HTML da página no armazenamento local
function updateActiveTabContent() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      injectContentScript(activeTab.id);
    }
  });
}

// Listener para mudanças de aba
chrome.tabs.onActivated.addListener(updateActiveTabContent);
chrome.tabs.onUpdated.addListener(updateActiveTabContent);
chrome.windows.onFocusChanged.addListener(updateActiveTabContent);

// Listener para instalação da extensão
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: 'index.html' }).catch((error) => console.error(error));
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

  // Inicializa a URL da aba ativa e o HTML da página quando a extensão é instalada
  updateActiveTabContent();
});

// Listener para mensagens do script de conteúdo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.htmlText && request.url) {
    console.log('URL da aba ativa:', request.url);

    // Armazena o HTML extraído e a URL da aba ativa
    chrome.storage.local.set({
      extractedHTML: request.htmlText,
      activeTabUrl: request.url
    });

    sendResponse({ status: 'Dados recebidos com sucesso' });
  }
});