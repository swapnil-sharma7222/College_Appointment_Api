const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Student = require('./../model/studentModel');
const Professor = require('./../model/professorModel');

exports.register = async (req, res) => {
  const { role, name, id, password } = req.body;
  console.log(req.body);

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  if (role === 'student') {
    try {
      const student = await Student.create({ studentId: id, name, password: hashedPassword, bookedSlots: [] });
      return res.status(201).json({
        message: 'Student registered successfully',
        data: student,
      })
    } catch (error) {
      console.error('Error creating student:', error)
      return res.status(500).json({ error: 'Internal Server Error', error })
    }
  } else if (role === 'professor') {
    try {
      const professor = await Professor.create({ professorId: id, name, password: hashedPassword, availableSlots: [], bookedSlots: [] });

      return res.status(201).json({
        message: 'Professor registered successfully',
        data: professor,
      })
    } catch (error) {
      console.error('Error creating professor:', error)
      return res.status(500).json({ error: 'Internal Server Error', error })
    }
  } else {
    res.status(400).send('Invalid role');
  }
};

exports.login = async (req, res) => {
  const { role, id, password } = req.body;
  let user;

  if (role === 'student') {
    try {
      user = await Student.findOne({ studentId: id });
      if (!user) return res.status(404).send('User not found');
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).send('Invalid password');

      const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET);
      res.status(201).json({
        token: token,
        message: 'Student logged in successfully',
        data: user,
      });
    } catch (error) {
      console.error('Error logging in student:', error)
      return res.status(500).json({ error: 'Internal Server Error', error })
    }
  } else if (role === 'professor') {
    try {
      user = await Professor.findOne({ professorId: id });
      if (!user) return res.status(404).send('User not found');
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).send('Invalid password');

      const token = jwt.sign({ id: user.id, role }, JWT_SECRET);
      res.status(200).json({
        token: token,
        message: 'Professor logged in successfully',
        data: user,
      });
    } catch (error) {
      console.error('Error logging in professor:', error)
      return res.status(500).json({ error: 'Internal Server Error', error })
    }
  } else {
    return res.status(400).send('Invalid role');
  }
};