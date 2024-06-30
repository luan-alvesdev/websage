import styles from "./Footer.module.css";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from '@mui/material/Button';

export default function Footer(props) {
  const [loading, setLoading] = React.useState(false);

  const statusBotao = (status) => {
    // Boolean
    setLoading(status);
  };

  

  return (
    <>
      <footer className={styles.footer}>
        <Button
          onClick={() => props.salvarCard(props.data, statusBotao)}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          color="primary"
          size="small"
        >
          {!loading ? <span>Adicionar</span> : <span>Processando...</span>}
        </Button>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </footer>
    </>
  );
}
