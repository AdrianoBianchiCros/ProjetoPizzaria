import prismaClient from "../../prisma/index";

interface ListProductsByCategoryServiceProps {
    category_id: string;
}

class ListProductsByCategoryService {
    async execute({ category_id }: ListProductsByCategoryServiceProps) {
        const categoryExists = await prismaClient.category.findFirst({
            where: { id: category_id },
            select: { id: true },
        });

        if (!categoryExists) {
            throw new Error("Categoria não encontrada");
        }

        try {
            const products = await prismaClient.product.findMany({
                where: {
                    category_id:category_id,
                    disabel: false,
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
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
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
                category: product.category,
            }));
        } catch {
            throw new Error("Falha ao listar produtos da categoria");
        }
    }
}

export { ListProductsByCategoryService };
