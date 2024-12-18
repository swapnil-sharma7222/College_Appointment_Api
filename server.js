const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./router/authRouter');
const professorRoutes = require('./router/professorRouter');
const studentRoutes = require('./router/studentRouter');
const connectdb = require('./db')

const app= express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
connectdb();

app.use('/auth', authRoutes);
app.use('/professor', professorRoutes);
app.use('/student', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});