import prismaClient from "../../prisma/index";

interface ListProductsServiceProps {
    disabled: boolean;
}

class ListProductsService {
    async execute({ disabled }: ListProductsServiceProps) {
        try {
            const products = await prismaClient.product.findMany({
                where: {
                    disabel: disabled,
                },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                    category_id: true,
                    disabel: true,
                    createAd: true,
                    category:{
                        select:{
                            id:true,
                            name:true,
                        }
                    }
                },
                orderBy: {
                    createAd: "desc",
                },
            });

            return products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                banner: product.banner,
                category_id: product.category_id,
                disabled: product.disabel,
                createAd: product.createAd,
            }));
        } catch {
            throw new Error("Falha ao listar produtos");
        }
    }
}

export { ListProductsService };
