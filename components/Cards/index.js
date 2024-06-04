import styles from './Cards.module.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';

export default function Cards(props) {
  const [cards, setCards] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    // Pega a lista de cartoes na API
    carregarCards();
    
    // Somente funciona no modo extensão
    try {
      // Obtém a URL da aba ativa e armazena no estado
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        setCurrentUrl(url);
        props.enviaFuncaoInicial(adicionarCard, url)
      });
    } catch (error) {
      
    }
  }, []);

  // --------------------------------------- FUNÇÕES P/ MANIPULAR CARDS --------------------------------------

  const carregarCards = async () => {
    try {
      const response = await axios.get('https://websage-api.abelcode.dev/api/list-items');
      setCards(response.data[0].ramos);
    } catch (err) {
      console.log(err);
    }
  };

  const adicionarCard = async (url) => {
    await axios.post(`https://websage-api.abelcode.dev/api/save-item`, { url }).then((novoCard) => {
      // Sucesso! Você pode acessar os dados da resposta aqui
      setCards(cards => cards.push(novoCard));
    }).catch(() => {
      alert("item não foi adicionado")
    }).finally(() => {
      // Sempre executado, independente de sucesso ou erro
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
            <Card sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={card.imagem} // Use 'image' instead of 'src' for CardMedia
                alt={card.titulo}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h7">
                    {card.titulo}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" component="div">
                    {card.descricao}
                  </Typography>
                </CardContent>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  pl: 1,
                  pb: 1,
                }}>
                  {card.tag1 && <Chip label={card.tag1} />}
                  {card.tag2 && <Chip label={card.tag2} />}
                  {card.tag3 && <Chip label={card.tag3} />}
                  <DeleteForeverSharpIcon onClick={() => deletarCard(card._id)} />
                </Box>
              </Box>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
