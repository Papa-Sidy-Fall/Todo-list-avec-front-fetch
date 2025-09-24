import type { Request, Response } from "express";
export declare class AuthController {
    static login(req: Request<{}, {}, {
        email: string;
        password: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static register(req: Request<{}, {}, {
        nom: string;
        email: string;
        password: string;
        confirmPassword: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=AuthController.d.ts.map