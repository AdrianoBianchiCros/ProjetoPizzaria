import { Request, Response } from "express";
import { AddItemOrderService } from "../../services/order/AddItemOrderService";


class AddItemController{
    async handle(req: Request, res: Response){
        const {order_id, product_id, amount} = req.body

        const addItem = new AddItemOrderService();

        const newItem = await addItem.execute({
            order_id,
            product_id,
            amount
        })

        res.status(201).json(newItem)

    }
}



export {AddItemController}