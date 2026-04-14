import prismaClient from "../../prisma/index";

interface DeleteProductServiceProps {
    product_id: string;
}

class DeleteProductService {
    async execute({product_id}: DeleteProductServiceProps) {
        try {
            await prismaClient.product.update({
                where: {
                    id: product_id,
                },
                data: {
                    disabel: true
                }
            });
            return {message: "Produto deletado/arquivado com sucesso"}
        } catch (err) {
            throw new Error("Produto não encontrado");
        }
    }
}

export { DeleteProductService };
