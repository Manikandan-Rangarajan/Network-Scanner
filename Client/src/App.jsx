// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [target, setTarget] = useState('10.10.52.1');
  const [scanType, setScanType] = useState('quick');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.get(`http://localhost:5000/scan/${scanType}?target=${target}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to perform the scan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Network Scanner</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Target IP"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="quick">Quick Scan</option>
          <option value="full">Full Scan</option>
          <option value="os">OS Detection</option>
          <option value="service">Service Detection</option>
        </select>
        <button
          onClick={handleScan}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Scan
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {results && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Scan Results:</h2>
          <pre className="bg-gray-200 p-4 rounded">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
