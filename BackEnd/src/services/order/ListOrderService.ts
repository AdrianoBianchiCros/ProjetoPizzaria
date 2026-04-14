import prismaClient from "../../prisma";

interface ListOrderServiceProps{
   draft?:string
}

class ListOrderService{
    async execute({draft}: ListOrderServiceProps){
        const orders = await prismaClient.orders.findMany({
            where:{
                draft: draft === "true" ? true : false
            },
            select:{
                id:true,
                table:true,
                name:true,
                status:true,
                draft:true,
                createAd:true,
                itens:{
                    select:{
                        id:true,
                        amount:true,
                        product:{
                            select:{
                                id:true,
                                name:true,
                                price:true,
                                description:true,
                                banner:true
                            }
                        }
                    }
                }
            }
        })
        return orders

    }
}

export {ListOrderService}