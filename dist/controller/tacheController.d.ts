import type { Request, Response } from "express";
export declare class TacheController {
    findAll(req: Request<{}, {}, {}, {
        page?: string;
        limit?: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    findById(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    create(req: Request<{}, {}, {
        titre: string;
        description: string;
        status: string;
        assignedTo?: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request<{
        id: string;
    }, {}, any>, res: Response): Promise<void>;
    delete(req: Request<{
        id: string;
    }>, res: Response): Promise<void>;
    updateStatus(req: Request<{
        id: string;
        status: string;
    }>, res: Response): Promise<void>;
    getNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markNotificationRead(req: Request<{
        id: string;
    }>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markAllNotificationsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUnreadNotificationCount(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=tacheController.d.ts.map