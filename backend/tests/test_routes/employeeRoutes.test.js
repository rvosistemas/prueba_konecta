import request from 'supertest';
import express from 'express';
import employeeRoutes from '../../routes/employeeRoutes.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deactivateEmployee,
} from '../../controllers/employeeController.js';
import UserRole from '../../config/roles.js';

jest.mock('../../controllers/employeeController.js');
jest.mock('../../middlewares/authMiddleware.js', () => ({
  authenticate: jest.fn((req, res, next) => next()),
  authorize: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/employees', employeeRoutes);

describe('Employee Routes', () => {
  beforeEach(() => {
    authenticate.mockImplementation((req, res, next) => next());
    authorize.mockImplementation(() => (req, res, next) => next());
  });

  describe('GET /employees', () => {
    it('should call authenticate, authorize, and getEmployees controller', async () => {
      getEmployees.mockImplementation((req, res) => res.status(200).json({ employees: [] }));

      const response = await request(app)
        .get('/employees')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.EMPLOYEE, UserRole.ADMIN]);
      expect(getEmployees).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.employees).toEqual([]);
    });
  });

  describe('GET /employees/:id', () => {
    it('should call authenticate, authorize, and getEmployee controller', async () => {
      getEmployee.mockImplementation((req, res) => res.status(200).json({ employee: 'testEmployee' }));

      const response = await request(app)
        .get('/employees/1')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith([UserRole.EMPLOYEE, UserRole.ADMIN]);
      expect(getEmployee).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.employee).toBe('testEmployee');
    });
  });

  describe('POST /employees', () => {
    it('should call authenticate, authorize, and createEmployee controller', async () => {
      createEmployee.mockImplementation((req, res) => res.status(201).json({ message: 'Employee created' }));

      const response = await request(app)
        .post('/employees')
        .set('Authorization', 'Bearer mockToken')
        .send({ name: 'John Doe', hire_date: '2024-08-17', salary: 50000 });

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith(['admin']);
      expect(createEmployee).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Employee created');
    });
  });

  describe('PUT /employees/:id', () => {
    it('should call authenticate, authorize, and updateEmployee controller', async () => {
      updateEmployee.mockImplementation((req, res) => res.status(200).json({ message: 'Employee updated' }));

      const response = await request(app)
        .put('/employees/1')
        .set('Authorization', 'Bearer mockToken')
        .send({ name: 'Jane Doe', hire_date: '2024-08-17', salary: 60000 });

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith(['admin']);
      expect(updateEmployee).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Employee updated');
    });
  });

  describe('DELETE /employees/:id', () => {
    it('should call authenticate, authorize, and deactivateEmployee controller', async () => {
      deactivateEmployee.mockImplementation((req, res) => res.status(200).json({ message: 'Employee deactivated' }));

      const response = await request(app)
        .delete('/employees/1')
        .set('Authorization', 'Bearer mockToken');

      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith(['admin']);
      expect(deactivateEmployee).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Employee deactivated');
    });
  });
});
