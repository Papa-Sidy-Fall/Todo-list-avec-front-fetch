import type {Request,Response,NextFunction} from "express"
import { verifyAccessToken } from "../utils/jsonwebtoken.js";
 
import { TacheService } from "../service/tacheService.js";

const service = new TacheService()

export const authMiddleware = (req:Request, res:Response, next :NextFunction)=> {
    const autHedear = req.headers.authorization;
    if(!autHedear){
        return res.status(403).json({message:" token manquant !"})
    }
    const token = autHedear.split(" ")[1];

    try{
    const decode = verifyAccessToken(token!);
    (req as any).user = decode;
    return next();
    }
    catch(error){
      res.status(403).json({message : "Token invalide"})
    }
}
export const authorisationMiddleware = async (req:Request, res:Response, next: NextFunction) => {
  try {
      const id = Number(req.params.id)

      const tache = await service.findById(id)

      const userIdFromUser  = (req as any).user.userId

        if(tache!.userId !==  userIdFromUser && tache!.assignedTo !== userIdFromUser){

          return res.status(403).json({message:"access refuser"})

          }
          return next();

      }catch(error){

          return res.status(500).json({message: "Erreur serveur"})
  }

}
