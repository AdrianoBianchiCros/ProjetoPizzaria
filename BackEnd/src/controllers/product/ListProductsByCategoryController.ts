import { NextFunction, Request, Response } from "express";
import { ListProductsByCategoryService } from "../../services/product/ListProductsByCategoryService";

class ListProductsByCategoryController {
    async handle(req: Request, res: Response, _next: NextFunction) {
        const category_id = String(req.query.category_id ?? "");

        const listProductsByCategory = new ListProductsByCategoryService();
        const products = await listProductsByCategory.execute({ category_id });

        return res.status(200).json(products);
    }
}

export { ListProductsByCategoryController };
