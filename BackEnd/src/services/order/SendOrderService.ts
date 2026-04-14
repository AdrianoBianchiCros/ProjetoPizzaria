import prismaClient from "../../prisma/index";

interface SendOrderProps{
    name:string;
    order_id:string;
}

class SendOrderService{
    async execute({name,order_id}: SendOrderProps){
        try{

            const order = await prismaClient.orders.findFirst({
                where:{
                    id:order_id
                }

        })
        if(!order){
            throw new Error("Pedido não encontrado")
        }

        //Atualiza a propriedade Draf para falso
        const orderUpdate = await prismaClient.orders.update({
            where:{
                id:order_id
            },
            data:{
                draft:false,
                name:name
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
            throw new Error("Falha ao enviar pedido")
        }
    }
}


export  {SendOrderService}

