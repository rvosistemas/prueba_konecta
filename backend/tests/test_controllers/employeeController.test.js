import { mock } from 'jest-mock-extended';
import { AppDataSource } from '../../config/database.js';
import { createEmployee, getEmployees, getEmployee, updateEmployee, deactivateEmployee, deleteEmployee } from '../../controllers/employeeController.js';

describe('Employee Controller', () => {
  let req, res, employeeRepositoryMock;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    employeeRepositoryMock = mock();
    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(employeeRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEmployee', () => {
    it('should create a new employee successfully', async () => {
      req.body = { name: 'John Doe', hire_date: '2024-08-17', salary: 50000 };

      employeeRepositoryMock.create.mockReturnValue({
        id: 1,
        ...req.body
      });

      await createEmployee(req, res);

      expect(employeeRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Employee created successfully',
        employee: expect.objectContaining(req.body)
      }));
    });

    it('should return 400 if there is an error in creating an employee', async () => {
      req.body = { name: 'John Doe', hire_date: 'invalid date', salary: 50000 };

      jest.spyOn(employeeRepositoryMock, 'create').mockImplementation(() => {
        throw new Error('Invalid date format');
      });

      await createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid date format' }));
    });
  });

  describe('getEmployees', () => {
    it('should return a list of employees with count', async () => {
      req.query = { page: 1, limit: 2 };

      const employeesMock = [
        { id: 1, name: 'John Doe', hire_date: '2024-08-17', salary: 50000 },
        { id: 2, name: 'Jane Doe', hire_date: '2024-08-18', salary: 60000 }
      ];

      employeeRepositoryMock.findAndCount.mockResolvedValue([employeesMock, 2]);

      await getEmployees(req, res);

      expect(employeeRepositoryMock.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 2,
        order: { createdAt: 'DESC' }
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        employees: employeesMock,
        count: 2
      }));
    });

    it('should handle errors when getting employees', async () => {
      jest.spyOn(employeeRepositoryMock, 'findAndCount').mockRejectedValue(new Error('Database error'));

      await getEmployees(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('getEmployee', () => {
    it('should return an employee if found', async () => {
      req.params.id = 1;
      const employeeMock = { id: 1, name: 'John Doe', hire_date: '2024-08-17', salary: 50000 };
      employeeRepositoryMock.findOneBy.mockResolvedValue(employeeMock);

      await getEmployee(req, res);

      expect(employeeRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ employee: employeeMock });
    });

    it('should return 404 if employee is not found', async () => {
      req.params.id = 1;
      employeeRepositoryMock.findOneBy.mockResolvedValue(null);

      await getEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Employee not found' }));
    });

    it('should handle errors when getting an employee', async () => {
      req.params.id = 1;
      jest.spyOn(employeeRepositoryMock, 'findOneBy').mockRejectedValue(new Error('Database error'));

      await getEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee successfully', async () => {
      req.params.id = 1;
      req.body = { name: 'John Doe', hire_date: '2024-08-17', salary: 60000 };

      const employeeMock = { id: 1, name: 'John Doe', hire_date: new Date(), salary: 50000 };
      employeeRepositoryMock.findOneBy.mockResolvedValue(employeeMock);

      await updateEmployee(req, res);

      expect(employeeRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ salary: 60000 }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Employee updated successfully',
        employee: expect.objectContaining({ salary: 60000 })
      }));
    });

    it('should return 404 if employee to update is not found', async () => {
      req.params.id = 1;
      employeeRepositoryMock.findOneBy.mockResolvedValue(null);

      await updateEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Employee not found' }));
    });

    it('should handle errors when updating an employee', async () => {
      req.params.id = 1;
      jest.spyOn(employeeRepositoryMock, 'findOneBy').mockRejectedValue(new Error('Database error'));

      await updateEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deactivateEmployee', () => {
    it('should deactivate an employee successfully', async () => {
      req.params.id = 1;

      const employeeMock = { id: 1, name: 'John Doe', hire_date: '2024-08-17', salary: 50000, isActive: true };
      employeeRepositoryMock.findOneBy.mockResolvedValue(employeeMock);

      await deactivateEmployee(req, res);

      expect(employeeRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({ isActive: false }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Employee deactivated successfully'
      }));
    });

    it('should return 404 if employee to deactivate is not found', async () => {
      req.params.id = 1;
      employeeRepositoryMock.findOneBy.mockResolvedValue(null);

      await deactivateEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Employee not found' }));
    });

    it('should handle errors when deactivating an employee', async () => {
      req.params.id = 1;

      jest.spyOn(employeeRepositoryMock, 'findOneBy').mockRejectedValue(new Error('Database error'));

      await deactivateEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee successfully', async () => {
      req.params.id = 1;

      const employeeMock = { id: 1, name: 'John Doe', hire_date: '2024-08-17', salary: 50000 };

      employeeRepositoryMock.findOneBy.mockResolvedValue(employeeMock);

      await deleteEmployee(req, res);

      expect(employeeRepositoryMock.findOneBy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(employeeRepositoryMock.remove).toHaveBeenCalledWith(employeeMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Employee deleted successfully'
      }));
    });

    it('should return 404 if employee to delete is not found', async () => {
      req.params.id = 1;

      employeeRepositoryMock.findOneBy.mockResolvedValue(null);

      await deleteEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Employee not found' }));
    });

    it('should handle errors when deleting an employee', async () => {
      req.params.id = 1;

      jest.spyOn(employeeRepositoryMock, 'findOneBy').mockRejectedValue(new Error('Database error'));

      await deleteEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });
});
