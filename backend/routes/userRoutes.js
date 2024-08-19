import express from 'express';
import { getUsers, getUser, createUser, updateUser, deactivateUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import UserRole from '../config/roles.js';

const router = express.Router();

router.get('/', authenticate, authorize([UserRole.ADMIN]), getUsers);
router.get('/:id', authenticate, authorize([UserRole.ADMIN]), getUser);
router.post('/', authenticate, authorize([UserRole.ADMIN]), createUser);
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), updateUser);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deactivateUser);

export default router;
