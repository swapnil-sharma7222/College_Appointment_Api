const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  professorId: String,
  name: String,
  password: String,
  availableSlots: [String],
  bookedSlots: [
    {
      time: String,
      studentId: String,
      studentName: String,
    },
  ],
});

module.exports = mongoose.model('Professor', professorSchema);