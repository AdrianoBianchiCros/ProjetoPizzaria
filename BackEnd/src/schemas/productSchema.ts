import {z} from 'zod'


export const createProductSchema = z.object({
    body:z.object({
        name:  z.string().min(1,{message:'O nome do produto é obrigatorio'}),
        price: z.string().min(1,{message:'O nome do preço é obrigatorio'}).regex(/^\d+$/),
        description: z.string().min(1,{message:'Descrição é obrigatorio'}),
        category_id: z.string().min(1,{message:'Categoria é obrigatorio'}),
    })
})

export const listProductsSchema = z.object({
    query: z.object({
        disabled: z.enum(["true", "false"],{
            message:"O paramentro disble deve ser True ou False"
        })
            .optional()
            .default("false")
            .transform((val) => val === "true"),
    })
})

export const deleteProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, { message: "Id do produto é obrigatorio" }),
    }),
})