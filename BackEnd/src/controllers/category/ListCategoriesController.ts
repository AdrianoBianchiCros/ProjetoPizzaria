import { NextFunction, Request, Response } from 'express'
import { ListCategoriesService } from '../../services/category/ListCategoriesService'

class ListCategoriesController {
    async handle(_req: Request, res: Response, _next: NextFunction) {
        const listCategories = new ListCategoriesService()
        const categories = await listCategories.execute()
        return res.status(200).json(categories)
    }
}

export { ListCategoriesController }
