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


export default function Cards(props) {
  const [cards, setCards] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [imagem, setImagem] = useState('')

  useEffect(() => {
    // Pega a lista de cartoes na API
    carregarCards();

    // Somente funciona no modo extensão
    try {
      // Obtém a URL da aba ativa e armazena no estado
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        setCurrentUrl(url);
        props.enviaFuncaoInicial(adicionarCard, url)
      });
    } catch (error) {

    }
  }, []);

  // --------------------------------------- FUNÇÕES P/ MANIPULAR CARDS --------------------------------------

  const buscarImagem = async (nomeTag) => {
    try {
      const imagem = await axios.get(`https://api.unsplash.com/search/photos?query=${nomeTag}&orientation=landscape&per_page=1&client_id=Z98UiqP-pTJ3779KAb3UbnNhfy_qqXApYGozFZcYoXc`);
      return imagem.data.results[0].urls.regular
    } catch (err) {
      console.log(err);
    }
  };

  const carregarCards = async () => {
    try {
      const response = await axios.get('https://websage-api.abelcode.dev/api/list-items');
      // for (let i = 0; i < response.data.length; i++ ){
      //   for (let j = 0; j < response.data[i].ramos.length; j++ ){
      //     console.log(response.data[i].ramos[j].url)
      //   }
      // }

      // response.data.forEach(tag => {
      //   tag.ramos.forEach(card => {
      //     console.log(card.tag1)
      //   })
      // })

      // response.data[0].ramos.forEach(element => {
      //   console.log(element.url)
      // })

      setCards(response.data[0].ramos);
      const linkImagem = await buscarImagem(response.data[0].ramos[0].tag2)
      setImagem(linkImagem)
    } catch (err) {
      console.log(err);
    }
  };

  const adicionarCard = async (url, statusBotao) => {
    statusBotao(true)
    await axios.post(`https://websage-api.abelcode.dev/api/save-item`, { url }).then((novoCard) => {
      // Sucesso! Você pode acessar os dados da resposta aqui
      setCards(cards => [...cards, novoCard.data]);
    }).catch(() => {
      alert("item não foi adicionado")
    }).finally(() => {
      // Sempre executado, independente de sucesso ou erro
      statusBotao(false)
    })
  }

  const deletarCard = async (id) => {
    await axios.delete(`https://websage-api.abelcode.dev/api/delete-item/${id}`).then(() => {
      // Sucesso! Você pode acessar os dados da resposta aqui
      // Encontrar o índice do item a ser removido
      // sem react => let indexToRemove = cards.findIndex(card => card._id === id);
      setCards(cards => cards.filter(card => card._id !== id));
      // Verificar se o item foi encontrado
      // Remover o item do array
    }).catch(() => {
      // Algo deu errado na requisição
      alert("item não foi apagado")
    }).finally(() => {
      // Sempre executado, independente de sucesso ou erro
    })
  }
  // --------------------------------------- FIM DAS FUNÇÕES P/ MANIPULAR CARDS --------------------------------------

  return (
    <>
      <div className={styles.container}>
        {cards.map(card => (
          <div key={card._id} className={styles.card}>
            <div style={{ backgroundImage: `url(${imagem})`, margin: '10px', borderRadius: '4.5px' }}>
              <a href={card.url}>
                <Card sx={{ display: 'flex', backgroundColor: '#ffffffd9' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6" sx={{ paddingBottom: '10px', fontWeight: '500' }}>
                        {card.titulo}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        {card.descricao}
                      </Typography>
                    </CardContent>
                    <div className={styles.tags}>
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

                      <IconButton aria-label="delete" size="small" color="error" onClick={() => deletarCard(card._id)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  </Box>
                </Card>
              </a>
            </div>
          </div >
        ))
        }
      </div>
    </>
  );
}
