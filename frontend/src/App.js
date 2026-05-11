import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchFlights from './pages/SearchFlights';
import MyBookings from './pages/MyBookings';
import BookFlight from './pages/BookFlight';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchFlights />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/book/:id" element={<BookFlight />} />
      </Routes>
    </Router>
  );
}

export default App;