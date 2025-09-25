import type { Request, Response } from "express"
import { TacheService } from "../service/tacheService.js"
import type {Etat} from "@prisma/client"
import {tacheValidator} from "../validator/tacheValidator.js"
import { upload } from "../middleware/uploadImage.js"
import type { ZodValidationError, ValidationError } from "../types/tache.js"
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  createNotification
} from "../services/notificationService.js"

const service = new TacheService()
export class TacheController {
     async findAll(req: Request<{}, {}, {}, { page?: string; limit?: string }>, res: Response) {
        try{
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Validation des paramètres
            if (page < 1) {
                return res.status(400).json({message: "Le numéro de page doit être supérieur à 0"});
            }
            if (limit < 1 || limit > 100) {
                return res.status(400).json({message: "La limite doit être entre 1 et 100"});
            }

            const data = await service.findAllPaginated(page, limit);
            res.status(200).json(data);
        }
        catch(error){
           res.status(500).json({message:"Fall donner niewoul"});
        }
    }
    async findById(req: Request<{ id: string }>, res: Response) {
        try{
            const id = Number(req.params.id)
            const data = await service.findById(id)
            res.status(200).json(data)
        }
        catch(error)
        {
            res.status(500).json({message:"fall guissoul id utilisateur bi"})
        }
    }
    async create(req: Request<{}, {}, { titre: string; description: string; status: string; assignedTo?: string }>, res: Response) {
        try{
            // Vérifier que les champs requis sont présents
            if (!req.body.titre || !req.body.description || !req.body.status) {
                return res.status(400).json({message: "Champs requis manquants"});
            }

            // Convertir les données du formulaire
            const formData = {
                titre: req.body.titre,
                description: req.body.description,
                status: req.body.status,
                assignedTo: req.body.assignedTo && req.body.assignedTo !== '' && req.body.assignedTo !== 'null' ? parseInt(req.body.assignedTo) : null
            };

            // Validation avec Zod
            const data = tacheValidator.parse(formData);

            const userId = (req as { user?: { userId: number } }).user?.userId;
            if (!userId) {
                return res.status(401).json({message: "Utilisateur non authentifié"});
            }

            // Gérer l'upload d'image
            let imageUrl = null;
            const imageFiles = (req as any).files?.image;
            if (imageFiles && imageFiles.length > 0) {
                imageUrl = `/uploads/${imageFiles[0].filename}`;
            }

            // Gérer l'upload d'audio
            let audioUrl = null;
            const audioFiles = (req as any).files?.audio;
            if (audioFiles && audioFiles.length > 0) {
                audioUrl = `/uploads/${audioFiles[0].filename}`;
            }

            // Préparer les données finales
            const newdata = {
             ...data,
             userId : userId,
             assignedTo: data.assignedTo || null,
             imageUrl: imageUrl,
             audioUrl: audioUrl,
             createdAt: new Date(),
             updatedAt: new Date(),
             startedAt: null,
             completedAt: null
            };

            // Créer la tâche
            const tache = await service.create(newdata);

            res.status(201).json(tache);
        }
        catch(error)
        {
            if ((error as ZodValidationError).issues) {
                res.status(400).json({message:"Erreurs de validation", errors: (error as ZodValidationError).issues.map((i) => ({field: i.path.join('.'), message: i.message}))});
            } else {
                res.status(500).json({message:"Erreur lors de la création de la tâche", error: (error as Error).message});
            }
        }

    }
    async update(req: Request<{ id: string }, {}, any>, res: Response) {

        try{
            const id = Number(req.params.id)
            const data = tacheValidator.partial().parse(req.body)
            const updatedData = await service.update(id, data)
            res.status(200).json({success: true, task: updatedData})
        }catch(error){
            if ((error as ZodValidationError).issues) {
                res.status(400).json({message:"Erreurs de validation", errors: (error as ZodValidationError).issues.map((i) => ({field: i.path.join('.'), message: i.message}))})
            } else {
                res.status(500).json({message:"fall nagouwoul mise a jour bi"})
            }
        }
    }
   
    async delete(req: Request<{ id: string }>, res: Response) {
        try {
            const id = Number(req.params.id)
            await service.delete(id)
            res.status(204).send("supprimer nako")
        } catch (error) {
            res.status(500).json({message:"fall nagouwoul supprimé"})
        }

    }
    async updateStatus(req: Request<{ id: string; status: string }>, res: Response) {
        try {
            const id = Number(req.params.id);
            const status = req.params.status as Etat; //on le force pour qu'il soit de type etat

            // Récupérer les informations de la tâche avant la mise à jour pour les notifications
            const taskBeforeUpdate = await service.findById(id);
            const userId = (req as { user?: { userId: number; nom: string } }).user?.userId;
            const userName = (req as { user?: { userId: number; nom: string } }).user?.nom;

            const data = await service.updateStatus(id, status);

            // Créer une notification si la tâche est marquée comme terminée par l'utilisateur
            if (status === 'TERMINER' && taskBeforeUpdate && userId) {
                await createNotification({
                    userId: userId,
                    taskId: id,
                    type: 'TASK_COMPLETED',
                    message: `🎉 Vous avez marqué votre tâche "${taskBeforeUpdate.titre}" comme terminée !`
                });
            }

            res.status(201).json({data, message: "le status est modifier"})

        } catch (error) {
            res.status(400).json({message:"Erreur serveur"})
        }

    }

    // Méthodes de notifications
    async getNotifications(req: Request, res: Response) {
        try {
            const userId = (req as { user?: { userId: number } }).user?.userId;
            if (!userId) {
                return res.status(401).json({message: "Utilisateur non authentifié"});
            }

            const limit = parseInt(req.query.limit as string) || 50;
            const notifications = await getUserNotifications(userId, limit);

            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({message: "Erreur lors de la récupération des notifications"});
        }
    }

    async markNotificationRead(req: Request<{ id: string }>, res: Response) {
        try {
            const userId = (req as { user?: { userId: number } }).user?.userId;
            if (!userId) {
                return res.status(401).json({message: "Utilisateur non authentifié"});
            }

            const notificationId = parseInt(req.params.id);
            await markNotificationAsRead(notificationId, userId);

            res.status(200).json({message: "Notification marquée comme lue"});
        } catch (error) {
            res.status(500).json({message: "Erreur lors du marquage de la notification"});
        }
    }

    async markAllNotificationsRead(req: Request, res: Response) {
        try {
            const userId = (req as { user?: { userId: number } }).user?.userId;
            if (!userId) {
                return res.status(401).json({message: "Utilisateur non authentifié"});
            }

            await markAllNotificationsAsRead(userId);
            res.status(200).json({message: "Toutes les notifications ont été marquées comme lues"});
        } catch (error) {
            res.status(500).json({message: "Erreur lors du marquage des notifications"});
        }
    }

    async getUnreadNotificationCount(req: Request, res: Response) {
        try {
            const userId = (req as { user?: { userId: number } }).user?.userId;
            if (!userId) {
                return res.status(401).json({message: "Utilisateur non authentifié"});
            }

            const count = await getUnreadNotificationCount(userId);
            res.status(200).json({count});
        } catch (error) {
            res.status(500).json({message: "Erreur lors du comptage des notifications"});
        }
    }

}


