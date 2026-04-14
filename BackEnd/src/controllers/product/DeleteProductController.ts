import { NextFunction, Request, Response } from "express";
import { DeleteProductService } from "../../services/product/DeleteProductService";

class DeleteProductController {
    async handle(req: Request, res: Response, _next: NextFunction) {
        const product_id = req.query?.product_id as string;

        const deleteProduct = new DeleteProductService();
        const product = await deleteProduct.execute({ product_id });

        return res.status(200).json(product);
    }
}

export { DeleteProductController };
