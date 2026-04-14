import { Request, Response } from "express";
import { ListOrderService } from "../../services/order/ListOrderService";



class ListOrderController{
    async handle(req: Request, res: Response){
        const draft = req.query?.draft as string | undefined

        const listOrder = new ListOrderService();
        const orders = await listOrder.execute({
            draft: draft
        });

        return res.json(orders);
        
    }
}

export {ListOrderController}