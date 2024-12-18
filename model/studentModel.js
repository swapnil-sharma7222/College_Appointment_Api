const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  password: String,
  bookedSlots: [
    {
      professorId: String,
      professorName: String,
      time: String,
    },
  ],
});

module.exports = mongoose.model('Student', studentSchema);