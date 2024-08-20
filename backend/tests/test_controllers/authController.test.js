import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/database.js';
import { register, login, getUserProfile } from '../../controllers/authController.js';
import User from '../../models/user.js';
import { Employee } from '../../models/employee.js';
import UserRole from '../../config/roles.js';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Controller', () => {
  let req, res;
  let userRepositoryMock, employeeRepositoryMock;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test Name',
        hire_date: '01/01/2021',
        salary: 50000,
        role: UserRole.EMPLOYEE
      },
      user: { id: 1 },
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    userRepositoryMock = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    employeeRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository')
      .mockImplementation((model) => {
        if (model === User) {
          return userRepositoryMock;
        } else if (model === Employee) {
          return employeeRepositoryMock;
        }
        throw new Error('Unexpected model type');
      });


  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  describe('Register', () => {
    it('should register a new user and employee successfully', async () => {
      userRepositoryMock.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.anything());
    });

    it('should return an error if username already exists', async () => {
      userRepositoryMock.findOne.mockResolvedValueOnce({ id: 1, username: 'testuser' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.anything());
    });

    it('should return an error if email already exists', async () => {
      userRepositoryMock.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 1, email: 'testuser@example.com' });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.anything());
    });

    it('should handle unexpected errors', async () => {
      userRepositoryMock.findOne.mockRejectedValue(new Error('Database error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.anything());
    });
  });


  describe('Login', () => {
    beforeEach(() => {
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken');
    });

    it('should login a user successfully', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue({
        id: 1,
        email: 'testuser@example.com',
        password: 'hashedPassword123',
        role: UserRole.EMPLOYEE,
        isActive: true
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: expect.any(String)
      });
    });

    it('should return 401 if credentials are invalid', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid credentials' }));
    });

    it('should handle errors during login', async () => {
      userRepositoryMock.findOneBy.mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });


  describe('Get User Profile', () => {
    it('should return user profile successfully', async () => {
      userRepositoryMock.findOne.mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        role: UserRole.EMPLOYEE
      });

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: expect.objectContaining({
          id: 1,
          username: 'testuser',
          email: 'testuser@example.com',
          role: UserRole.EMPLOYEE
        })
      });
    });

    it('should return 404 if user not found', async () => {
      userRepositoryMock.findOne.mockResolvedValue(null);

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
    });

    it('should handle errors in retrieving user profile', async () => {
      userRepositoryMock.findOne.mockRejectedValue(new Error('Database error'));

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });


});
