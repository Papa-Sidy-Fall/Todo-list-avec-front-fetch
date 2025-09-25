import {Router} from "express"
import {TacheController} from "../controller/tacheController.js"
import { authMiddleware, authorisationMiddleware } from "../middleware/Auth.js";
import { upload } from "../middleware/uploadImage.js";


const router = Router();
const tacheController = new TacheController()

router.get("/", tacheController.findAll)
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), authMiddleware, tacheController.create)
router.get("/:id", tacheController.findById)
router.put("/:id", authMiddleware, authorisationMiddleware, tacheController.update)
router.delete("/:id", authMiddleware, authorisationMiddleware, tacheController.delete)
router.patch("/:id/:status", authMiddleware, authorisationMiddleware, tacheController.updateStatus)

// Routes des notifications
router.get("/notifications", authMiddleware, tacheController.getNotifications)
router.patch("/notifications/:id/read", authMiddleware, tacheController.markNotificationRead)
router.patch("/notifications/mark-all-read", authMiddleware, tacheController.markAllNotificationsRead)
router.get("/notifications/unread-count", authMiddleware, tacheController.getUnreadNotificationCount)



export default router;
