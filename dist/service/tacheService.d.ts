import type { Taches, Etat } from "@prisma/client";
import type { TacheCreateData, TacheUpdateInput } from "../types/tache.js";
export declare class TacheService {
    findAll(): Promise<Taches[]>;
    findAllPaginated(page?: number, limit?: number): Promise<{
        data: Taches[];
        total: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<Taches | null>;
    create(data: TacheCreateData): Promise<Taches>;
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
        audioUrl: string | null;
    }>;
}
//# sourceMappingURL=tacheService.d.ts.map