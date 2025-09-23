import { prisma } from "../utils/prismclient.js";
export class TacheRepositorie {
    async findAll() {
        return await prisma.taches.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        nom: true,
                        email: true
                    }
                },
                assignedUser: {
                    select: {
                        id: true,
                        nom: true,
                        email: true
                    }
                }
            }
        });
    }
    async findAllPaginated(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.taches.findMany({
                skip,
                take: limit,
                orderBy: { id: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            nom: true,
                            email: true
                        }
                    },
                    assignedUser: {
                        select: {
                            id: true,
                            nom: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.taches.count()
        ]);
        const totalPages = Math.ceil(total / limit);
        return { data, total, totalPages };
    }
    async findById(id) {
        return await prisma.taches.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        nom: true,
                        email: true
                    }
                },
                assignedUser: {
                    select: {
                        id: true,
                        nom: true,
                        email: true
                    }
                }
            }
        });
    }
    async create(data) {
        return await prisma.taches.create({ data });
    }
    async update(id, data) {
        return await prisma.taches.update({ where: { id }, data });
    }
    async delete(id) {
        await prisma.taches.delete({ where: { id } });
    }
    async updateStatus(id, newStatus) {
        return await prisma.taches.update({
            where: { id },
            data: { status: newStatus }
        });
    }
}
//# sourceMappingURL=tacheRepositorie.js.map