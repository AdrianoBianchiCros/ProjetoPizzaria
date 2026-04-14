import prismaClient from "../../prisma/index";
import {hash} from 'bcryptjs'

interface createUserProps {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    async execute({name,email,password}:createUserProps){

        const userAlreadyExist = await prismaClient.user.findFirst({
            where:{email:email
            }
        });
        if(userAlreadyExist){
            throw new Error(`User already exists with email: ${email}`);
        }

        const passwordHash = await hash(password, 8);

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true,
            },
        })

        return user;
    }
}

export  {CreateUserService};