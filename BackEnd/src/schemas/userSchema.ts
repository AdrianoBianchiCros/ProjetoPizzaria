import { z } from 'zod'


export const createUserSchema = z.object({
    body: z.object({
        name: z
            .string({message: "Name is required"})
            .min(3,{message: "O nome precisa ter no minimo trez letras"}),
        email: z
            .string({message: "Email precisa ser valido"}),
        password: z
            .string({message: "Password é obrigatoria"})
            .min(6,{message: "Password precisa ter no minimo seis caracteres"})
    })
});

export const authUserSchema = z.object({
    body: z.object({
        email: z
            .string({message: "Email precisa ser valido"}),
        password: z
            .string({message: "Password é obrigatoria"})
            .min(1,{message: "Password precisa ter no minimo seis caracteres"})
    })
})