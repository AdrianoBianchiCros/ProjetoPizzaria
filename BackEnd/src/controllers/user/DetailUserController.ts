import {NextFunction, Request, Response} from 'express'
import { DetailUserService} from '../../services/user/DetailUserService'

class DetailUserController {
    async handle(req: Request, res: Response, _next: NextFunction) {
        const use_id = req.user_id;

        const detailUser = new DetailUserService()
        const user = await detailUser.execute(use_id );
        res.json(user)
    }
}

export { DetailUserController }