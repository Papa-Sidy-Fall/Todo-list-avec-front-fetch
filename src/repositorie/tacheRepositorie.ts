import type { IRepository } from "./IRepository.js"
import { prisma } from "../utils/prismclient.js"
import type {Etat, Taches} from "@prisma/client"
import type { TacheUpdateInput } from "../types/tache.js"
export class TacheRepositorie implements IRepository<Taches>{

    async findAll(): Promise<Taches[]> {
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
            } as any
        })
    }

    async findAllPaginated(page: number = 1, limit: number = 10): Promise<{data: Taches[], total: number, totalPages: number}> {
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
                } as any
            }),
            prisma.taches.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data, total, totalPages };
    }
    async findById(id: number): Promise<Taches | null> {
        return await prisma.taches.findUnique({
            where: {id},
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
            } as any
        })
    }
    async create(data: Omit<Taches, "id">): Promise<Taches> {
        return await prisma.taches.create({data})
    }
   async update(id: number, data: TacheUpdateInput): Promise<Taches> {
       return await prisma.taches.update({where: {id}, data: data as any})

   }
    async delete(id: number): Promise<void> {
        await prisma.taches.delete({where: {id}})
    }
     async updateStatus(id: number, newStatus: Etat){
        const updateData: any = { status: newStatus };

        // Mettre à jour les dates selon le nouveau statut
        if (newStatus === 'EN_COURS') {
            updateData.startedAt = new Date();
        } else if (newStatus === 'TERMINER') {
            updateData.completedAt = new Date();
            // S'assurer que startedAt est défini si on passe directement à TERMINER
            updateData.startedAt = { set: updateData.startedAt || new Date() };
        }

        return await prisma.taches.update({
            where: {id},
            data: updateData
        })

    }


}
