import { Router } from "express";
import { UserController } from "../controller/userController.js";
const router = Router();
const userController = new UserController();
router.get("/", userController.findAll);
router.post("/", userController.create);
router.get("/:id", userController.findById);
export default router;
//# sourceMappingURL=userRoute.js.map