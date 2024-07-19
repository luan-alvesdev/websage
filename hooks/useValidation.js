import * as yup from 'yup'

export const useValidation = () => {
    return yup.object().shape({
        email: yup.string().required('Por favor, digite um e-mail válido').email('O formato de e-mail não está correto'),
        password: yup.string().required('Por favor, digite a sua senha'),
    })
}

export const useValidationRegister = () => {
    return yup.object().shape({
        fullname: yup.string().required('Por favor, informe seu nome completo'),
        email: yup.string().required('Por favor, digite um e-mail válido').email('Por favor, digite um formato de e-mail correto'),
        password: yup.string().required('Por favor, digite a sua senha'),
        passwordConfirmation: yup.string()
        .required('Por favor, confirme sua senha')
        .oneOf([yup.ref('password')], 'As senhas devem ser iguais'),
    })
}
