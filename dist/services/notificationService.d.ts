/**
 * Service de notifications - Gestion des notifications utilisateur
 *
 * Ce service gère la création et la gestion des notifications :
 * - Création de notifications pour les tâches
 * - Récupération des notifications par utilisateur
 * - Marquage comme lues
 */
export type NotificationType = 'TASK_COMPLETED' | 'TASK_MODIFIED' | 'TASK_DELETED' | 'TASK_ASSIGNED';
export interface CreateNotificationData {
    userId: number;
    taskId: number | null;
    type: NotificationType;
    message: string;
}
/**
 * Crée une nouvelle notification
 */
export declare function createNotification(data: CreateNotificationData): Promise<{
    id: number;
    type: import("@prisma/client").$Enums.NotificationType;
    message: string;
    userId: number;
    createdAt: Date;
    read: boolean;
    taskId: number | null;
}>;
/**
 * Récupère les notifications d'un utilisateur
 */
export declare function getUserNotifications(userId: number, limit?: number): Promise<({
    task: {
        id: number;
        status: import("@prisma/client").$Enums.Etat;
        titre: string;
    } | null;
} & {
    id: number;
    type: import("@prisma/client").$Enums.NotificationType;
    message: string;
    userId: number;
    createdAt: Date;
    read: boolean;
    taskId: number | null;
})[]>;
/**
 * Marque une notification comme lue
 */
export declare function markNotificationAsRead(notificationId: number, userId: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
/**
 * Marque toutes les notifications d'un utilisateur comme lues
 */
export declare function markAllNotificationsAsRead(userId: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
/**
 * Compte les notifications non lues d'un utilisateur
 */
export declare function getUnreadNotificationCount(userId: number): Promise<number>;
/**
 * Supprime une notification
 */
export declare function deleteNotification(notificationId: number, userId: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
/**
 * Crée une notification de modification de tâche
 */
export declare function createTaskModificationNotification(taskId: number, modifierName: string, action: 'modified' | 'deleted', taskOwnerId: number, assignedUserId?: number): Promise<void>;
//# sourceMappingURL=notificationService.d.ts.map