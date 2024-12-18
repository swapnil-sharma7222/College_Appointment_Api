const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('./../model/studentModel');
const Professor = require('./../model/professorModel');
const JWT_SECRET = 'super_secret_key';

exports.register = async (req, res) => {
  const { role, name, id, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === 'student') {
    const student = new Student({ studentId: id, name, password: hashedPassword, bookedSlots: [] });
    await student.save();
    res.status(201).send('Student registered successfully');
  } else if (role === 'professor') {
    const professor = new Professor({ professorId: id, name, password: hashedPassword, availableSlots: [], bookedSlots: [] });
    await professor.save();
    res.status(201).send('Professor registered successfully');
  } else {
    res.status(400).send('Invalid role');
  }
};

exports.login = async (req, res) => {
  const { role, id, password } = req.body;
  let user;

  if (role === 'student') {
    user = await Student.findOne({ studentId: id });
  } else if (role === 'professor') {
    user = await Professor.findOne({ professorId: id });
  } else {
    return res.status(400).send('Invalid role');
  }

  if (!user) return res.status(404).send('User not found');
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ id: user.id, role }, JWT_SECRET);
  res.status(200).json({ token });
};