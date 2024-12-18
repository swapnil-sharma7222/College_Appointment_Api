const express = require('express');
const { addSlots, cancelAppointment } = require('./../controller/professorController');
const authenticate = require('./../middleware/authMiddleware');
const router = express.Router();

router.post('/slots', authenticate, addSlots);
router.post('/cancel', authenticate, cancelAppointment);

module.exports = router;