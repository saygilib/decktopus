import { Router } from 'express';
import { getAllPresentations } from '../controllers/presentationController';
import { authenticateToken } from '../middleware/authMiddleware';
const router = Router();

router.get('/presentations',authenticateToken as any,getAllPresentations);

export default router;