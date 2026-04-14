import prismaClient from "../../prisma/index";

interface FinishOrderProps{
    order_id:string;
}

class FinishOrderService{
    async execute({order_id}: FinishOrderProps){
        try{

            const order = await prismaClient.orders.findFirst({
                where:{
                    id:order_id
                }

        })
        if(!order){
            throw new Error("Falha ao finalizar o Pedido")
        }

        //Atualiza a propriedade Draf para falso
        const orderUpdate = await prismaClient.orders.update({
            where:{
                id:order_id
            },
            data:{
               status:true,
            },
            select:{
                id:true,
                table:true,
                name:true,
                status:true,
                draft:true,
                createAd:true,

            }
        })

        return orderUpdate;
        }catch(err){
            throw new Error("Falha ao finalizar o pedido")
        }
    }
}


export  {FinishOrderService}

