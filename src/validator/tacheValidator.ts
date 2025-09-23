import {z} from "zod"

export  const statusEnum = z.enum(["EN_COURS", "TERMINER", "A_FAIRE"]);
export const tacheValidator = z.object ({
    titre: z.string().min(2, {message:"minimum deux caractere requis"}),
    description: z.string().min(1,{message:"description requise"}),
    status: statusEnum,
    assignedTo: z.number().nullable().optional()
})