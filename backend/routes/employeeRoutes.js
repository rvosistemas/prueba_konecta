const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { createEmployee, getEmployees, deleteEmployee } = require('../controllers/employeeController');
const UserRole = require('../config/roles');
const router = express.Router();

router.post('/', authenticate, authorize(['admin']), createEmployee);
router.delete('/:id', authenticate, authorize(['admin']), deleteEmployee);

router.get('/', authenticate, authorize([UserRole.EMPLOYEE, UserRole.ADMIN]), getEmployees);

module.exports = router;
