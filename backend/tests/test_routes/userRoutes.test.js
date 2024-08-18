import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/userRoutes.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import {
  getUsers,
  getUser,
  updateUser,
  deactivateUser,
} from '../../controllers/userController.js';
import UserRole from '../../config/roles.js';

jest.mock('../../controllers/userController.js');
jest.mock('../../middlewares/authMiddleware.js', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  authorize: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
    authorize.mockImplementation(() => (req, res, next) => next());
  });

  describe('GET /users', () => {
    it('should call authenticate, authorize, and getUsers controller', async () => {
      getUsers.mockImplementation((req, res) => res.status(200).json({ users: [] }));

      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(getUsers).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.users).toEqual([]);
    });
  });

  describe('GET /users/:id', () => {
    it('should call authenticate, authorize, and getUser controller', async () => {
      getUser.mockImplementation((req, res) => res.status(200).json({ user: 'testUser' }));

      const response = await request(app)
        .get('/users/1')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(getUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.user).toBe('testUser');
    });
  });

  describe('PUT /users/:id', () => {
    it('should call authenticate, authorize, and updateUser controller', async () => {
      updateUser.mockImplementation((req, res) => res.status(200).json({ message: 'User updated' }));

      const response = await request(app)
        .put('/users/1')
        .set('Authorization', 'Bearer mockToken')
        .send({ name: 'Updated User', email: 'updated@example.com' });

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(updateUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should call authenticate, authorize, and deactivateUser controller', async () => {
      deactivateUser.mockImplementation((req, res) => res.status(200).json({ message: 'User deactivated' }));

      const response = await request(app)
        .delete('/users/1')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(deactivateUser).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deactivated');
    });
  });
});
