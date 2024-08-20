import { getUsers, getAvailableUsers, createUser, getUser, updateUser, deactivateUser, deleteUser } from '../../controllers/userController';
import { AppDataSource } from '../../config/database.js';
import { Employee } from '../../models/employee.js';
import UserRole from '../../config/roles.js';
import bcrypt from 'bcryptjs';

jest.mock('../../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));


jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('User Controller', () => {
  let req, res, userRepository, queryBuilderMock;

  beforeEach(() => {
    req = { query: { page: 1, limit: 10 } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[{ id: 1, username: 'testuser', isActive: true }], 1]),
      create: jest.fn().mockReturnThis(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(() => queryBuilderMock)
    };

    queryBuilderMock = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn()
    };

    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(userRepository);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return a list of active users', async () => {
      const usersMock = [
        { id: 1, username: 'testuser1', isActive: true },
        { id: 2, username: 'testuser2', isActive: true }
      ];
      const count = usersMock.length;
      userRepository.findAndCount.mockResolvedValue([usersMock, count]);

      await getUsers(req, res);

      expect(userRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
        where: { isActive: true }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: usersMock, count });
    });

    it('should handle errors and return 400 status code', async () => {
      const errorMessage = 'Database error';
      userRepository.findAndCount.mockRejectedValue(new Error(errorMessage));

      await getUsers(req, res);

      expect(userRepository.findAndCount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle a database error', async () => {
      userRepository.findAndCount.mockRejectedValue(new Error('Database error'));
      await getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('createUser', () => {
    it('should create a user successfully when no duplicate exists', async () => {
      const userRepositoryMock = {
        findOne: jest.fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null),
        create: jest.fn().mockReturnValue({ id: 1 }),
        save: jest.fn().mockResolvedValue({ id: 1 }),
      };

      AppDataSource.getRepository.mockReturnValue(userRepositoryMock);

      req.body = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE
      };

      await createUser(req, res);

      expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(1, { where: { username: 'newuser' } });
      expect(userRepositoryMock.findOne).toHaveBeenNthCalledWith(2, { where: { email: 'newuser@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'hashedPassword',
        role: UserRole.EMPLOYEE,
      });
      expect(userRepositoryMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: { id: 1 }
      });
    });

    it('should return 400 if the username already exists', async () => {
      userRepository.findOne.mockResolvedValueOnce({ id: 1, username: 'newuser' });

      req.body = { username: 'newuser', email: 'newuser@example.com', password: 'password123', role: UserRole.EMPLOYEE };

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
    });

    it('should return 400 if the email already exists', async () => {
      userRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1, email: 'newuser@example.com' });

      req.body = { username: 'newuser', email: 'newuser@example.com', password: 'password123', role: UserRole.EMPLOYEE };

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should handle errors and return 400 status code', async () => {
      userRepository.findOne.mockRejectedValue(new Error('Database error'));

      req.body = { username: 'newuser', email: 'newuser@example.com', password: 'password123', role: UserRole.EMPLOYEE };

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should default role to EMPLOYEE if not provided', async () => {
      userRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      req.body = { username: 'newuser', email: 'newuser@example.com', password: 'password123' };

      await createUser(req, res);

      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'hashedPassword',
        role: UserRole.EMPLOYEE,
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

  });

  describe('getUser', () => {
    beforeEach(() => {
      req = {
        params: { id: 1 },
        body: {},
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      userRepository = {
        findOneBy: jest.fn(),
        findAndCount: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      };
      jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(userRepository);
    });

    it('should return a user if found', async () => {
      const userMock = { id: 1, username: 'testuser1' };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await getUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: userMock });
    });

    it('should return 404 if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await getUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      userRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await getUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });


  describe('getAvailableUsers', () => {
    it('should fetch available users with correct query parameters', async () => {
      queryBuilderMock.getManyAndCount.mockResolvedValue([[{ id: 1, username: 'availableUser' }], 1]);

      await getAvailableUsers(req, res);

      expect(userRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith(Employee, 'employee', 'employee.user_id = user.id');
      expect(queryBuilderMock.where).toHaveBeenCalledWith(
        'employee.id IS NULL AND user.isActive = true AND user.role = :role',
        { role: UserRole.EMPLOYEE }
      );
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.orderBy).toHaveBeenCalledWith('user.createdAt', 'DESC');
      expect(queryBuilderMock.getManyAndCount).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        users: [{ id: 1, username: 'availableUser' }],
        count: 1
      });
    });

    it('should handle errors properly', async () => {
      queryBuilderMock.getManyAndCount.mockRejectedValue(new Error('Database error'));

      await getAvailableUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });


  describe('updateUser', () => {
    beforeEach(() => {
      req = {
        params: {},
        body: {}
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      userRepository = {
        findOneBy: jest.fn(),
        save: jest.fn()
      };
      jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(userRepository);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
    });

    it('should update a user successfully with valid role', async () => {
      req.params.id = 1;
      req.body = { username: 'newuser', email: 'newuser@test.com', password: 'newpass', role: 'admin' };

      const userMock = { id: 1, username: 'olduser', email: 'olduser@test.com', password: 'oldpass', role: 'employee', isActive: true };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await updateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1, isActive: true });
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

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1, isActive: true });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should return 400 if role is invalid', async () => {
      req.params.id = 1;
      req.body = { username: 'newuser', email: 'newuser@test.com', password: 'newpass', role: 'invalidRole' };

      const userMock = { id: 1, username: 'olduser', email: 'olduser@test.com', password: 'oldpass', role: 'employee', isActive: true };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await updateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1, isActive: true });
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

    it('should handle errors and return 400 status code', async () => {
      userRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });

  });


  describe('deactivateUser', () => {
    let req;

    beforeEach(() => {
      req = { params: { userId: 1 } };
    });

    it('should deactivate a user successfully', async () => {
      const userMock = { id: 1, isActive: true };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await deactivateUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1, isActive: true });
      expect(userMock.isActive).toBeFalsy();
      expect(userRepository.save).toHaveBeenCalledWith(userMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deactivated successfully' });
    });

    it('should return 404 if user not found', async () => {
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
    beforeEach(() => {
      req = {
        params: { id: 1 },
        body: {},
      };
    });

    it('should delete a user successfully', async () => {
      const userMock = { id: 1, isActive: true };
      userRepository.findOneBy.mockResolvedValue(userMock);

      await deleteUser(req, res);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1, isActive: true });
      expect(userRepository.remove).toHaveBeenCalledWith(userMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should return 404 if user not found', async () => {
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
