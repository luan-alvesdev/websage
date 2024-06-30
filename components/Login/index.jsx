import styles from './Login.module.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useValidation } from '../../hooks/useValidation';
import { useState } from 'react';
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

export default function Login(props) {

    const yupSchema = useValidation()
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [erros, setErros] = useState({
        email: '',
        password: ''
    })

    const [sucesso, setSucesso] = useState('')

    const handleChange = (event) => {
        setFormData(oldState => {
            return {
                ...oldState,
                [event.target.name]: event.target.value,
            }
        })
    }

    const fazerLogin = async (recebeSchema) => {
        axios
            .post(`https://websage-api.abelcode.dev/api/user/login`, recebeSchema)
            .then(async (response) => {
                const novoCardData = response.data;
                const token = novoCardData.access_token
                localStorage.setItem("tokenAutenticacao", token)
                props.setExibirLogin(false)
            })
            .catch((erro) => {
                console.error(erro);
                setOpen(true)
                setTimeout(() => setOpen(false), 1200)
            });
    }

    const submeterFormulario = async (event) => {
        event.preventDefault();

        setSucesso(''); //
        setErros({
            email: '',
            password: ''
        });

        try {
            const recebeSchema = await yupSchema.validate(formData, {
                abortEarly: false
            })
            fazerLogin(recebeSchema)
        } catch (validationErrors) {
            const newErrors = {};
            validationErrors.inner.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErros(newErrors);
            console.error("Erros de validação: ", newErrors);
        }
    };

    return (
        <>
            <Box
                className={styles.form}
                component="form"
                onSubmit={submeterFormulario}
            >
                <h1 className={styles.titulo}>WebSage</h1>
                <TextField
                    className={styles.campoTexto}
                    value={formData.email}
                    onChange={handleChange}
                    error={erros.email}
                    name="email"
                    helperText={erros.email}
                    id="filled-required"
                    label="Email"
                    variant="filled"
                />
                <TextField
                    className={styles.campoTexto}
                    value={formData.password}
                    onChange={handleChange}
                    error={erros.password}
                    name="password"
                    helperText={erros.password}
                    id="filled-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="filled"
                />
                <Button
                    loadingPosition="end"
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                >
                    Login
                </Button>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} 
            // onClose={handleClose}
            >
                <Alert
                    // onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    E-mail ou senha inválidos.
                </Alert>
            </Snackbar>
        </>
    )
}