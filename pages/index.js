import React, { useState, useEffect } from 'react';
import Index from '../components/Index';
import New from '../components/New';

export default function Home() {
  const [activePage, setActivePage] = useState('index');
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    // Função para buscar a URL da guia atual
    const getCurrentTabUrl = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        var url = currentTab.url;

        // Atualizar o estado com a URL recebida
        setCurrentUrl(url);
      });
    };

    // Chamar a função ao montar o componente
    getCurrentTabUrl();

    // Lembre-se de remover o listener quando o componente for desmontado
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []); // Executar este efeito apenas uma vez

  const navigateToPage = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === 'index' && <Index navigateToPage={navigateToPage} />}
      {activePage === 'new' && <New navigateToPage={navigateToPage} />}
      {/* Exibir a URL da página atual */}
      <p>URL da página atual: {currentUrl}</p>
    </>
  );
}