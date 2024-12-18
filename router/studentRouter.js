const express = require('express');
const { bookSlot, viewAppointments } = require('./../controller/studentController');
const authenticate = require('./../middleware/authMiddleware');
const router = express.Router();

router.get('/appointments', authenticate, viewAppointments);
router.post('/book', authenticate, bookSlot);

module.exports = router;