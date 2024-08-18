import { getUsers, getUser, updateUser, deactivateUser, deleteUser } from '../../controllers/userController';
import { AppDataSource } from '../../config/database.js';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('User Controller', () => {
  let req, res, userRepository;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(userRepository);
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

      userRepository.find.mockResolvedValue(usersMock);

      await getUsers(req, res);

      expect(userRepository.find).toHaveBeenCalledWith(expect.objectContaining({ where: { isActive: true } }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: usersMock });
    });

    it('should handle errors and return 400 status code', async () => {
      const errorMessage = 'Database error';
      userRepository.find.mockRejectedValue(new Error(errorMessage));

      await getUsers(req, res);

      expect(userRepository.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: errorMessage }));
    });
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      req.params.id = 1;
      const userMock = { id: 1, username: 'testuser1' };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await getUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: userMock });
    });

    it('should return 404 if user is not found', async () => {
      req.params.id = 1;
      userRepository.findOneBy.mockResolvedValue(null);

      await getUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      req.params.id = 1;
      userRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await getUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully with valid role', async () => {
      req.params.id = 1;
      req.body = { username: 'newuser', email: 'newuser@test.com', password: 'newpass', role: 'admin' };

      const userMock = { id: 1, username: 'olduser', email: 'olduser@test.com', password: 'oldpass', role: 'employee' };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await updateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userMock,
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'hashedPassword',
        role: 'admin'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User updated successfully',
      }));
    });

    it('should return 404 if user to update is not found', async () => {
      req.params.id = 1;
      userRepository.findOneBy.mockResolvedValue(null);

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should update a user successfully without changing the password', async () => {
      req.params.id = 1;
      req.body = { username: 'newuser', email: 'newuser@test.com', role: 'admin' };

      const userMock = { id: 1, username: 'olduser', email: 'olduser@test.com', password: 'oldpass', role: 'employee' };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await updateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userMock,
        username: 'newuser',
        email: 'newuser@test.com',
        password: 'oldpass',
        role: 'admin'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User updated successfully',
      }));
    });

    it('should return 400 if role is invalid', async () => {
      req.params.id = 1;
      req.body = { username: 'newuser', email: 'newuser@test.com', password: 'newpass', role: 'invalidRole' };

      const userMock = { id: 1, username: 'olduser', email: 'olduser@test.com', password: 'oldpass', role: 'employee' };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await updateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid role' }));
    });

    it('should handle errors and return 400 status code', async () => {
      req.params.id = 1;
      userRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate a user successfully', async () => {
      req.params.userId = 1;

      const userMock = { id: 1, isActive: true };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await deactivateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(userMock.isActive).toBe(false);
      expect(userRepository.save).toHaveBeenCalledWith(userMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deactivated successfully' });
    });

    it('should return 404 if user not found', async () => {
      req.params.userId = 1;

      userRepository.findOneBy.mockResolvedValue(null);

      await deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      userRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await deactivateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      req.params.id = 1;

      const userMock = { id: 1 };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await deleteUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(userRepository.remove).toHaveBeenCalledWith(userMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 1;

      userRepository.findOneBy.mockResolvedValue(null);

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      userRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });
});
