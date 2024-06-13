import styles from './Login.module.css'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useValidation } from '../../hooks/useValidation';
import { useState } from 'react';

export default function Login() {

    const yupSchema = useValidation()

    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    })

    const [erros, setErros] = useState({
        email: '',
        senha: ''
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

    const submeterFormulario = async (event) => {
        event.preventDefault()

        setSucesso('')
        setErros({
            email: '',
            senha: ''
        })

        try {
            const recebeSchema = await yupSchema.validate(formData, {
                abortEarly: false
            })
            console.log(recebeSchema)
        } catch (validationErrors) {
            const newErrors = {};
            validationErrors.inner.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErros(newErrors);
            console.error("Erros de validação: ", newErrors);
        }
    }

    return (
        <Box
            className={styles.form}
            component="form"
            onSubmit={submeterFormulario}
        >
            <h1 className={styles.titulo}>Login</h1>
            <TextField
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
                value={formData.senha}
                onChange={handleChange}
                error={erros.senha}
                name="senha"
                helperText={erros.senha}
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
    )
}