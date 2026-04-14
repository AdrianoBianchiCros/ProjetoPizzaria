import {Readable} from 'node:stream'
import prismaClient from "../../prisma/index";
import cloudinary from '../../config/cloudinary'


interface CreateProductServiceProps{
   name: string;
   price: number;
   description: string;
   category_id: string;
   imageBuffer: Buffer;
   imageName: string;
}
class  CreateProductService{
    async execute({
                      name,
                      price,
                      description,
                      category_id,
                      imageBuffer,
                      imageName
    }: CreateProductServiceProps){
       const categoryExists = await prismaClient.category.findFirst({
           where: {
               id: category_id,
           }
       })

        if(!categoryExists){
            throw new Error("Categoria não encotrada")
        }
        //Enviar para o cloudinary e salvar a imagem e pegar a url
      let bannerUrl = ""
        try{
            const result = await new Promise<any>((resolve, reject ) => {
                const uploadStream = cloudinary.uploader.upload_stream({
                    folder:"products",
                    resource_type:"image",
                    public_id:`${Date.now()}-${imageName.split(".")[0]}`,
                    },
                    (error, result)=>{
                        if(error) reject(error);
                        else resolve(result);
                    }
                )
                //Criar o steam do buffer e fazer o pipe para o cloudinary
                const bufferStream = Readable.from(imageBuffer);
                bufferStream.pipe(uploadStream)
            })
            bannerUrl = result.secure_url
        }catch(error){
            console.log(error)
            throw new Error("Error ao fazer upload na imagem")
        }
        //salvar a url da imagem e os dados no banco como um novo produto

        const product = await prismaClient.product.create({
            data:{
                name:name,
                price:price,
                description:description,
                banner:bannerUrl,
                category_id:category_id,
            },
            select:{
                id:true,
                name:true,
                price:true,
                description:true,
                category_id:true,
                banner:true,
                createAd:true,
            }
        })
        return product
    }
}

export {CreateProductService};