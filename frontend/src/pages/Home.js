import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.hero}>
      <div style={styles.content}>
        <h1 style={styles.title}>✈️ Welcome to AirBook</h1>
        <p style={styles.subtitle}>Book your flights easily and quickly!</p>
        <Link to="/search">
          <button style={styles.btn}>Search Flights</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #0066cc, #00ccff)',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  content: {
    color: 'white'
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '30px'
  },
  btn: {
    backgroundColor: 'white',
    color: '#0066cc',
    padding: '15px 40px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Home;