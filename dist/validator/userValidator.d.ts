import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    nom: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const validateRegisterData: (data: unknown) => {
    success: boolean;
    data: {
        nom: string;
        email: string;
        password: string;
        confirmPassword: string;
    };
    errors?: never;
} | {
    success: boolean;
    errors: {
        field: string;
        message: string;
    }[];
    data?: never;
};
export declare const validateLoginData: (data: unknown) => {
    success: boolean;
    data: {
        email: string;
        password: string;
    };
    errors?: never;
} | {
    success: boolean;
    errors: {
        field: string;
        message: string;
    }[];
    data?: never;
};
//# sourceMappingURL=userValidator.d.ts.map