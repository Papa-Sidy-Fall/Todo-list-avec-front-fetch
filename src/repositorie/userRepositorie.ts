import { prisma } from "../utils/prismclient.js"
import type {Etat, User, Prisma} from "@prisma/client"
import type { IRepository } from "./IRepository.js"
export class userRepositorie {


    async findAll() {
        return await prisma.user.findMany()
    }
    async findById(id: number){
        return await prisma.user.findUnique({where: {id}})
    }
    async create(data: Prisma.UserCreateInput ){
        return await prisma.user.create({data})
    }

    async findByEmail(email: string){
        return await prisma.user.findUnique({where: {email}})
    }
    async delete(id: number): Promise<void> {
         await prisma.user.delete({where: {id}})
    }


}
