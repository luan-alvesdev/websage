import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Tooltip } from "@mui/material";
import styles from './Header.module.css';

export default function Header(props) {

  const logOff = () => {
    localStorage.removeItem("tokenAutenticacao");
    props.setExibirLogin(true)
  }

  return (
    <>
      <div className={styles.head}>
        <h1 className={styles.titulo}></h1>
        <div className={styles.logout}>
          <Tooltip title="Sair">
            <LogoutOutlinedIcon
              aria-label="Log Off"
              size="large"
              onClick={() => logOff()}
            >
            </LogoutOutlinedIcon>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
