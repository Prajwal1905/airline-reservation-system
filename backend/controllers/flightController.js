const db = require('../config/db');

// Get all flights
const getAllFlights = (req, res) => {
  db.query('SELECT * FROM flights', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

// Search flights
const searchFlights = (req, res) => {
  const { source, destination, date } = req.query;

  let query = 'SELECT * FROM flights WHERE status = "scheduled"';
  let params = [];

  if (source) {
    query += ' AND source LIKE ?';
    params.push(`%${source}%`);
  }

  if (destination) {
    query += ' AND destination LIKE ?';
    params.push(`%${destination}%`);
  }

  if (date) {
    query += ' AND DATE(departure_time) = ?';
    params.push(date);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'No flights found' });
    res.json(results);
  });
};

// Get single flight
const getFlightById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM flights WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Flight not found' });
    res.json(results[0]);
  });
};

module.exports = { getAllFlights, searchFlights, getFlightById };