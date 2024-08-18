import { mock } from 'jest-mock-extended';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/database.js';
import UserRole from '../../config/roles.js';
import { register, login, getUserProfile } from '../../controllers/authController.js';
import User from '../../models/user.js';

describe('Auth Controller', () => {
  let req, res, userRepositoryMock;

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      },
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    userRepositoryMock = mock();
    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(userRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Register', () => {
    describe('Successful registration', () => {
      it('should register a new user successfully', async () => {
        userRepositoryMock.findOne.mockResolvedValue(null);
        userRepositoryMock.create.mockReturnValue({
          id: 1,
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'hashedPassword123',
          role: UserRole.EMPLOYEE,
          isActive: true
        });

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: 'User registered successfully',
          user: expect.objectContaining({
            username: 'testuser',
            email: 'testuser@example.com',
            role: UserRole.EMPLOYEE,
            isActive: true
          })
        }));
      });
    });

    describe('Failed registration', () => {
      it('should return an error if username already exists', async () => {
        userRepositoryMock.findOne.mockResolvedValue(true);

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Username already exists' }));
      });

      it('should return an error if email already exists', async () => {
        userRepositoryMock.findOne.mockResolvedValueOnce(false).mockResolvedValueOnce(true);

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Email already exists' }));
      });
    });

    it('should handle errors and return 400 status code', async () => {
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockRejectedValue(new Error('Database error'));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });

  });

  describe('Login', () => {
    describe('Successful login', () => {
      it('should login a user successfully', async () => {
        const user = {
          id: 1,
          email: 'testuser@example.com',
          password: await bcrypt.hash('password123', 10),
          role: UserRole.EMPLOYEE
        };

        userRepositoryMock.findOneBy.mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken');

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: 'Login successful',
          token: 'fakeToken'
        }));
      });
    });

    describe('Failed login', () => {
      it('should return 401 if credentials are invalid', async () => {
        userRepositoryMock.findOneBy.mockResolvedValue(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'Invalid credentials'
        }));
      });
    });

    it('should handle errors and return 400 status code', async () => {
      jest.spyOn(AppDataSource.getRepository(User), 'findOneBy').mockRejectedValue(new Error('Database error'));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });

  });

  describe('Get User Profile', () => {
    beforeEach(() => {
      req.user = { id: 1 };
    });

    describe('Successful retrieval', () => {
      it('should return user profile successfully', async () => {
        userRepositoryMock.findOne.mockResolvedValue({
          id: 1,
          username: 'testuser',
          email: 'testuser@example.com',
          role: 'employee'
        });

        await getUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          user: expect.objectContaining({
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            role: 'employee'
          })
        }));
      });
    });

    describe('Failed retrieval', () => {
      it('should return 404 if user not found', async () => {
        userRepositoryMock.findOne.mockResolvedValue(null);

        await getUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          error: 'User not found'
        }));
      });
    });

    it('should handle errors and return 400 status code', async () => {
      jest.spyOn(AppDataSource.getRepository(User), 'findOne').mockRejectedValue(new Error('Database error'));

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });

  });

});
