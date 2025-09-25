/**
 * Service de notifications - Gestion des notifications utilisateur
 *
 * Ce service gère la création et la gestion des notifications :
 * - Création de notifications pour les tâches
 * - Récupération des notifications par utilisateur
 * - Marquage comme lues
 */
import { prisma } from '../utils/prismclient.js';
/**
 * Crée une nouvelle notification
 */
export async function createNotification(data) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                taskId: data.taskId,
                type: data.type,
                message: data.message,
                read: false
            }
        });
        return notification;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Récupère les notifications d'un utilisateur
 */
export async function getUserNotifications(userId, limit = 50) {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                task: {
                    select: {
                        id: true,
                        titre: true,
                        status: true
                    }
                }
            }
        });
        return notifications;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Marque une notification comme lue
 */
export async function markNotificationAsRead(notificationId, userId) {
    try {
        const notification = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId: userId // Sécurité: vérifier que la notification appartient à l'utilisateur
            },
            data: { read: true }
        });
        if (notification.count === 0) {
            throw new Error('Notification non trouvée ou accès non autorisé');
        }
        return notification;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Marque toutes les notifications d'un utilisateur comme lues
 */
export async function markAllNotificationsAsRead(userId) {
    try {
        const result = await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
        return result;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Compte les notifications non lues d'un utilisateur
 */
export async function getUnreadNotificationCount(userId) {
    try {
        const count = await prisma.notification.count({
            where: {
                userId,
                read: false
            }
        });
        return count;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Supprime une notification
 */
export async function deleteNotification(notificationId, userId) {
    try {
        const result = await prisma.notification.deleteMany({
            where: {
                id: notificationId,
                userId: userId // Sécurité: vérifier que la notification appartient à l'utilisateur
            }
        });
        if (result.count === 0) {
            throw new Error('Notification non trouvée ou accès non autorisé');
        }
        return result;
    }
    catch (error) {
        throw error;
    }
}
/**
 * Crée une notification de modification de tâche
 */
export async function createTaskModificationNotification(taskId, modifierName, action, taskOwnerId, assignedUserId) {
    const actionText = action === 'modified' ? 'modifiée' : 'supprimée';
    const message = `La tâche a été ${actionText} par ${modifierName}`;
    // Notifier le propriétaire de la tâche
    await createNotification({
        userId: taskOwnerId,
        taskId,
        type: action === 'modified' ? 'TASK_MODIFIED' : 'TASK_DELETED',
        message
    });
    // Notifier l'utilisateur assigné s'il existe et n'est pas le propriétaire
    if (assignedUserId && assignedUserId !== taskOwnerId) {
        await createNotification({
            userId: assignedUserId,
            taskId,
            type: action === 'modified' ? 'TASK_MODIFIED' : 'TASK_DELETED',
            message: `La tâche qui vous est assignée a été ${actionText} par ${modifierName}`
        });
    }
}
//# sourceMappingURL=notificationService.js.map