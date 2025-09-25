/**
 * Service de planification des tâches - Gestion automatique des workflows
 *
 * Ce service gère les changements automatiques de statut des tâches :
 * - Passage de A_FAIRE à EN_COURS après 10 secondes
 * - Passage de EN_COURS à TERMINER après 30 secondes supplémentaires
 * - Envoi de notifications lors des changements
 */
/**
 * Démarre le scheduler automatique des tâches
 */
export declare function startTaskScheduler(): void;
/**
 * Fonction utilitaire pour obtenir les statistiques des tâches en cours de traitement
 */
export declare function getSchedulerStats(): Promise<{
    pendingTasks: number;
    inProgressTasks: number;
    totalScheduled: number;
}>;
//# sourceMappingURL=taskScheduler.d.ts.map