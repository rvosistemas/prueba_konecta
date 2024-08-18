import express from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { createEmployee, getEmployees, deleteEmployee } from '../controllers/employeeController.js';
import UserRole from '../config/roles.js';
const router = express.Router();
router.post('/', authenticate, authorize(['admin']), createEmployee);
router.delete('/:id', authenticate, authorize(['admin']), deleteEmployee);

router.get('/', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getEmployees);

export default router;
