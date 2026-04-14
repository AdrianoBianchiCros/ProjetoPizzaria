import prismaClient from "../../prisma";

interface DetailOrderServiceProps {
    order_id: string;
}

class DetailOrderService {
    async execute({ order_id }: DetailOrderServiceProps) {
        try{
          const order = await prismaClient.orders.findFirst({
            where: {
                id: order_id,
            },
            select: {
                id: true,
                table: true,
                name: true,
                status: true,
                draft: true,
                createAd: true,
                itens: {
                    select: {
                        id: true,
                        amount: true,
                        product_id: true,
                        createAd: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                description: true,
                                banner: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        return order;
        }catch(err){
            throw new Error("Falha ao listar pedido")
        }
    }
}

export { DetailOrderService };
