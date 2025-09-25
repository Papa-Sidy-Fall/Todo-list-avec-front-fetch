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
        return await prisma.taches.update({ where: { id }, data: data });
    }
    async delete(id) {
        await prisma.taches.delete({ where: { id } });
    }
    async updateStatus(id, newStatus) {
        const updateData = { status: newStatus };
        // Mettre à jour les dates selon le nouveau statut
        if (newStatus === 'EN_COURS') {
            updateData.startedAt = new Date();
        }
        else if (newStatus === 'TERMINER') {
            updateData.completedAt = new Date();
            // S'assurer que startedAt est défini si on passe directement à TERMINER
            updateData.startedAt = { set: updateData.startedAt || new Date() };
        }
        return await prisma.taches.update({
            where: { id },
            data: updateData
        });
    }
}
//# sourceMappingURL=tacheRepositorie.js.map