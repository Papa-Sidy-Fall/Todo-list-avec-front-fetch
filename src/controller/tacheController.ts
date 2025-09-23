import  type{Request,Response} from "express"
import { TacheService } from "../service/tacheService.js"
import type {Etat} from "@prisma/client"
import {tacheValidator} from "../validator/tacheValidator.js"

const service = new TacheService()
export class TacheController {
     async findAll(req:Request, res:Response) {
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
    async findById(req:Request, res:Response){
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
    async create(req:Request, res:Response){
        try{
            const data = tacheValidator.parse(req.body)
            const  userId = (req as any).user.userId
            //cela nous permet de ne pas mettre userid au niveau de postaman quand on creer une tache
            const newdata = {
             ...data,
             userId : userId,
             assignedTo: data.assignedTo || null
            }
            const tache = await service.create(newdata)
            res.status(201).json(tache)
        }
        catch(error)
        {
            if ((error as any).issues) {
                res.status(400).json({message:"Erreurs de validation", errors: (error as any).issues.map((i: any) => ({field: i.path.join('.'), message: i.message}))})
            } else {
                res.status(500).json({message:"fall donner yi douguoul"})
            }
        }

    }
    async update(req:Request, res:Response){

        try{
            const id = Number(req.params.id)
            const data = tacheValidator.partial().parse(req.body)
            const updatedData = await service.update(id, data)
            res.status(200).json({success: true, task: updatedData})
        }catch(error){
            if ((error as any).issues) {
                res.status(400).json({message:"Erreurs de validation", errors: (error as any).issues.map((i: any) => ({field: i.path.join('.'), message: i.message}))})
            } else {
                res.status(500).json({message:"fall nagouwoul mise a jour bi"})
            }
        }
    }
   
    async delete(req:Request, res:Response){
        try {
            const id = Number(req.params.id)
            await service.delete(id)
            res.status(204).send("supprimer nako")
        } catch (error) {
            res.status(500).json({message:"fall nagouwoul supprimé"})
        }

    }
    async updateStatus(req:Request, res:Response){
        try {
            const id = Number(req.params.id);
            const status = req.params.status as Etat; //on le force pour qu'il soit de type etat
            const data= await service.updateStatus(id,status)
            res.status(201).json({data, message: "le status est modifier"})
            
        } catch (error) {
            res.status(400).json({message:"Erreur serveur"})
        }

    }

}


