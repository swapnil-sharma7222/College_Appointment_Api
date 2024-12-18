const Student = require('./../model/studentModel');
const Professor = require('./../model/professorModel');

exports.viewAppointments = async (req, res) => {
  const student = await Student.findOne({ studentId: req.user.id });
  if (!student) return res.status(404).send('Student not found');
  res.status(200).json({ appointments: student.bookedSlots });
};

exports.bookSlot = async (req, res) => {
  const { professorId, time } = req.body;
  const professor = await Professor.findOne({ professorId });
  const student = await Student.findOne({ studentId: req.user.id });

  if (!professor || !student) return res.status(404).send('Professor or student not found');

  const slotIndex = professor.availableSlots.indexOf(time);
  if (slotIndex === -1) return res.status(400).send('Slot not available');

  professor.availableSlots.splice(slotIndex, 1);
  professor.bookedSlots.push({ time, studentId: student.studentId, studentName: student.name });
  student.bookedSlots.push({ professorId: professor.professorId, professorName: professor.name, time });

  await professor.save();
  await student.save();
  res.status(200).send('Slot booked successfully');
};