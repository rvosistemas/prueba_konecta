import { createRequest, getRequests, getRequest, updateRequest, deactivateRequest, deleteRequest } from '../../controllers/requestController';
import { AppDataSource } from '../../config/database.js';

describe('Request Controller', () => {
  let req, res, requestRepository;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    requestRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(requestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRequest', () => {
    it('should create a new request successfully', async () => {
      req.body = { code: 'REQ001', description: 'Test description', summary: 'Test summary', employee_id: 1 };

      requestRepository.create.mockReturnValue({
        id: 1,
        ...req.body
      });

      await createRequest(req, res);

      expect(requestRepository.create).toHaveBeenCalledWith(req.body);
      expect(requestRepository.save).toHaveBeenCalledWith(expect.objectContaining(req.body));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Request created successfully',
        request: expect.objectContaining(req.body)
      }));
    });

    it('should handle errors and return 400 status code', async () => {
      requestRepository.save.mockRejectedValue(new Error('Database error'));

      await createRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('getRequests', () => {
    it('should return a list of requests with count', async () => {
      req.query = { page: 1, limit: 2 };

      const requestsMock = [
        { id: 1, code: 'REQ001', description: 'Test description', summary: 'Test summary', employee_id: 1 },
        { id: 2, code: 'REQ002', description: 'Test description 2', summary: 'Test summary 2', employee_id: 2 }
      ];

      requestRepository.findAndCount.mockResolvedValue([requestsMock, 2]);

      await getRequests(req, res);

      expect(requestRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 2,
        order: { createdAt: 'DESC' }
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        requests: requestsMock,
        count: 2
      }));
    });

    it('should handle errors and return 400 status code', async () => {
      requestRepository.findAndCount.mockRejectedValue(new Error('Database error'));

      await getRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('getRequest', () => {
    it('should return a request if found', async () => {
      req.params.id = 1;
      const requestMock = { id: 1, code: 'REQ001', description: 'Test description', summary: 'Test summary', employee_id: 1 };
      requestRepository.findOneBy.mockResolvedValue(requestMock);

      await getRequest(req, res);

      expect(requestRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ request: requestMock });
    });

    it('should return 404 if request is not found', async () => {
      req.params.id = 1;
      requestRepository.findOneBy.mockResolvedValue(null);

      await getRequest(req, res);

      expect(requestRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Request not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      req.params.id = 1;
      requestRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await getRequest(req, res);

      expect(requestRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('updateRequest', () => {
    it('should update a request successfully', async () => {
      req.params.id = 1;
      req.body = { code: 'REQ001', description: 'Updated description', summary: 'Updated summary', employee_id: 1 };

      const requestMock = { id: 1, code: 'REQ001', description: 'Test description', summary: 'Test summary', employee_id: 1 };
      requestRepository.findOneBy.mockResolvedValue(requestMock);

      await updateRequest(req, res);

      expect(requestRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(requestRepository.save).toHaveBeenCalledWith({
        ...requestMock,
        code: 'REQ001',
        description: 'Updated description',
        summary: 'Updated summary',
        employee_id: 1
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        request: expect.objectContaining({
          description: 'Updated description',
          summary: 'Updated summary'
        })
      }));
    });

    it('should return 404 if request to update is not found', async () => {
      req.params.id = 1;
      requestRepository.findOneBy.mockResolvedValue(null);

      await updateRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Request not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      req.params.id = 1;
      requestRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await updateRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deactivateRequest', () => {
    it('should deactivate a request successfully', async () => {
      req.params.id = 1;

      const requestMock = { id: 1, code: 'REQ001', isActive: true };
      requestRepository.findOneBy.mockResolvedValue(requestMock);

      await deactivateRequest(req, res);

      expect(requestRepository.findOneBy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(requestMock.isActive).toBe(false);
      expect(requestRepository.save).toHaveBeenCalledWith(requestMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ request: requestMock });
    });

    it('should return 404 if request not found', async () => {
      req.params.id = 1;

      requestRepository.findOneBy.mockResolvedValue(null);

      await deactivateRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Request not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      requestRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await deactivateRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });

  describe('deleteRequest', () => {
    it('should delete a request successfully', async () => {
      req.params.id = 1;

      const requestMock = { id: 1, code: 'REQ001' };
      requestRepository.findOneBy.mockResolvedValue(requestMock);

      await deleteRequest(req, res);

      expect(requestRepository.findOneBy).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(requestRepository.remove).toHaveBeenCalledWith(requestMock);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Request deleted successfully' });
    });

    it('should return 404 if request not found', async () => {
      req.params.id = 1;

      requestRepository.findOneBy.mockResolvedValue(null);

      await deleteRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Request not found' }));
    });

    it('should handle errors and return 400 status code', async () => {
      req.params.id = 1;

      requestRepository.findOneBy.mockRejectedValue(new Error('Database error'));

      await deleteRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Database error' }));
    });
  });
});
