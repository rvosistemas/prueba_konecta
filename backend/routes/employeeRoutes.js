const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const { createEmployee, getEmployees, deleteEmployee } = require('../controllers/employeeController');
const router = express.Router();

router.post('/', authenticate, authorize(['admin']), createEmployee);
router.delete('/:id', authenticate, authorize(['admin']), deleteEmployee);

router.get('/', authenticate, authorize(['employee', 'admin']), getEmployees);

module.exports = router;
