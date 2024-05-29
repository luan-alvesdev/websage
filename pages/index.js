import React, { useState, useEffect } from 'react';
import Index from '../components/Index';
import New from '../components/New';

export default function Home() {
  const [activePage, setActivePage] = useState('index');
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    const getCurrentTabUrl = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        setCurrentUrl(url);
      });
    };

    try {
      getCurrentTabUrl();
    } catch (error) {
      setCurrentUrl('http://localhost:3000');
    }
   
    // Remover o listener quando o componente for desmontado
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

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