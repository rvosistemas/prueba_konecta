import express from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { createEmployee, getEmployees, getEmployee, updateEmployee, deactivateEmployee } from '../controllers/employeeController.js';
import UserRole from '../config/roles.js';

const router = express.Router();

router.get('/', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getEmployees);
router.get('/:id', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getEmployee);
router.post('/', authenticate, authorize(['admin']), createEmployee);
router.put('/:id', authenticate, authorize(['admin']), updateEmployee);
router.delete('/:id', authenticate, authorize(['admin']), deactivateEmployee);


export default router;
