import prismaClient from "../../prisma/index";

interface DeleteOrderProps{
    order_id:string;
}

class DeleteOrderService{
    async execute({order_id}: DeleteOrderProps){
        try{

            const order = await prismaClient.orders.findFirst({
                where:{
                    id:order_id
                }

        })
        if(!order){
            throw new Error("Falha ao deletar o Pedido")
        }

        await prismaClient.orders.delete({
            where:{
                id:order_id
            }
        })

        return {message:"Pedido deletado com sucesso",order};
        }catch(err){
            console.log(err)
            throw new Error("Falha ao deletar o pedido")
        }
    }
}


export  {DeleteOrderService}

