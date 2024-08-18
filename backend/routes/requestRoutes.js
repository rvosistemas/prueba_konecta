import express from 'express';
import { getRequests, getRequest, createRequest, updateRequest, deactivateRequest } from '../controllers/requestController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import UserRole from '../config/roles.js';

const router = express.Router();

router.get('/', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getRequests);
router.get('/:id', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getRequest);
router.post('/', authenticate, authorize([UserRole.ADMIN]), createRequest);
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), updateRequest);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deactivateRequest);

export default router;
