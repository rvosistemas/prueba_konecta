import express from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { createEmployee, getEmployees, getEmployee, updateEmployee, deactivateEmployee } from '../controllers/employeeController.js';
import UserRole from '../config/roles.js';

const router = express.Router();

router.get('/', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getEmployees);
router.get('/:id', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getEmployee);
router.post('/', authenticate, authorize([UserRole.ADMIN]), createEmployee);
router.put('/:id', authenticate, authorize([UserRole.ADMIN]), updateEmployee);
router.delete('/:id', authenticate, authorize([UserRole.ADMIN]), deactivateEmployee);


export default router;
