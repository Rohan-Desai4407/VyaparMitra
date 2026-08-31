import { Router } from 'express';
import { simulationController } from '../controllers/simulation.controller.js';

const router = Router();
router.post('/calculate', simulationController.calculate);
router.post('/ai-analysis', simulationController.analyzeWithAI);
export default router;
