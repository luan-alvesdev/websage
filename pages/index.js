import React, { useState, useEffect } from "react";
import Index from "../components/Index";
import New from "../components/New";

export default function Home() {
  const [activePage, setActivePage] = useState("index");
  const [currentUrl, setCurrentUrl] = useState(null);
  const [pageText, setPageText] = useState(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if(message.pageText) {
        setPageText(message.pageText);
      }
    })

    // Envia uma mensagem para o script de fundo indicando que o componente Home foi montado
    chrome.runtime.sendMessage({ popupOpened: true });

    // Obtém a URL da aba ativa e armazena no estado
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      setCurrentUrl(url);
    });
  }, []); // Executa apenas uma vez quando o componente é montado

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === "index" && <Index navigateToPage={navigateToPage} />}
      {activePage === "new" && <New navigateToPage={navigateToPage} />}
      {/* Exibir a URL da página atual */}
      <p>URL da página atual: {currentUrl}</p>
      {/* Exibir o texto da página atual */}
      <p>Texto da página atual: {pageText}</p>
    </>
  );
}