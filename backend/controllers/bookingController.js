const db = require('../config/db');

// Create booking
const createBooking = (req, res) => {
  const { flight_id, seats_booked } = req.body;
  const user_id = req.userId;

  // Check flight exists and has seats
  db.query('SELECT * FROM flights WHERE id = ?', [flight_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Flight not found' });

    const flight = results[0];

    if (flight.available_seats < seats_booked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const total_price = flight.price * seats_booked;

    // Create booking
    db.query(
      'INSERT INTO bookings (user_id, flight_id, seats_booked, total_price) VALUES (?, ?, ?, ?)',
      [user_id, flight_id, seats_booked, total_price],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating booking' });

        const booking_id = result.insertId;

        // Update available seats
        db.query(
          'UPDATE flights SET available_seats = available_seats - ? WHERE id = ?',
          [seats_booked, flight_id],
          (err) => {
            if (err) return res.status(500).json({ message: 'Error updating seats' });

            // Create payment record
            db.query(
              'INSERT INTO payments (booking_id, amount) VALUES (?, ?)',
              [booking_id, total_price],
              (err) => {
                if (err) return res.status(500).json({ message: 'Error creating payment' });

                res.status(201).json({
                  message: 'Booking successful',
                  booking_id,
                  total_price
                });
              }
            );
          }
        );
      }
    );
  });
};

// Get my bookings
const getMyBookings = (req, res) => {
  const user_id = req.userId;

  db.query(
    `SELECT b.*, f.flight_number, f.source, f.destination, 
     f.departure_time, f.arrival_time 
     FROM bookings b 
     JOIN flights f ON b.flight_id = f.id 
     WHERE b.user_id = ?`,
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(results);
    }
  );
};

// Cancel booking
const cancelBooking = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  db.query(
    'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
    [id, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) return res.status(404).json({ message: 'Booking not found' });

      const booking = results[0];

      // Update booking status
      db.query(
        'UPDATE bookings SET status = "cancelled" WHERE id = ?',
        [id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Error cancelling booking' });

          // Restore seats
          db.query(
            'UPDATE flights SET available_seats = available_seats + ? WHERE id = ?',
            [booking.seats_booked, booking.flight_id],
            (err) => {
              if (err) return res.status(500).json({ message: 'Error restoring seats' });

              // Update payment status
              db.query(
                'UPDATE payments SET payment_status = "refunded" WHERE booking_id = ?',
                [id],
                (err) => {
                  if (err) return res.status(500).json({ message: 'Error updating payment' });
                  res.json({ message: 'Booking cancelled and refunded successfully' });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = { createBooking, getMyBookings, cancelBooking };