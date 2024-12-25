const Professor = require('./../model/professorModel');
const Student= require('./../model/studentModel');

exports.addSlots = async (req, res) => {
  try {
    const { slots } = req.body;

    const professor = await Professor.findOne({ professorId: req.user.id });
    if (!professor) return res.status(404).send('Professor not found');

    professor.availableSlots.push(...slots);
    await professor.save();

    res.status(200).json({
      message: "Slots updated",
      data: professor.availableSlots
    })
  } catch (error) {
    console.error('Error adding slots:', error);
    res.status(500).send('Internal server error');
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { studentId, slotId } = req.body;

    const professor = await Professor.findOne({ professorId: req.user.id });
    const student = await Student.findOne({ studentId });

    if (!professor || !student) return res.status(404).send('Professor or student not found');

    const slotIndex = professor.bookedSlots.findIndex(slot => slot.studentId === studentId && slot.slotId === slotId);
    if (slotIndex === -1) return res.status(400).send('No such slot found');
    const slotToBeCancelled= professor.availableSlots[slotIndex] 
    console.log(slotToBeCancelled);
    
    professor.availableSlots.push(slotToBeCancelled);
    professor.bookedSlots.splice(slotIndex, 1);

    const studentSlotIndex = student.bookedSlots.findIndex(slot => slot.slotId=== slotId && slot.professorId === professor.professorId);
    student.bookedSlots.splice(studentSlotIndex, 1);

    await professor.save();
    await student.save();

    res.status(200).json({
      message: "Slot cancelled successfully",
      bookedSlots: student.bookedSlots,
      availableSlots: professor.availableSlots
    })
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).send('Internal server error');
  }
};
