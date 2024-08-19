import { parse } from 'date-fns';
import { AppDataSource } from '../config/database.js';
import { Employee } from '../models/employee.js';

export const createEmployee = async (req, res) => {
  try {
    const { name, hire_date, salary } = req.body;

    const parsedHireDate = parse(hire_date, 'dd/MM/yyyy', new Date());

    const employeeRepository = AppDataSource.getRepository(Employee);
    const employee = employeeRepository.create({ name, hire_date: parsedHireDate, salary });
    await employeeRepository.save(employee);
    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const employeeRepository = AppDataSource.getRepository(Employee);
    const [employees, count] = await employeeRepository.findAndCount({
      skip: offset,
      take: limit,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    res.status(200).json({ employees, count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeRepository = AppDataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hire_date, salary } = req.body;
    const employeeRepository = AppDataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    employee.name = name;
    employee.hire_date = parse(hire_date, 'dd/MM/yyyy', new Date());
    employee.salary = salary;
    await employeeRepository.save(employee);
    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeRepository = AppDataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    employee.isActive = false;
    await employeeRepository.save(employee);
    res.status(200).json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeRepository = AppDataSource.getRepository(Employee);
    const employee = await employeeRepository.findOneBy({ id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employeeRepository.remove(employee);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
