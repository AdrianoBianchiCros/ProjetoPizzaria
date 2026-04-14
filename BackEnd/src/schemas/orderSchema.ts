import { Query } from "pg";
import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        table: z
            .number({ message: "Número da mesa deve ser um inteiro" })
            .int({ message: "Número da mesa deve ser um inteiro" })
            .positive({ message: "Número da mesa deve ser positivo" }),
        name: z
            .string({ message: "Nome do cliente é obrigatório" })
            .min(1, { message: "Nome do cliente é obrigatório" }),
    }),
});


export const addItemSchema = z.object({
   body:z.object({
    order_id:z
    .string({message:'Order deve ser uma string'})
    .min(1,'Order deve ser obrigatorio'),

    product_id:z
    .string({message:'Product deve ser uma string'})
    .min(1,{message:'Product deve ser obrigatorio'}),

    amount:z
    .number()
    .int("A quantidade deve ser um numero inteiro")
    .positive("A quantidade deve ser um numero positivo"),
    }),
})

export const removeItemSchema = z.object({
    query: z.object({
        item_id: z
            .string({ message: "Item deve ser uma string" })
            .min(1, { message: "Item deve ser obrigatorio" }),
    }),
});

export const detailOrderSchema = z.object({
    query: z.object({
        order_id: z
            .string({ message: "Item deve ser uma string" })
            .min(1, { message: "Item deve ser obrigatorio" }),
    }),
});


export const sendOrderSchema = z.object({
    body: z.object({
        order_id: z
            .string({ message: "Order deve ser uma string" })
            .min(1, { message: "Order deve ser obrigatorio" })
    })    
})

export const finishOrderSchema = z.object({
    body: z.object({
        order_id: z.string({ message: "Order não encontrada"})
    })
})

export const deleteOrderSchema = z.object({
     query: z.object({
        order_id: z
            .string({ message: "Order não encontrada, Id do pedido é obrigatorio"})
    })
})