// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [availablePort, setAvailablePort] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the available port from the backend
    const fetchAvailablePort = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scan');
        setAvailablePort(response.data.availablePort);
      } catch (err) {
        setError('Failed to fetch the available port.');
        console.error(err);
      }
    };

    fetchAvailablePort();
  }, []);

  return (
    <div className="App">
      <h1>Available Port Scanner</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{availablePort ? `Available Port: ${availablePort}` : 'Scanning for available port...'}</p>
      )}
    </div>
  );
}

export default App;
