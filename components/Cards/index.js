import styles from './Cards.module.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const config = {
  headers: {
    'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNzYzMTM2MiwianRpIjoiMGU3NzJhNjUtMjYwZS00NjQwLTlhMWMtMzc3ZDRkNmE4N2Q4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjY2NjBmODg3ZjhmYTcxMWJjOTYxZDY1YiIsIm5iZiI6MTcxNzYzMTM2MiwiY3NyZiI6ImRiMzM4ODRjLTA4ZTAtNDYzNy1iNDM1LTVmZmZkMTkwNTk5ZSIsImV4cCI6MTcyMDIyMzM2Mn0.00RcMjqsjjh6JBJTnpJp-KCvKjeyn-ptt6nvDR_kBgU`
  }
};

export default function Cards(props) {
  const [tagsGerais, setTagsGerais] = useState([]);
  const [imagens, setImagens] = useState([])

  useEffect(() => {
    carregarCards();

    try {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        props.enviaFuncaoInicial(adicionarCard, url)
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const buscarImagem = async (tag1, tag2, tag3) => {
    try {
      const queries = [tag1, tag2, tag3, 'tecnologia'];
      for (const query of queries) {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1&client_id=Z98UiqP-pTJ3779KAb3UbnNhfy_qqXApYGozFZcYoXc`);
        if (response.data.total !== 0) {
          return response.data.results[0].urls.regular;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const carregarCards = async () => {
    try {
      const response = await axios.get('https://websage-api.abelcode.dev/api/list-items', config);
      const data = response.data
      setTagsGerais(data);

      const novasImagens = [];
      for (const tags of data) {
        for (const card of tags.ramos) {
          const imagem = await buscarImagem(card.tag1, card.tag2, card.tag3);
          novasImagens.push(imagem);
        }
      }
      setImagens(novasImagens);
    } catch (err) {
      console.log(err);
    }
  };

  const adicionarCard = async (url, statusBotao) => {
    statusBotao(true)
    await axios.post(`https://websage-api.abelcode.dev/api/save-item`, { url }, config).then((novoCard) => {
      setCards(cards => [...cards, novoCard.data]);
    }).catch(() => {
      alert("item não foi adicionado")
    }).finally(() => {
      statusBotao(false)
    })
  }

  const deletarCard = async (id) => {
    try {
      await axios.delete(`https://websage-api.abelcode.dev/api/delete-item/${id}`, config);
      setTagsGerais(tagsGerais => 
        tagsGerais.map(elements => ({
          ...elements, // Mantém outras propriedades de elements
          ramos: elements.ramos.filter(card => card._id !== id) // Filtra os cards pelo id
        }))
      );
    } catch (error) {
      alert("Item não foi apagado");
    }
  };
  

  return (
    <>
      <div className={styles.container}>
        {tagsGerais.map((tags) => (
          tags?.ramos.map((card, index) => (
            <div key={card._id} className={styles.card}>
              <div style={{
                backgroundImage: `url(${imagens[index]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                margin: '10px',
                borderRadius: '4.5px'
              }}>
                <Card className={styles.cardContainer} sx={{ display: 'flex', backgroundColor: '#ffffffd9' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <a href={card.url} target="_blank" rel="noopener noreferrer">
                      <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h6" sx={{ paddingBottom: '10px', fontWeight: '500' }}>
                          {card.titulo}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" component="div">
                          {card.descricao}
                        </Typography>
                      </CardContent>
                    </a>
                    <div className={styles.tags}>
                      <a href={card.url} target="_blank" rel="noopener noreferrer">
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          pl: 1,
                          pb: 1,
                          gap: '10px'
                        }}>
                          {card.tag1 && <Chip label={card.tag1} />}
                          {card.tag2 && <Chip label={card.tag2} />}
                          {card.tag3 && <Chip label={card.tag3} />}
                        </Box>
                      </a>
                      <IconButton z-index='1' aria-label="delete" size="small" color="error" onClick={() => deletarCard(card._id)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  </Box>
                </Card>
              </div>
            </div>
          ))
        ))}
      </div>
    </>
  );
}
