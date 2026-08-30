import { Router } from 'express';
import { getTemplates, getProjectExpenses, saveProjectExpenses, getRegionalPricing } from '../controllers/projectExpenseController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/templates', getTemplates);
router.get('/pricing', getRegionalPricing);
router.get('/:assessmentId', authenticateJwt, getProjectExpenses);
router.post('/:assessmentId/save', authenticateJwt, saveProjectExpenses);

export default router;
