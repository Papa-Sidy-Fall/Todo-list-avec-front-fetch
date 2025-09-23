import type { Prisma } from "@prisma/client";
export declare class UserService {
    findAll(): Promise<{
        id: number;
        nom: string;
        email: string;
        password: string;
    }[]>;
    findById(id: number): Promise<{
        id: number;
        nom: string;
        email: string;
        password: string;
    } | null>;
    create(data: Prisma.UserCreateInput): Promise<{
        id: number;
        nom: string;
        email: string;
        password: string;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        nom: string;
        email: string;
        password: string;
    } | null>;
}
//# sourceMappingURL=userService.d.ts.map