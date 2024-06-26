import { useEffect, useState } from 'react';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Login from '../components/Login';
import Header from '../components/Header';

export default function App() {
  const [adicionarCard, setAdicionarCard] = useState();
  const [data, setData] = useState();
  const [exibirLogin, setExibirLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tokenAutenticacao')
    if (token) {
      setExibirLogin(false)
    }
  }, []);

  const abrirComunicacao = (funcaoDeRetorno, data) => {
    setAdicionarCard(() => funcaoDeRetorno)
    setData(data)
  };

  return (
    <>
      { exibirLogin && <Login setExibirLogin={setExibirLogin}/>} 
      { !exibirLogin && <Header setExibirLogin={setExibirLogin}/>} 
      { !exibirLogin && <Cards enviaFuncaoInicial={abrirComunicacao} setExibirLogin={setExibirLogin}/>} 
      { !exibirLogin && <Footer salvarCard={adicionarCard} data={data}/>}
    </>
  );
}
