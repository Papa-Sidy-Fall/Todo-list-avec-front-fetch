import {TacheRepositorie} from "../repositorie/tacheRepositorie.js"
import type {Taches,Etat} from "@prisma/client"
const repo = new TacheRepositorie()
export class TacheService {

    async findAll(): Promise<Taches[]> {
        return await repo.findAll()
    }

    async findAllPaginated(page: number = 1, limit: number = 10): Promise<{data: Taches[], total: number, totalPages: number}> {
        return await repo.findAllPaginated(page, limit)
    }
    async findById(id: number): Promise<Taches | null> {
           return await repo.findById(id)
    }
    async create(data: any): Promise<Taches> {
            const tache = await repo.create(data);
            // Retourner la tâche avec les informations de l'utilisateur
            return await repo.findById(tache.id) as Taches;
    }
    async update(id: number, data: any): Promise<Taches> {
             return await repo.update(id, data)
     }
    async delete(id: number): Promise<void> {
            return await repo.delete(id)
    }
    async updateStatus(id: number, newStatus: Etat){
        return await repo.updateStatus(id,newStatus)
    }

}
