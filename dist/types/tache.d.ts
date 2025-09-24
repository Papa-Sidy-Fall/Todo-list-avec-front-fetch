import { z } from "zod";
export type TacheCreateInput = z.infer<typeof tacheValidator>;
export type TacheUpdateInput = z.infer<typeof tacheValidator.partial>;
export type TacheCreateData = Omit<TacheCreateInput, 'assignedTo'> & {
    userId: number;
    imageUrl: string | null;
    assignedTo: number | null;
};
export type ZodValidationError = {
    issues: Array<{
        code: string;
        path: (string | number)[];
        message: string;
    }>;
};
export type ValidationError = {
    field: string;
    message: string;
};
import { tacheValidator } from "../validator/tacheValidator.js";
//# sourceMappingURL=tache.d.ts.map