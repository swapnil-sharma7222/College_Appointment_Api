const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  password: String,
  bookedSlots: [
    {
      slotId: String,
      professorId: String,
      professorName: String,
      time: {
        startTime: String,
        endTime: String,
      },
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);