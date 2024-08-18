import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import { AppDataSource } from '../../config/database.js';

jest.mock('jsonwebtoken');
jest.mock('../../config/database.js', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
    }),
  },
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn().mockReturnValue('Bearer mockToken'),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate and set req.user if user is found', async () => {
      const decoded = { id: 1 };
      const userMock = { id: 1, username: 'testuser', role: 'admin' };

      jwt.verify.mockImplementation(() => decoded);
      AppDataSource.getRepository().findOne.mockResolvedValue(userMock);

      await authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('mockToken', process.env.JWT_SECRET);
      expect(AppDataSource.getRepository().findOne).toHaveBeenCalledWith({ where: { id: decoded.id } });
      expect(req.user).toEqual(userMock);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if user is not found', async () => {
      const decoded = { id: 1 };
      jwt.verify.mockImplementation(() => decoded);
      AppDataSource.getRepository().findOne.mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('mockToken', process.env.JWT_SECRET);
      expect(AppDataSource.getRepository().findOne).toHaveBeenCalledWith({ where: { id: decoded.id } });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Please authenticate' }));
      expect(next).not.toHaveBeenCalled();
    });

  });

  describe('authorize', () => {
    it('should allow access if user has a valid role', () => {
      req.user = { role: 'admin' };

      const middleware = authorize(['admin', 'user']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user does not have a valid role', () => {
      req.user = { role: 'guest' };

      const middleware = authorize(['admin', 'user']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Access denied' }));
      expect(next).not.toHaveBeenCalled();
    });

  });
});
