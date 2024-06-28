import Box from "@mui/material/Box";
import { Card as CardMaterial } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import styles from "./Card.module.css";

export default function Card(props) {
    return (
        <>
            <div key={props.card._id} className={styles.card}>
                <div
                    style={{
                        backgroundImage: `url(${props.card.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        margin: "10px",
                        borderRadius: "4.5px",
                    }}
                >
                    <CardMaterial
                        className={styles.card}
                        sx={{ display: "flex", backgroundColor: "#ffffffd9" }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <a
                                href={props.card.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <CardContent sx={{ flex: "1 0 auto" }}>
                                    <Typography
                                        component="div"
                                        variant="h6"
                                        sx={{ paddingBottom: "10px", fontWeight: "500" }}
                                    >
                                        {props.card.titulo}
                                    </Typography>
                                    <Typography style={{width: '20rem'}}
                                        variant="subtitle2"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        {props.card.descricao}
                                    </Typography>
                                </CardContent>
                            </a>
                            <div className={styles.tags}>
                                <a
                                    href={props.card.url}
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
                                        {props.card.tag1 && <Chip label={props.card.tag1} />}
                                        {props.card.tag2 && <Chip label={props.card.tag2} />}
                                        {props.card.tag3 && <Chip label={props.card.tag3} />}
                                    </Box>
                                </a>
                                <IconButton
                                    z-index="1"
                                    aria-label="delete"
                                    size="small"
                                    color="error"
                                    onClick={
                                        () => props.deletarCard(props.tags.tag_raiz, props.card._id)
                                    }
                                >
                                    <Tooltip title="Apagar card">
                                        <DeleteIcon fontSize="inherit" />
                                    </Tooltip>
                                </IconButton>
                            </div>
                        </Box>
                    </CardMaterial>
                </div>
            </div>
        </>
    )
}
