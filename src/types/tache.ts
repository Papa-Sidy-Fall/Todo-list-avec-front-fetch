import { z } from "zod";

// Types dérivés du validateur Zod
export type TacheCreateInput = z.infer<typeof tacheValidator>;
export type TacheUpdateInput = z.infer<typeof tacheValidator.partial>;

// Type pour la création complète avec userId, imageUrl et audioUrl
export type TacheCreateData = Omit<TacheCreateInput, 'assignedTo'> & {
  userId: number;
  imageUrl: string | null;
  audioUrl: string | null;
  assignedTo: number | null;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

// Types pour les erreurs Zod
export type ZodValidationError = {
  issues: Array<{
    code: string;
    path: (string | number)[];
    message: string;
  }>;
};

// Types pour les erreurs de validation
export type ValidationError = {
  field: string;
  message: string;
};

// Import du validateur pour référence
import { tacheValidator } from "../validator/tacheValidator.js";