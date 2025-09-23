import {userRepositorie} from "../repositorie/userRepositorie.js"
import type {User, Prisma} from "@prisma/client"
const repo = new userRepositorie()
export class UserService {

    async findAll() {
        return await repo.findAll()
    }
    async findById(id: number){
           return await repo.findById(id)
    }
    async create(data: Prisma.UserCreateInput) {
            return await repo.create(data);
    }

    async findByEmail(email: string){
           return await repo.findByEmail(email)
    }

}
