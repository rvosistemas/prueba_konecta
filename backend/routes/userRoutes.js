import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
