const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');

router.post('/', verifyToken, createBooking);
router.get('/my', verifyToken, getMyBookings);
router.put('/cancel/:id', verifyToken, cancelBooking);

module.exports = router;