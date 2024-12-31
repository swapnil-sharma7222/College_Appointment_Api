const request = require('supertest');
const mongoose = require('mongoose')
const app = require('./../server');
const Professor = require('./../model/professorModel');
const jwt = require('jsonwebtoken');
const Student = require('../model/studentModel');

describe('Professor Controller Tests', () => {
  let token;

  beforeAll(async () => {
    // Generate a valid token for a professor
    token = jwt.sign({ id: 'prof123', role: 'professor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log("this is token at test unit: ", token);

    // Mock Professor data in the database
    await Professor.create({
      professorId: 'prof123',
      name: 'Test Professor',
      password: 'hashed_password',
      availableSlots: [],
      bookedSlots: [],
    });

    await Student.create({
      studentId: 'student123',
      name: 'Test Student',
      password: 'hashed_password',
      bookedSlots: [],
    });
  });

  afterAll(async () => {
    await Professor.deleteMany({});
    await Student.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Add Slots', () => {
    test('should successfully add slots', async () => {
      const res = await request(app)
        .post('/professor/slots')
        .set('authorization', `${token}`)
        .send({
          slots: [
            { startTime: '10:00', endTime: '11:00' },
            { startTime: '11:00', endTime: '12:00' },
          ],
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Slots updated');
    });

    test('should fail to add slots without a token', async () => {
      const res = await request(app).post('/professor/slots').send({
        slots: [{ startTime: '10:00', endTime: '11:00' }],
      });

      expect(res.statusCode).toBe(401);
      expect(res.text).toBe('Access denied. No token provided.');
    });

    test('should fail to add slots with an invalid token', async () => {
      const res = await request(app)
        .post('/professor/slots')
        .set('authorization', 'invalidtoken')
        .send({
          slots: [{ startTime: '10:00', endTime: '11:00' }],
        });

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Invalid token.');
    });
  });

  describe('Cancel Appointment', () => {
    beforeEach(async () => {
      // Ensure a slot is booked for testing cancellation
      const var1 = await Professor.updateOne(
        { professorId: 'prof123' },
        {
          $set: {
            availableSlots: [{ startTime: '11:00', endTime: '12:00' }],
            bookedSlots: [
              {
                slotId: 'slot1',
                time: { startTime: '10:00', endTime: '11:00' },
                studentId: 'student123',
                studentName: 'Test Student',
              },
            ],
          },
        }
      );

      const var2 = await Student.updateOne(
        { studentId: 'student123' },
        {
          $set: {
            bookedSlots: [
              {
                slotId: 'slot1',
                time: { startTime: '10:00', endTime: '11:00' },
                professorId: 'prof123',
                professorName: 'Test Professor',
              },
            ],
          },
        }
      );

    });

    test('should successfully cancel an appointment', async () => {
      const res = await request(app).post('/professor/cancel').set('authorization', `${token}`).send({ slotId: 'slot1', studentId: 'student123' });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Slot cancelled successfully');
    });

    test('should fail to cancel appointment without a token', async () => {
      const res = await request(app).post('/professor/cancel').send({ slotId: 'slot1', studentId: 'student123' });

      expect(res.statusCode).toBe(401);
      expect(res.text).toBe('Access denied. No token provided.');
    });

    test('should fail to cancel appointment with an invalid token', async () => {
      const res = await request(app).post('/professor/cancel').set('authorization', 'invalidtoken').send({ slotId: 'slot1', studentId: 'student123' });

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Invalid token.');
    });

    test('should fail to cancel appointment if professor not found', async () => {
      const res = await request(app).post('/professor/cancel').set('authorization', `${token}`).send({ slotId: 'nonexistent_slot', studentId: 'student123' });

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('No such slot found');
    });
  });
});
