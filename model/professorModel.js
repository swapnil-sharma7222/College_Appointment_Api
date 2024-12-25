const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  professorId: String,
  name: String,
  password: String,
  availableSlots: [
    {
      startTime: String,
      endTime: String,
    },
  ],
  bookedSlots: [
    {
      slotId: String,
      time: {
        startTime: String,
        endTime: String,
      },
      studentId: String,
      studentName: String,
    },
  ],
});

module.exports = mongoose.model('Professor', professorSchema);