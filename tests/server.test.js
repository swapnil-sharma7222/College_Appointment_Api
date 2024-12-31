const request = require('supertest');
const app = require('./../server'); // Path to your server file
const connectdb = require('./../db'); // Mock database connection

jest.mock('../db', () => jest.fn());

describe('Server Tests', () => {
  beforeAll(() => {
    connectdb.mockResolvedValue();
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
  });

  it('should initialize database connection on server start', () => {
    expect(connectdb).toHaveBeenCalled();
  });
});
