import { useState } from 'react';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/globals.css';
import Login from '../components/Login';

export default function App() {
  const [adicionarCard, setAdicionarCard] = useState();
  const [url, setUrl] = useState();
  const [exibirLogin, setExibirLogin] = useState(true);

  const abrirComunicacao = (funcaoDeRetorno, url) => {
    setAdicionarCard(() => funcaoDeRetorno)
    setUrl(url)
  };

  return (
    <>
      { exibirLogin && <Login/>} 
      { !exibirLogin && <Cards enviaFuncaoInicial={abrirComunicacao}/>} 
      { !exibirLogin && <Footer salvarCard={adicionarCard} url={url}/>}
    </>
  );
}
