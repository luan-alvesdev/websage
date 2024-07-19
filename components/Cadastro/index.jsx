import Box from '@mui/material/Box';
import styles from './Cadastro.module.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Alert, Button, IconButton, InputAdornment, Snackbar, TextField } from '@mui/material';
import { useValidationRegister } from '../../hooks/useValidation';
import { useState } from 'react';
import axios from 'axios';

export default function Cadastro(props) {

    const [backEndError, setBackEndError] = useState('')
    const [errorMsg, setErrorMsg] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowPasswordConfirm = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const yupSchema = useValidationRegister()

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    })

    const [erros, setErros] = useState({
        fullname: '',
        email: '',
        password: '',
        passwordConfirmation: ''
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

    const fazerCadastro = async (recebeSchema) => {
        axios
            .post(`https://cardsage-api.abelcode.dev/api/user/register`, recebeSchema)
            .then(async (response) => {
                console.log(response)
                setSuccessMsg(true);
                setTimeout(() => setSuccessMsg(false), 1000)
                setTimeout(() => {
                    props.setExibirCadastro(false),
                    props.setExibirLogin(true)
                }, 1500)
            })
            .catch((erro) => {
                console.error(erro);
                setBackEndError(erro.response.data.msg);
                setErrorMsg(true)
                setTimeout(() => setErrorMsg(false), 2000)
            });
    }

    const submeterFormulario = async (event) => {
        event.preventDefault();

        setSucesso('');
        setErros({
            fullname: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        });

        try {
            const recebeSchema = await yupSchema.validate(formData, {
                abortEarly: false
            })
            fazerCadastro(recebeSchema);
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
                <h1 className={styles.titulo}>CardSage</h1>
                <TextField
                    className={styles.campoTexto}
                    value={formData.fullname}
                    onChange={handleChange}
                    error={erros.fullname}
                    name="fullname"
                    helperText={erros.fullname}
                    id="filled-required"
                    label="Nome completo"
                    variant="filled"
                />
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
                    id="filled-required"
                    label="Senha"
                    variant="filled"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    className={styles.campoTexto}
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    error={erros.passwordConfirmation}
                    name="passwordConfirmation"
                    helperText={erros.passwordConfirmation}
                    id="filled-required"
                    label="Confirmar senha"
                    variant="filled"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordConfirm}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPasswordConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                /> 
                <Button
                    loadingPosition="end"
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                >
                    Criar cadastro
                </Button>
                <Snackbar open={errorMsg}
                // onClose={handleClose}
                >
                    <Alert
                        // onClose={handleClose}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {'Houve um erro ao fazer o registro de sua conta: ' + backEndError }
                    </Alert>
                </Snackbar>
                <Snackbar open={successMsg}
                // onClose={handleClose}
                >
                    <Alert
                        // onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {'Cadastro realizado com sucesso!' }
                    </Alert>
                </Snackbar>
                <span>
                    Já possui cadastro? <a href="#" onClick={() => { props.setExibirCadastro(false); props.setExibirLogin(true); }}>Clique aqui para entrar na sua conta.</a>
                </span>
            </Box>
        </>
    )
}