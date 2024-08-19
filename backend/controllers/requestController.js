import { AppDataSource } from '../config/database.js';
import { Request } from '../models/request.js';


export const createRequest = async (req, res) => {
  try {
    const { code, description, summary, employee_id } = req.body;
    const requestRepository = AppDataSource.getRepository(Request);

    const request = requestRepository.create({
      code,
      description,
      summary,
      employee_id
    });

    await requestRepository.save(request);
    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const requestRepository = AppDataSource.getRepository(Request);
    const [requests, count] = await requestRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
      where: { isActive: true },
    })
    res.status(200).json({ requests, count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestRepository = AppDataSource.getRepository(Request);
    const request = await requestRepository.findOneBy({ id });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(200).json({ request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, summary, employee_id } = req.body;
    const requestRepository = AppDataSource.getRepository(Request);
    const request = await requestRepository.findOneBy({ id, isActive: true });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    request.code = code;
    request.description = description;
    request.summary = summary;
    request.employee_id = employee_id;
    await requestRepository.save(request);
    res.status(200).json({ request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deactivateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestRepository = AppDataSource.getRepository(Request);
    const request = await requestRepository.findOneBy({ id, isActive: true });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    request.isActive = false;
    await requestRepository.save(request);
    res.status(200).json({ request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const requestRepository = AppDataSource.getRepository(Request);
    const request = await requestRepository.findOneBy({ id, isActive: true });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    await requestRepository.remove(request);
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

