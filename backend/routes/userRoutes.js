import express from 'express';
import { getUsers, getUser, updateUser, deactivateUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import UserRole from '../config/roles.js';

const router = express.Router();

router.get('/', authenticate, authorize([UserRole.ADMIN]), getUsers);
router.get('/:id', authenticate, authorize([UserRole.ADMIN]), getUser);
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), updateUser);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deactivateUser);

export default router;
