import {object, string, ref} from "yup";

export const registerSchema = object().shape({
    confirmPassword: string()
        .required("Repite el password")
        .oneOf([ref("password"), null], "El password no coincide"),
    password: string()
        .required("El password es requerido")
        .min(8,"El password debe tener minimo 8 caracteres")
        .matches(/[A-Z]/, "El password debe contener al menos una mayúscula")
        .matches(/[^a-zA-Z0-9]/, "El password debe contener al menos un caracter especial"),
    email: string()
        .required("El Email es requerido")
        .email("No es un email Valido")
});

export const loginSchema = object().shape({
    password: string()
        .required("El password es requerido")
        .min(8,"El password debe tener minimo 8 caracteres"),
    email: string()
        .required("El Email es requerido")
        .email("No es un email Valido")
});
