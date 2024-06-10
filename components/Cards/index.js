import styles from "./Cards.module.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const config = {
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNzc5NTI2NywianRpIjoiODMwM2RiMjMtNjA2Yi00MTliLThjNzMtYTFiMDZkNjE5NDYwIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY2NjM3ODdmYWYzMTkyZTUxNGIzYjJjNyIsIm5iZiI6MTcxNzc5NTI2NywiY3NyZiI6IjNjMDQ0NDg1LThiZTMtNDVmYi1hNGU0LWEyMjhkZTVlNTg4NiIsImV4cCI6MTcyMDM4NzI2N30.NFC5XlkdlTuq9E65h3utjMFMjeAkQWaqbm9MjUd6ZPU`,
  },
};

export default function Cards(props) {
  const [tagsGerais, setTagsGerais] = useState([]);
  const [loadingData, setLoadingData] = React.useState(false);

  useEffect(() => {
    carregarCards();

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        props.enviaFuncaoInicial(adicionarCard, url);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const buscarImagem = async (tag1, tag2, tag3) => {
    try {
      const queries = [tag1, tag2, tag3, "tecnologia"];
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
    const cache = getCachedData()
    if (cache) {
      setTagsGerais(cache);
    }

    // Inicia busca por atualizacoes
    try {
      axios.get(
        "https://websage-api.abelcode.dev/api/list-items",
        config
      ).then(response => {
        setTagsGerais(response.data);

        // Armazenar ou atualiza os dados no localStorage
        localStorage.setItem("cards", JSON.stringify({ data: response.data }));
      })
    } catch (err) {
      console.log(err);
    }
  };

  const adicionarCard = (url, statusBotao) => {
    statusBotao(true);

    axios
      .post(`https://websage-api.abelcode.dev/api/save-item`, { url }, config)
      .then(async (novoCard) => {
        const novoCardData = novoCard.data;

        try {
          const imageUrl = await buscarImagem(
            novoCardData.tag1,
            novoCardData.tag2,
            novoCardData.tag3
          );
          adicionarNovoElemento(novoCardData, imageUrl);
          return { novoCardData, imageUrl };
        } catch (error) {
          console.log(error.message);
          return {
            novoCardData,
            imageUrl:
              "https://images.unsplash.com/photo-1557724630-96de91632c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTg2MTd8MHwxfHNlYXJjaHwxfHx1bmRlZmluZWR8ZW58MHwwfHx8MTcxNzg2MzEzMnww&ixlib=rb-4.0.3&q=80&w=1080",
          };
        }
      })
      .then(({ novoCardData, imageUrl }) => {
        return atualizaCard(novoCardData._id, imageUrl);
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          alert(error.response.data);
        } else {
          alert("Erro ao extrair dados da página");
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
      await axios.delete(
        `https://websage-api.abelcode.dev/api/delete-item/${id}`,
        config
      );
      removerElemento(tag_raiz, id);
    } catch (error) {
      alert("Item não foi apagado");
    }
    setLoadingData(false);
  };

  const atualizaCard = async (ramo_id, imageUrl) => {
    await axios
      .put(
        `https://websage-api.abelcode.dev/api/atualizar-item`,
        { imageUrl, ramo_id },
        config
      )
      .then(async (novoCard) => {
        await buscarImagem(novoCard.tag1, novoCard.tag2, novoCard.tag3);
      });
  };

  // ** ------------------------------------ Operacoes em Array --------------------------------------
  const adicionarNovoElemento = (novoElemento, imageUrl) => {
    novoElemento.imageUrl = imageUrl;

    // Verificar se há um elemento com a mesma tag_raiz
    const elementoExistente = tagsGerais.find(
      (item) => item.tag_raiz === novoElemento.tag_raiz
    );

    // Se não houver, criar um novo elemento
    if (!elementoExistente) {
      const novoObjeto = {
        tag_raiz: novoElemento.tag_raiz,
        ramos: [novoElemento],
      };
      setTagsGerais((prevTags) => [novoObjeto, ...prevTags]);
    } else {
      // Se houver, adicionar ao array de ramos do elemento existente
      const novoRamos = [novoElemento, ...elementoExistente.ramos];
      const novosTagsGerais = tagsGerais.map((item) => {
        if (item.tag_raiz === novoElemento.tag_raiz) {
          return { ...item, ramos: novoRamos };
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
          const novosRamos = item.ramos.filter((ramo) => ramo._id !== id);
          return { ...item, ramos: novosRamos };
        }
        return item;
      });
    });
    // Atualiza os dados no localStorage
    localStorage.setItem("cards", JSON.stringify({ data: tagsGerais }));
  };

  // Função para obter dados, seja do cache ou da API
  function getCachedData() {
    const cachedItems = localStorage.getItem('cards');
    const parsedItems = JSON.parse(cachedItems);
    return parsedItems?.data;
  }

  return (
    <>
      <div className={styles.container}>
        {tagsGerais.map((tags) =>
          tags?.ramos.map((card, index) => (
            <div key={card._id} className={styles.card}>
              <div
                style={{
                  backgroundImage: `url(${card.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  margin: "10px",
                  borderRadius: "4.5px",
                }}
              >
                <Card
                  className={styles.cardContainer}
                  sx={{ display: "flex", backgroundColor: "#ffffffd9" }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography
                          component="div"
                          variant="h6"
                          sx={{ paddingBottom: "10px", fontWeight: "500" }}
                        >
                          {card.titulo}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          component="div"
                        >
                          {card.descricao}
                        </Typography>
                      </CardContent>
                    </a>
                    <div className={styles.tags}>
                      <a
                        href={card.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 1,
                            pb: 1,
                            gap: "10px",
                          }}
                        >
                          {card.tag1 && <Chip label={card.tag1} />}
                          {card.tag2 && <Chip label={card.tag2} />}
                          {card.tag3 && <Chip label={card.tag3} />}
                        </Box>
                      </a>
                      <IconButton
                        z-index="1"
                        aria-label="delete"
                        size="small"
                        color="error"
                        onClick={() => deletarCard(tags.tag_raiz, card._id)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  </Box>
                </Card>
              </div>
            </div>
          ))
        )}
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
