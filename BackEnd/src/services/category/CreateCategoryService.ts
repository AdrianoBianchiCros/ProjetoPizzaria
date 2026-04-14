import prismaClient from '../../prisma/index'

interface CreatCategoryPropos{
    name: string,
}

class CreateCategoryService{
    async execute({name}:CreatCategoryPropos){
        try{
            const category = await prismaClient.category.create({
                data:{
                    name:name,
                },
                select:{
                    id:true,
                    name: true,
                    createAd: true
                }
            });
            return category;
        }catch(err){
            throw new Error("Falha ao criar categoria")
        }
    }
}

export {CreateCategoryService}