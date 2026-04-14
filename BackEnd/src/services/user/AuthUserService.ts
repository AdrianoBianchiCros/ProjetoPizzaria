import prismaClient from "../../prisma";
import {compare} from "bcryptjs";
import {sign} from "jsonwebtoken";

interface AuthUserController {
    email: string;
    password: string;
}

class AuthUserService{
    async execute({email,password}:AuthUserController) {
        const user = await prismaClient.user.findFirst({
            where:{
                email:email
            }
        })

        if(!user){
            throw new Error("Email / Senha incorretos");
        }

        //Verificar se senha esta correta
        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new Error("Email / Senha incorretos");
        }

        //Gerando token JWT
        const token = sign({
            name:user.name,
            email:user.email,
        },process.env.JWT_SECRET as string,{
            subject:user.id,
            expiresIn: "30d"
        });

        return {
            id: user.id,
            name:user.name,
            email:user.email,
            role: user.role,
            token: token,
        }
    }
}

export { AuthUserService };