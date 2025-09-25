/**
 * Service de planification des tâches - Gestion automatique des workflows
 *
 * Ce service gère les changements automatiques de statut des tâches :
 * - Passage de A_FAIRE à EN_COURS après 30 minutes
 * - Passage de EN_COURS à TERMINER après 30 minutes supplémentaires
 * - Envoi de notifications lors des changements
 */
import { prisma } from '../utils/prismclient.js';
import { createNotification } from './notificationService.js';
// Durées en millisecondes
const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes
const ONE_HOUR = 60 * 60 * 1000; // 1 heure
/**
 * Démarre le scheduler automatique des tâches
 */
export function startTaskScheduler() {
    // Vérifier toutes les 30 secondes
    setInterval(async () => {
        try {
            await processPendingTasks();
        }
        catch (error) {
            // Silently handle error
        }
    }, 30000); // 30 secondes
}
/**
 * Traite les tâches en attente de changement de statut
 */
async function processPendingTasks() {
    const now = new Date();
    // 1. Tâches A_FAIRE créées il y a plus de 30 minutes → EN_COURS
    const tasksToStart = await prisma.taches.findMany({
        where: {
            status: 'A_FAIRE',
            createdAt: {
                lt: new Date(now.getTime() - THIRTY_MINUTES)
            },
            startedAt: null // Pas encore démarrée
        },
        include: {
            user: true,
            assignedUser: true
        }
    });
    // Process tasks to start
    for (const task of tasksToStart) {
        await updateTaskStatus(task.id, 'EN_COURS', now);
        await createNotification({
            userId: task.userId,
            taskId: task.id,
            type: 'TASK_COMPLETED',
            message: `Votre tâche "${task.titre}" a automatiquement commencé (statut: En cours)`
        });
        // Notifier aussi l'utilisateur assigné s'il existe
        if (task.assignedTo && task.assignedTo !== task.userId) {
            await createNotification({
                userId: task.assignedTo,
                taskId: task.id,
                type: 'TASK_COMPLETED',
                message: `La tâche "${task.titre}" que vous êtes assigné a automatiquement commencé`
            });
        }
    }
    // 2. Tâches EN_COURS démarrées il y a plus de 30 minutes → TERMINER
    const tasksToComplete = await prisma.taches.findMany({
        where: {
            status: 'EN_COURS',
            startedAt: {
                lt: new Date(now.getTime() - THIRTY_MINUTES)
            },
            completedAt: null // Pas encore terminée
        },
        include: {
            user: true,
            assignedUser: true
        }
    });
    // Process tasks to complete
    for (const task of tasksToComplete) {
        await updateTaskStatus(task.id, 'TERMINER', null, now);
        await createNotification({
            userId: task.userId,
            taskId: task.id,
            type: 'TASK_COMPLETED',
            message: `🎉 Votre tâche "${task.titre}" a été automatiquement terminée !`
        });
        // Notifier aussi l'utilisateur assigné s'il existe
        if (task.assignedTo && task.assignedTo !== task.userId) {
            await createNotification({
                userId: task.assignedTo,
                taskId: task.id,
                type: 'TASK_COMPLETED',
                message: `🎉 La tâche "${task.titre}" que vous êtes assigné a été automatiquement terminée`
            });
        }
    }
}
/**
 * Met à jour le statut d'une tâche avec les timestamps appropriés
 */
async function updateTaskStatus(taskId, newStatus, startedAt, completedAt) {
    const updateData = {
        status: newStatus,
        updatedAt: new Date()
    };
    if (startedAt !== undefined) {
        updateData.startedAt = startedAt;
    }
    if (completedAt !== undefined) {
        updateData.completedAt = completedAt;
    }
    await prisma.taches.update({
        where: { id: taskId },
        data: updateData
    });
}
/**
 * Fonction utilitaire pour obtenir les statistiques des tâches en cours de traitement
 */
export async function getSchedulerStats() {
    const now = new Date();
    const [pendingTasks, inProgressTasks] = await Promise.all([
        // Tâches qui vont bientôt démarrer
        prisma.taches.count({
            where: {
                status: 'A_FAIRE',
                createdAt: {
                    lt: new Date(now.getTime() - THIRTY_MINUTES + (5 * 60 * 1000)), // Dans les 5 prochaines minutes
                    gte: new Date(now.getTime() - THIRTY_MINUTES)
                }
            }
        }),
        // Tâches qui vont bientôt se terminer
        prisma.taches.count({
            where: {
                status: 'EN_COURS',
                startedAt: {
                    lt: new Date(now.getTime() - THIRTY_MINUTES + (5 * 60 * 1000)), // Dans les 5 prochaines minutes
                    gte: new Date(now.getTime() - THIRTY_MINUTES)
                }
            }
        })
    ]);
    return {
        pendingTasks,
        inProgressTasks,
        totalScheduled: pendingTasks + inProgressTasks
    };
}
//# sourceMappingURL=taskScheduler.js.map