import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from '../Card/index'
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./Cards.module.css";

export default function Cards(props) {
  const [tagsGerais, setTagsGerais] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('tokenAutenticacao')
    },
  };

  useEffect(() => {
    carregarCards();
    atualizarHTML();

    // Adicionar listener para atualizações no armazenamento local
    try {
      chrome.storage.onChanged.addListener((changes, namespace) => {
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
      setTagsGerais(cache);
    }

    // Inicia busca por atualizações
    try {
      axios.get("https://websage-api.abelcode.dev/api/list-items", config)
        .then((response) => {
          setTagsGerais(response.data);
          // Armazenar ou atualiza os dados no localStorage
          localStorage.setItem("cards", JSON.stringify({ data: response.data }));
        });
    } catch (err) {
      console.log(err);
    }
  };

  const adicionarCard = (data, statusBotao) => {
    statusBotao(true);

    axios.post(`https://websage-api.abelcode.dev/api/save-item`, data, config)
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
          alert(error.response.data);
        } else {
          alert("Erro ao extrair dados da página: ", error);
          console.log(error.response.data.message);
        }
      })
      .finally(() => {
        statusBotao(false);
      });
  };

  const deletarCard = async (tag_raiz, id) => {
    setLoadingData(true);
    try {
      // await axios.delete(`https://websage-api.abelcode.dev/api/delete-item/${id}`, config);
      removerElemento(tag_raiz, id);
    } catch (error) {
      alert("Item não foi apagado");
    }
    setLoadingData(false);
  };

  const atualizaCard = async (ramo_id, imageUrl) => {
    await axios.put(`https://websage-api.abelcode.dev/api/atualizar-item`, { imageUrl, ramo_id }, config)
      .then(async (novoCard) => {
        await buscarImagem(novoCard.tag1, novoCard.tag2, novoCard.tag3);
      });
  };

  // ** ------------------------------------ Operações em Array --------------------------------------
  const adicionarNovoElemento = (novoElemento, imageUrl) => {
    novoElemento.imageUrl = imageUrl;

    // Verificar se há um elemento com a mesma tag_raiz
    const elementoExistente = tagsGerais.find((item) => item.tag_raiz === novoElemento.tag_raiz);

    // Se não houver, criar um novo elemento
    if (!elementoExistente) {
      const novoObjeto = {
        tag_raiz: novoElemento.tag_raiz,
        cards: [novoElemento],
      };
      setTagsGerais((prevTags) => [novoObjeto, ...prevTags]);
    } else {
      // Se houver, adicionar ao array de cards do elemento existente
      const novoRamos = [novoElemento, ...elementoExistente.cards];
      const novosTagsGerais = tagsGerais.map((item) => {
        if (item.tag_raiz === novoElemento.tag_raiz) {
          return { ...item, cards: novoRamos };
        }
        return item;
      });
      setTagsGerais(novosTagsGerais);
    }
    // Atualiza os dados no localStorage
    localStorage.setItem("cards", JSON.stringify({ data: tagsGerais }));
  };

  const removerElemento = (tagRaiz, id) => {
    setTagsGerais((prevTags) => {
      return prevTags.map((item) => {
        if (item.tag_raiz === tagRaiz) {
          const novosRamos = item.cards.filter((card) => card._id !== id);
          return { ...item, cards: novosRamos };
        }
        return item;
      });
    });
    // Atualiza os dados no localStorage
    localStorage.setItem("cards", JSON.stringify({ data: tagsGerais }));
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
          {tagsGerais.map((tags) =>
            tags?.cards.map((card) => (
              <Card tags={tags}
                    card={card}
                    deletarCard={deletarCard}
              />
            ))
          )}
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
