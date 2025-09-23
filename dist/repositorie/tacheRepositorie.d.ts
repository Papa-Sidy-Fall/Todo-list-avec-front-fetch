import type { IRepository } from "./IRepository.js";
import type { Etat, Taches } from "@prisma/client";
export declare class TacheRepositorie implements IRepository<Taches> {
    findAll(): Promise<Taches[]>;
    findAllPaginated(page?: number, limit?: number): Promise<{
        data: Taches[];
        total: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<Taches | null>;
    create(data: Omit<Taches, "id">): Promise<Taches>;
    update(id: number, data: any): Promise<Taches>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, newStatus: Etat): Promise<{
        id: number;
        titre: string;
        description: string;
        status: import("@prisma/client").$Enums.Etat;
        userId: number;
        assignedTo: number | null;
    }>;
}
//# sourceMappingURL=tacheRepositorie.d.ts.map