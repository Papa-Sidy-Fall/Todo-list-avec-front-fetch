import { Router } from "express";
import { TacheController } from "../controller/tacheController.js";
import { authMiddleware, authorisationMiddleware } from "../middleware/Auth.js";
import { upload } from "../middleware/uploadImage.js";
const router = Router();
const tacheController = new TacheController();
router.get("/", tacheController.findAll);
router.post("/", upload.single('image'), authMiddleware, tacheController.create);
router.get("/:id", tacheController.findById);
router.put("/:id", authMiddleware, authorisationMiddleware, tacheController.update);
router.delete("/:id", authMiddleware, authorisationMiddleware, tacheController.delete);
router.patch("/:id/:status", authMiddleware, authorisationMiddleware, tacheController.updateStatus);
export default router;
//# sourceMappingURL=tacheRoute.js.map