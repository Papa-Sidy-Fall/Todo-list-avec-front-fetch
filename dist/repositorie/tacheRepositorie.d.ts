import type { IRepository } from "./IRepository.js";
import type { Etat, Taches } from "@prisma/client";
import type { TacheUpdateInput } from "../types/tache.js";
export declare class TacheRepositorie implements IRepository<Taches> {
    findAll(): Promise<Taches[]>;
    findAllPaginated(page?: number, limit?: number): Promise<{
        data: Taches[];
        total: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<Taches | null>;
    create(data: Omit<Taches, "id">): Promise<Taches>;
    update(id: number, data: TacheUpdateInput): Promise<Taches>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, newStatus: Etat): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.Etat;
        titre: string;
        description: string;
        assignedTo: number | null;
        userId: number;
        imageUrl: string | null;
    }>;
}
//# sourceMappingURL=tacheRepositorie.d.ts.map