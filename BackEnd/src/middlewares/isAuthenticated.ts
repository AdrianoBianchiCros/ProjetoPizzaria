import {Request, Response, NextFunction} from 'express'
import {verify} from 'jsonwebtoken'

interface PayLoad{
    sub: String;
}

export function  isAuthenticated(
    req:Request,
    res:Response,
    next:NextFunction
){

        const  authToken = req.headers.authorization;


        if(!authToken){
            res.status(401).json({
                error:"No token !",
            });
        }

        // @ts-ignore
    const [, token] = authToken.split(' ');

        try{
            const { sub } = verify(token!,process.env.JWT_SECRET as string) as PayLoad;

            // @ts-ignore
            req.user_id = sub;

            return next();

        }catch(err){
            return res.status(401).json({
                error:"No token !",
            })
        }
};

