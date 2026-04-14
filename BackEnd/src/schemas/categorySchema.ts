import {z} from 'zod'

export const createCategorySchema = z.object({
    body: z.object({
        name: z
            .string({message: 'Erro ao gravar a categoria !'})
            .min(2,{message:'Nome da categoria precisa ter dois caracteres'}),
    })
})

export const listProductsByCategorySchema = z.object({
    query: z.object({
        category_id: z
            .string({ message: "category_id é obrigatório" })
            .min(1, { message: "category_id é obrigatório" }),
    }),
})