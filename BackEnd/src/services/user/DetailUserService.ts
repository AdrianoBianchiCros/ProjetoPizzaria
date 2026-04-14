import prismaClient from "../../prisma";


class DetailUserService {
    async execute(user_id: string){

        try{

            const user = await prismaClient.user.findFirst({
                where:{
                    id: user_id,
                },
                select:{
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            })

            if(!user){
                throw new Error("User not found!");
            }

            return user;
        }catch(err) {
            console.log(err);
            throw new Error("User not found!");

        }
    }
}

export { DetailUserService }