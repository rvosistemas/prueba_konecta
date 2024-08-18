import { getUsers, deactivateUser, deleteUser } from '../../controllers/userController';
import User from '../../models/User.js';

jest.mock('../../models/User.js', () => {
  return {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };
});

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return a list of active users', async () => {
      const usersMock = [
        { id: 1, username: 'testuser1', isActive: true },
        { id: 2, username: 'testuser2', isActive: true },
      ];

      User.findAll.mockResolvedValue(usersMock);

      const result = await User.findAll({ where: { isActive: true } });

      await getUsers(req, res);

      expect(User.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { isActive: true } }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: usersMock });
    });

    it('should handle errors and return 400 status code', async () => {
      const errorMessage = 'Database error';
      User.findAll.mockRejectedValue(new Error(errorMessage));

      await getUsers(req, res);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: errorMessage }));
    });

  });

  describe('deactivateUser', () => {
    it('should deactivate a user successfully', async () => {
      req.params.userId = 1;

      const userMock = { id: 1, isActive: true, save: jest.fn() };
      User.findByPk.mockResolvedValue(userMock);

      await deactivateUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(userMock.isActive).toBe(false);
      expect(userMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deactivated successfully' });
    });

    it('should return 404 if user not found', async () => {
      req.params.userId = 1;

      User.findByPk.mockResolvedValue(null);

      await deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      req.params.id = 1;

      const userMock = { id: 1, destroy: jest.fn() };
      User.findByPk.mockResolvedValue(userMock);

      await deleteUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(userMock.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 1;

      User.findByPk.mockResolvedValue(null);

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });
});
