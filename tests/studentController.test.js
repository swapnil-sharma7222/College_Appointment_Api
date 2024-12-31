const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./../server');
const jwt = require('jsonwebtoken');
const Student = require('./../model/studentModel');
const Professor = require('./../model/professorModel');

describe('Student Controller Tests', () => {
  let token;

  beforeAll(async () => {
    token = jwt.sign({ id: 'student123', role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await Student.create({
      studentId: 'student123',
      name: 'Test Student',
      password: 'hashed_password',
      bookedSlots: [],
    });

    await Professor.create({
      professorId: 'prof123',
      name: 'Test Professor',
      password: 'hashed_password',
      availableSlots: [
        { _id: new mongoose.Types.ObjectId(), startTime: '10:00', endTime: '11:00' },
        { _id: new mongoose.Types.ObjectId(), startTime: '11:00', endTime: '12:00' },
      ],
      bookedSlots: [],
    });
  });

  afterAll(async () => {
    await Student.deleteMany({});
    await Professor.deleteMany({});
    await mongoose.connection.close();
  });

  describe('View Appointments', () => {
      test('should successfully return student appointments', async () => {
        const res = await request(app)
          .get('/student/appointments')
          .set('authorization', `${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('This is list of all the appointments.');
        expect(Array.isArray(res.body.appointments)).toBe(true);
      });

      test('should fail to view appointments without a token', async () => {
        const res = await request(app).get('/student/appointments');

        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('Access denied. No token provided.');
      });

      test('should fail to view appointments with an invalid token', async () => {
        const res = await request(app)
          .get('/student/appointments')
          .set('authorization', 'invalidtoken');

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid token.');
      });
    });

    describe('Book Slot', () => {
      let slotId;

      beforeEach(async () => {
        const professor = await Professor.findOne({ professorId: 'prof123' });
        slotId = professor.availableSlots[0]._id.toString();
      });

      test('should successfully book a slot', async () => {
        const res = await request(app)
          .post('/student/book')
          .set('authorization', `${token}`)
          .send({
            professorId: 'prof123',
            slotId,
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Slot booked successfully');
        // expect(res.body.studentBookedSlots.length).toBe(1);
        // expect(res.body.professorAvailableSlots.length).toBe(1);
      });

      test('should fail to book a slot without a token', async () => {
        const res = await request(app).post('/student/book').send({
          professorId: 'prof123',
          slotId,
        });

        expect(res.statusCode).toBe(401);
        expect(res.text).toBe('Access denied. No token provided.');
      });

      test('should fail to book a slot with an invalid token', async () => {
        const res = await request(app)
          .post('/student/book')
          .set('authorization', 'invalidtoken')
          .send({
            professorId: 'prof123',
            slotId,
          });

        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid token.');
      });

      test('should fail to book a slot if the professor is not found', async () => {
        const res = await request(app)
          .post('/student/book')
          .set('authorization', `${token}`)
          .send({
            professorId: 'nonexistent_professor',
            slotId,
          });

        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('Professor or student not found');
      });


    test('should fail to book a slot if the slot is not available', async () => {
      const invalidSlotId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .post('/student/book')
        .set('authorization', `${token}`)
        .send({
          professorId: 'prof123',
          slotId: invalidSlotId,
        });

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Slot not available');
    });

  });
});
