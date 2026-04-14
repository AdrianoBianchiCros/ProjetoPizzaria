import {NextFunction, Request, Response} from "express"
import {CreateProductService} from '../../services/product/CreateProductService'

class CreateProductController {
    async handle(req: Request, res: Response, _next: NextFunction) {

        const {name,price,description,category_id } = req.body;

        if(!req.file){
            throw new Error("Imagem é obrigatoria")
        }

        const createProduct = new CreateProductService();
        const product = await createProduct.execute({
            name:name,
            price:parseInt(price),
            description:description,
            category_id:category_id,
            imageBuffer:req.file.buffer,
            imageName: req.file.originalname,

        });

        res.json(product);
    }
}

export {CreateProductController}