import { useEffect, useState } from 'react';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import '../styles/globals.css';
import Login from '../components/Login';
import Header from '../components/Header';
import Cadastro from '../components/Cadastro';

export default function App() {
  const [adicionarCard, setAdicionarCard] = useState();
  const [data, setData] = useState();
  const [exibirLogin, setExibirLogin] = useState(true);
  const [exibirCadastro, setExibirCadastro] = useState(false);

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
      {exibirLogin && !exibirCadastro && <Login setExibirLogin={setExibirLogin} setExibirCadastro={setExibirCadastro} />}
      {!exibirLogin && exibirCadastro && <Cadastro setExibirCadastro={setExibirCadastro} setExibirLogin={setExibirLogin} />}
      {!exibirLogin && !exibirCadastro && <Header setExibirLogin={setExibirLogin} />}
      {!exibirLogin && !exibirCadastro && <Cards enviaFuncaoInicial={abrirComunicacao} setExibirLogin={setExibirLogin} />}
      {!exibirLogin && !exibirCadastro && <Footer salvarCard={adicionarCard} data={data} />}
    </>
  );
}
