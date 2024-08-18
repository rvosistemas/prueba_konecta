import request from 'supertest';
import express from 'express';
import requestRoutes from '../../routes/requestRoutes.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deactivateRequest,
} from '../../controllers/requestController.js';
import UserRole from '../../config/roles.js';

jest.mock('../../controllers/requestController.js');
jest.mock('../../middlewares/authMiddleware.js', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  authorize: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/requests', requestRoutes);

describe('Request Routes', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
    authorize.mockImplementation(() => (req, res, next) => next());
  });

  describe('GET /requests', () => {
    it('should call authenticate, authorize, and getRequests controller', async () => {
      getRequests.mockImplementation((req, res) => res.status(200).json({ requests: [] }));

      const response = await request(app)
        .get('/requests')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.EMPLOYEE, UserRole.ADMIN]);
      expect(getRequests).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.requests).toEqual([]);
    });
  });

  describe('GET /requests/:id', () => {
    it('should call authenticate, authorize, and getRequest controller', async () => {
      getRequest.mockImplementation((req, res) => res.status(200).json({ request: 'testRequest' }));

      const response = await request(app)
        .get('/requests/1')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.EMPLOYEE, UserRole.ADMIN]);
      expect(getRequest).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.request).toBe('testRequest');
    });
  });

  describe('POST /requests', () => {
    it('should call authenticate, authorize, and createRequest controller', async () => {
      createRequest.mockImplementation((req, res) => res.status(201).json({ message: 'Request created' }));

      const response = await request(app)
        .post('/requests')
        .set('Authorization', 'Bearer mockToken')
        .send({ title: 'New Request', description: 'Request description', status: 'Pending' });

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(createRequest).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Request created');
    });
  });

  describe('PUT /requests/:id', () => {
    it('should call authenticate, authorize, and updateRequest controller', async () => {
      updateRequest.mockImplementation((req, res) => res.status(200).json({ message: 'Request updated' }));

      const response = await request(app)
        .put('/requests/1')
        .set('Authorization', 'Bearer mockToken')
        .send({ title: 'Updated Request', description: 'Updated description', status: 'Approved' });

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(updateRequest).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Request updated');
    });
  });

  describe('DELETE /requests/:id', () => {
    it('should call authenticate, authorize, and deactivateRequest controller', async () => {
      deactivateRequest.mockImplementation((req, res) => res.status(200).json({ message: 'Request deactivated' }));

      const response = await request(app)
        .delete('/requests/1')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.ADMIN]);
      expect(deactivateRequest).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Request deactivated');
    });
  });
});
