const jwt = require('jsonwebtoken');
const authMiddleware = require('./../middleware/authMiddleware');
const httpMocks = require('node-mocks-http');

describe('authMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toBe('Access denied. No token provided.');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if token is invalid', () => {
    req.headers.authorization = 'invalidtoken';
    jwt.verify = jest.fn(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getData()).toBe('Invalid token.');
    expect(next).not.toHaveBeenCalled();
  });

  it('should decode a valid professor token and call next', () => {
    const decodedToken = { id: 'prof123', role: 'professor' };
    req.headers.authorization = 'validtoken';
    jwt.verify = jest.fn().mockReturnValue(decodedToken);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  it('should decode a valid student token and call next', () => {
    const decodedToken = { id: 'student456', role: 'student' };
    req.headers.authorization = 'validtoken';
    jwt.verify = jest.fn().mockReturnValue(decodedToken);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if authorization header is malformed', () => {
    req.headers.Authorization = 'InvalidHeader';

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toBe('Access denied. No token provided.');
    expect(next).not.toHaveBeenCalled();
  });
});
