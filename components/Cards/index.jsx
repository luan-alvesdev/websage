import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '../Card/index'
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./Cards.module.css";

export default function Cards(props) {
  const [userData, setUserData] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const config = {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + localStorage.getItem('tokenAutenticacao')
    },
  };

  useEffect(() => {
    carregarCards();
    atualizarHTML();

    // Adicionar listener para atualizações no armazenamento local
    try {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.extractedHTML || changes.activeTabUrl) {
          atualizarHTML();
        }
      });
    } catch (error) {
      console.log(error)
    }
    
  }, []);

  const atualizarHTML = () => {
    try {
      chrome.storage.local.get(["activeTabUrl", "extractedHTML"], function (result) {
        if (result.extractedHTML && result.activeTabUrl) {
          props.enviaFuncaoInicial(adicionarCard, {
            url: result.activeTabUrl,
            html: result.extractedHTML
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const buscarImagem = async (tag1, tag2, tag3) => {
    try {
      const queries = [tag1, tag2, tag3];
      for (const query of queries) {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1&client_id=Z98UiqP-pTJ3779KAb3UbnNhfy_qqXApYGozFZcYoXc`
        );
        if (response.data.total !== 0) {
          return response.data.results[0].urls.regular;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const carregarCards = () => {
    // Carrega o Cache no navegador
    const cache = getCachedData();
    if (cache) {
      setUserData(cache);
    }

    // Inicia busca por atualizações
    try {
      axios.get("https://cardsage-api.abelcode.dev/api/list-items", config)
        .then((response) => {
          setUserData(response.data[0]);
          // Armazenar ou atualiza os dados no localStorage
          localStorage.setItem("cards", JSON.stringify({ data: response.data }));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const adicionarCard = (data, statusBotao) => {
    statusBotao(true);

    axios.post(`https://cardsage-api.abelcode.dev/api/save-item`, JSON.stringify(data), config)
      .then(async (novoCard) => {
        const novoCardData = novoCard.data;
        try {
          const imageUrl = await buscarImagem(novoCardData.tag1, novoCardData.tag2, novoCardData.tag3);
          adicionarNovoElemento(novoCardData, imageUrl);
          return { novoCardData, imageUrl };
        } catch (error) {
          console.log(error.message);
        }
      })
      .then(({ novoCardData, imageUrl }) => {
        if (imageUrl)
          return atualizaCard(novoCardData._id, imageUrl);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          alert(error.response.data, data.activeTabUrl);
        } else {
          alert("Erro ao extrair dados da página: ", error);
          console.log(error.response.data.message);
        }
      })
      .finally(() => {
        statusBotao(false);
      });
  };

  const deletarCard = async (id) => {
    setLoadingData(true);
    try {
      await axios.delete(`https://cardsage-api.abelcode.dev/api/delete-item/${id}`, config);
      removerElemento(id);
    } catch (error) {
      alert("Item não foi apagado");
    }
    setLoadingData(false);
  };

  const atualizaCard = async (card_id, imageUrl) => {
    await axios.put(`https://cardsage-api.abelcode.dev/api/update-item`, JSON.stringify({ imageUrl, card_id }), config)
  };

  // ** ------------------------------------ Operações em Array --------------------------------------
  const adicionarNovoElemento = (novoCard, imageUrl) => {
    // Cria uma cópia do objeto novoCard para não modificar o original
  const novoCardCopy = { ...novoCard, imageUrl };

  // Atualiza o estado
  setUserData(prevCardList => {
    const updatedCards = [novoCardCopy, ...(prevCardList.cards || [])];
    const updatedState = { ...prevCardList, cards: updatedCards };  
    // Atualiza o localStorage
    localStorage.setItem("cards", JSON.stringify({ data: updatedState }));
    return updatedState;
  });
  };

  const removerElemento = (id) => {
    const card = userData.cards.filter((card) => card._id !== id);
    setUserData({ ...userData, cards: card });
    // Atualiza os dados no localStorage
    localStorage.setItem("cards", JSON.stringify({ data: userData }));
  };

  // Função para obter dados, seja do cache ou da API
  function getCachedData() {
    const cachedItems = localStorage.getItem("cards");
    const parsedItems = JSON.parse(cachedItems);
    return parsedItems?.data;
  }

  return (
    <>
      <div className={styles.container}>
        <section>
          {userData?.cards?.map((card) => (
              <Card card={card}
                    deletarCard={deletarCard}
              />
            ))
          }
        </section>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingData}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </>
  );
}
