import prismaClient from '../../prisma/index'

class ListCategoriesService {
    async execute() {
        try {
            const categories = await prismaClient.category.findMany({
                select: {
                    id: true,
                    name: true,
                    createAd: true,
                },
                orderBy: {
                    createAd: 'desc' },
            })
            return categories
        } catch {
            throw new Error('Falha ao listar categorias')
        }
    }
}

export { ListCategoriesService }
