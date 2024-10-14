import { Router } from "express";
import {
  getAllPresentations,
  createNewPresentation,
  deletePresentation,
  updatePresentationName
} from "../controllers/presentationController";
import { authenticateToken } from "../middleware/authMiddleware";
import multerConfig from "../utils/multer";
const router = Router();

router.get("/presentations",authenticateToken as any, getAllPresentations as any);
router.post(
  "/createNewPresentation",
  multerConfig.single("thumbnail"),authenticateToken as any,
  createNewPresentation as any
);
router.delete("/presentations/:id",authenticateToken as any, deletePresentation as any);
router.put("/presentations/:id", authenticateToken as any,updatePresentationName as any);

export default router;
