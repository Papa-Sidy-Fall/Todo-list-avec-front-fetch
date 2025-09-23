import { z } from "zod";
export declare const statusEnum: z.ZodEnum<{
    EN_COURS: "EN_COURS";
    TERMINER: "TERMINER";
    A_FAIRE: "A_FAIRE";
}>;
export declare const tacheValidator: z.ZodObject<{
    titre: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<{
        EN_COURS: "EN_COURS";
        TERMINER: "TERMINER";
        A_FAIRE: "A_FAIRE";
    }>;
    assignedTo: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
//# sourceMappingURL=tacheValidator.d.ts.map