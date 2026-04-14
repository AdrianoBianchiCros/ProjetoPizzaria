import prismaClient from "../../prisma";

interface RemoveItemServiceProps {
    item_id: string;
}

class RemoveItemOrderService {
    async execute({ item_id }: RemoveItemServiceProps) {
        try{
            const itemExists = await prismaClient.item.findFirst({
            where: {
                id: item_id,
            },
        });

        if (!itemExists) {
            throw new Error("Item não encontrado");
        }

        const item = await prismaClient.item.delete({
            where: {
                id: item_id,
            },
            select: {
                id: true,
                amount: true,
                order_id: true,
                product_id: true,
            },
        });

        return {message:"Item removido com sucesso",item};
        }catch(err){
            throw new Error("Falha ao remover item do pedido")
        }
    }
}

export { RemoveItemOrderService };
