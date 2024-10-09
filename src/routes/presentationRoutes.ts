import { Router } from 'express';
import { getAllPresentations } from '../controllers/presentationController';

const router = Router();

router.get('/presentations', getAllPresentations);

export default router;