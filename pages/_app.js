import { useState } from 'react';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Header from '../components/Header';

import '../styles/globals.css';

export default function App() {
  const [adicionarCard, setAdicionarCard] = useState();
  const [url, setUrl] = useState();

  const abrirComunicacao = (funcaoDeRetorno, url) => {
    setAdicionarCard(() => funcaoDeRetorno)
    setUrl(url)
  };

  return (
    <>
      <Header />
      <Cards enviaFuncaoInicial={abrirComunicacao}/> {/*Passa a função para o filho "Cards", que deve executar ela quando for iniciado, o filho deve passar por parâmetro a função adicionarCard()*/}
      <Footer salvarCard={adicionarCard} url={url}/> {/*Recebe a função adicionarCard, recebida pelo pai, ao chamar a função enviaFuncaoInicial*/}
    </>
  );
}
