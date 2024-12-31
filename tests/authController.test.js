const request = require('supertest')
const app = require('../server')
const mongoose= require('mongoose')

describe('Auth Controller Tests', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  const testProfessor = { role: 'professor', id: 'prof123', password: 'testPassword123' };
  const testStudent = { role: 'student', id: 'student123', password: 'testPassword123' };

  describe('Register and Login Tests', () => {
    it('should register a professor', async () => {
      const res = await request(app).post('/auth/register').send(testProfessor);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Professor registered successfully');
    });

    it('should register a student', async () => {
      const res = await request(app).post('/auth/register').send(testStudent);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Student registered successfully');
    });

    it('should login as professor', async () => {
      const res = await request(app).post('/auth/login').send({
        role: 'professor',
        id: testProfessor.id,
        password: testProfessor.password,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Professor logged in successfully');
      expect(res.body).toHaveProperty('token');
    });

    it('should login as student', async () => {
      const res = await request(app).post('/auth/login').send({
        role: 'student',
        id: testStudent.id,
        password: testStudent.password,
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Student logged in successfully');
      expect(res.body).toHaveProperty('token');
    });

    // Some failing test cases
    it('should not login with incorrect password', async () => {
      const res = await request(app).post('/auth/login').send({
        role: 'professor',
        id: testProfessor.id,
        password: 'wrongPassword',
      });
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Invalid password');
    });

    it('should fail for invalid role', async () => {
      const res = await request(app).post('/auth/register').send({
        role: 'invalid',
        name: testStudent.name,
        id: testStudent.id,
        password: testStudent.password,
      });

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Invalid role');
    });
  });
});
