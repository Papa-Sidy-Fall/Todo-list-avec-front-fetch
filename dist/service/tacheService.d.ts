import type { Taches, Etat } from "@prisma/client";
export declare class TacheService {
    findAll(): Promise<Taches[]>;
    findAllPaginated(page?: number, limit?: number): Promise<{
        data: Taches[];
        total: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<Taches | null>;
    create(data: any): Promise<Taches>;
    update(id: number, data: any): Promise<Taches>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, newStatus: Etat): Promise<{
        id: number;
        titre: string;
        description: string;
        status: import("@prisma/client").$Enums.Etat;
        userId: number;
        assignedTo: number | null;
        imageUrl: string | null;
    }>;
}
//# sourceMappingURL=tacheService.d.ts.map