const express = require('express');
const { getUsers, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
