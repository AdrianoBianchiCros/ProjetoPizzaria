import { NextFunction, Request, Response } from "express";
import { ListProductsService } from "../../services/product/ListProductsService";

class ListProductsController {
    async handle(req: Request, res: Response, _next: NextFunction) {
        const { disabled } = req.query;

        const parsedDisabled = disabled === undefined ? false : disabled === "true";

        const listProducts = new ListProductsService();
        const products = await listProducts.execute({ disabled: parsedDisabled });

        return res.status(200).json(products);
    }
}

export { ListProductsController };
