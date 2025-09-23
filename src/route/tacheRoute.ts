import {Router} from "express"
import {TacheController} from "../controller/tacheController.js"
import { authorisationMiddleware } from "../middleware/Auth.js";


const router = Router();
const tacheController = new TacheController()

router.get("/", tacheController.findAll)
router.post("/", tacheController.create)
router.get("/:id", tacheController.findById)
router.put("/:id", authorisationMiddleware,tacheController.update)
router.delete("/:id", authorisationMiddleware,tacheController.delete)
router.patch("/:id/:status", authorisationMiddleware,tacheController.updateStatus)



export default router;
