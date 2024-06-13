import * as yup from 'yup'

export const useValidation = () => {
    return yup.object().shape({
        email: yup.string().required('Por favor, digite um e-mail válido').email('O formato de e-mail não está correto'),
        senha: yup.string().required('Por favor, digite a sua senha'),
    })
}