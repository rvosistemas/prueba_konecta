const { Employee } = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const { name, hire_date, salary } = req.body;
    const employee = await Employee.create({ name, hire_date, salary });
    res.status(201).json({ message: 'Employee created successfully', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const employees = await Employee.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ employees });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.destroy();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
