const Professor = require('./../model/professorModel');

exports.addSlots = async (req, res) => {
  const { slots } = req.body;
  const professor = await Professor.findOne({ professorId: req.user.id });
  if (!professor) return res.status(404).send('Professor not found');
  professor.availableSlots.push(...slots);
  await professor.save();
  res.status(200).send('Slots updated');
};

exports.cancelAppointment = async (req, res) => {
  const { studentId, time } = req.body;
  const professor = await Professor.findOne({ professorId: req.user.id });
  const student = await Student.findOne({ studentId });

  if (!professor || !student) return res.status(404).send('Professor or student not found');

  const slotIndex = professor.bookedSlots.findIndex(slot => slot.time === time && slot.studentId === studentId);
  if (slotIndex === -1) return res.status(400).send('Slot not booked');

  professor.bookedSlots.splice(slotIndex, 1);
  professor.availableSlots.push(time);

  const studentSlotIndex = student.bookedSlots.findIndex(slot => slot.time === time && slot.professorId === professor.professorId);
  student.bookedSlots.splice(studentSlotIndex, 1);

  await professor.save();
  await student.save();
  res.status(200).send('Appointment canceled');
};