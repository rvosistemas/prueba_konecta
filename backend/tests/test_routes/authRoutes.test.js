import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/authRoutes.js';
import { register, login, getUserProfile } from '../../controllers/authController.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

jest.mock('../../controllers/authController.js');
jest.mock('../../middlewares/authMiddleware.js');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should call register controller', async () => {
      register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered' }));

      const response = await request(app)
        .post('/auth/register')
        .send({ username: 'testuser', password: 'testpass' });

      expect(register).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered');
    });
  });

  describe('POST /auth/login', () => {
    it('should call login controller', async () => {
      login.mockImplementation((req, res) => res.status(200).json({ token: 'mockToken' }));

      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'testpass' });

      expect(login).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.token).toBe('mockToken');
    });
  });

  describe('GET /auth/me', () => {
    it('should call authenticate middleware and getUserProfile controller', async () => {
      authenticate.mockImplementation((req, res, next) => next());
      getUserProfile.mockImplementation((req, res) => res.status(200).json({ user: 'testuser' }));

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(getUserProfile).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.user).toBe('testuser');
    });
  });
});
