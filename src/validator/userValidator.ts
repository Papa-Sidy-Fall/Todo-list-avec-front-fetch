import { z } from 'zod';

// Schéma de validation pour l'inscription
export const registerSchema = z.object({
  nom: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Le nom ne peut contenir que des lettres et des espaces'),

  email: z
    .string()
    .email('Veuillez fournir un email valide'),

  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),

  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z
    .string()
    .email('Veuillez fournir un email valide'),

  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
});

// Fonction de validation pour l'inscription
export const validateRegisterData = (data: unknown) => {
  try {
    const validData = registerSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'Erreur de validation' }] };
  }
};

// Fonction de validation pour la connexion
export const validateLoginData = (data: unknown) => {
  try {
    const validData = loginSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return { success: false, errors: [{ field: 'general', message: 'Erreur de validation' }] };
  }
};
