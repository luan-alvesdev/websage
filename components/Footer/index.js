import Button from '@mui/material/Button';
import styles from './Footer.module.css';
import SendIcon from '@mui/icons-material/Send';
import React from "react";

export default function Footer(props) {

  return (
    <>
      <footer className={styles.footer}>
        <Button onClick={() => props.salvarCard(props.url)} variant="outlined" startIcon={<SendIcon />}>Analise a página</Button>
      </footer>
    </>
  );
}
