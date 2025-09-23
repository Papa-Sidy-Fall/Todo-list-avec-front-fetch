import { prisma } from "../utils/prismclient.js";
export class userRepositorie {
    async findAll() {
        return await prisma.user.findMany();
    }
    async findById(id) {
        return await prisma.user.findUnique({ where: { id } });
    }
    async create(data) {
        return await prisma.user.create({ data });
    }
    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email } });
    }
    async delete(id) {
        await prisma.user.delete({ where: { id } });
    }
}
//# sourceMappingURL=userRepositorie.js.map