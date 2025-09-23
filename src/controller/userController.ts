import  type{Request,Response} from "express"
import { UserService } from "../service/userService.js"
import bcrypt from "bcrypt"


const service = new UserService()
export class UserController {
     async findAll(req:Request, res:Response) {
        try{
        const data = await service.findAll()
        res.status(200).json(data) 
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
        try {
            const data = req.body
            const salt = await bcrypt.genSalt(10)
            const hashpassword =  await bcrypt.hash(data.password, salt)
           
            const newdata = {
                ...data,
                password:hashpassword
            }
            const user = await service.create(newdata)
            res.status(201).json({user, message:"saway user bi creer nagn ko"})
            
        } catch (error:any) {
            res.status(500).json({message: error.message})   
        }

    }

   
   
  

}


