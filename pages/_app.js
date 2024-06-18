import { useState } from 'react';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Login from '../components/Login';

export default function App() {
  const [adicionarCard, setAdicionarCard] = useState();
  const [data, setData] = useState();
  const [exibirLogin, setExibirLogin] = useState(false);

  const abrirComunicacao = (funcaoDeRetorno, data) => {
    setAdicionarCard(() => funcaoDeRetorno)
    setData(data)
  };

  return (
    <>
      { exibirLogin && <Login/>} 
      { !exibirLogin && <Cards enviaFuncaoInicial={abrirComunicacao}/>} 
      { !exibirLogin && <Footer salvarCard={adicionarCard} data={data}/>}
    </>
  );
}
