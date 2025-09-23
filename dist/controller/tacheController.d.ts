import type { Request, Response } from "express";
export declare class TacheController {
    findAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    findById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=tacheController.d.ts.map