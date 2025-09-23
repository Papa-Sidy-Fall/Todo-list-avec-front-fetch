import { TacheRepositorie } from "../repositorie/tacheRepositorie.js";
const repo = new TacheRepositorie();
export class TacheService {
    async findAll() {
        return await repo.findAll();
    }
    async findAllPaginated(page = 1, limit = 10) {
        return await repo.findAllPaginated(page, limit);
    }
    async findById(id) {
        return await repo.findById(id);
    }
    async create(data) {
        const tache = await repo.create(data);
        // Retourner la tâche avec les informations de l'utilisateur
        return await repo.findById(tache.id);
    }
    async update(id, data) {
        return await repo.update(id, data);
    }
    async delete(id) {
        return await repo.delete(id);
    }
    async updateStatus(id, newStatus) {
        return await repo.updateStatus(id, newStatus);
    }
}
//# sourceMappingURL=tacheService.js.map