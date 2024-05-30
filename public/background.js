// chrome.action.onClicked.addListener(function(tab) {
//     console.log('Click')
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         const currentTab = tabs[0];
//         const currentUrl = currentTab.url;
//         chrome.tabs.sendMessage({ url: currentUrl });
//         console.log('enviou')
//     });
// });

// chrome.runtime.onInstalled.addListener(function() {
//     console.log('Extensão instalada ou atualizada.');
//   });

// Escuta mensagens enviadas pelo popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.popupOpened) {
      console.log("Popup aberto!");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const tabId = activeTab.id;
  
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            func: () => document.documentElement.innerText,
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              sendResponse({ pageText: null });
            } else if (results && results[0].result) {
              chrome.runtime.sendMessage({ pageText: results[0].result });
            } else {
              console.error("Texto da página não recebido.");
              sendResponse({ pageText: null });
            }
          }
        );
  
        // Return true to indicate that the response will be sent asynchronously
        return true;
      });
    }
  });

// chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     const currentTab = tabs[0];
//     const currentUrl = currentTab.url;
//     chrome.runtime.sendMessage({ url: currentUrl });
// });

// // Função para lidar com a resposta do script injetado
// function handleScriptResponse() {
//     // const textFromPage = result[0];
//     // Envia uma mensagem para o popup.js com o conteúdo do texto
//     chrome.runtime.sendMessage({ text: 'Ahhhhhhhh' });
// }

// // Função para injetar um script na página ativa e obter o texto do HTML
// function getTextFromPage() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         const tab = tabs[0];
//         chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             function: () => {
//                 // Obtém o texto do HTML da página
//                 const text = document.documentElement.innerText;
//                 return text;
//             }
//         }, handleScriptResponse);
//     });
// }

// chrome.browserAction.onClicked.addListener(function(tab) {
//     // Envia uma mensagem para o popup quando a extensão for clicada e aberta
//     chrome.runtime.sendMessage({ message: "Extensão clicada e aberta!" });
// });
