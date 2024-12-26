const mongoose = require('mongoose');
const Student = require('./../model/studentModel');
const Professor = require('./../model/professorModel');

exports.viewAppointments = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.user.id });
    if (!student) return res.status(404).send('Student not found');
    res.status(200).json({ 
      appointments: student.bookedSlots,
      message: "This is list of all the appointments."
    });
  } catch (error) {
    console.error('Error viewing appointments:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { professorId, slotId } = req.body;

    const professor = await Professor.findOne({ professorId });
    const student = await Student.findOne({ studentId: req.user.id });

    if (!professor || !student) return res.status(404).send('Professor or student not found');

    const slotObjectId = new mongoose.Types.ObjectId(slotId);
    const slotIndex = professor.availableSlots.findIndex((slot) => {
      if(slot){
        return slot._id.equals(slotObjectId)
      }
    });
    if (slotIndex === -1) return res.status(400).send('Slot not available');

    const slot = professor.availableSlots[slotIndex];
    // console.log(slot);
    professor.availableSlots.splice(slotIndex, 1);
    console.log(professor.availableSlots);
    

    professor.bookedSlots.push({ slotId: slotId, time: slot, studentId: student.studentId, studentName: student.name });
    student.bookedSlots.push({ slotId: slotId, time: slot, professorId: professor.professorId, professorName: professor.name });

    await professor.save();
    await student.save();

    res.status(200).json({
      message: "Slot booked successfully",
      studentBookedSlots: student.bookedSlots,
      professorAvailableSlots: professor.availableSlots,
      professorBookedSlots: professor.bookedSlots
    })
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).send('Internal Server Error');
  }
};
