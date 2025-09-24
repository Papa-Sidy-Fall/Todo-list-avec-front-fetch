import type { Request, Response } from "express";
export declare class UserController {
    findAll(_req: Request, res: Response): Promise<void>;
    findById(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    create(req: Request<{}, {}, {
        nom: string;
        email: string;
        password: string;
    }>, res: Response): Promise<void>;
}
//# sourceMappingURL=userController.d.ts.map