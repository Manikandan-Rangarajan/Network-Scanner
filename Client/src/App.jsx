// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [target, setTarget] = useState('10.10.52.1');
  const [scanType, setScanType] = useState('quick');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanTrigger, setScanTrigger] = useState(0);
  const [scrollText, setScrollText] = useState('');
  const [hackerHost, setHackerHost] = useState('');
  const [hackerIp, setHackerIp] = useState('');
  const [port, setPort] = useState([]);
  const [service, setService] = useState([]);

  useEffect(() => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const intervalId = setInterval(() => {
      setScrollText(text.substring(0, scrollText.length + 1));
    }, 50);
    return () => clearInterval(intervalId);
  }, [scrollText,scanTrigger]);

  useEffect(() => {
    if (results){
      const hostname = results[0].hostname;
      const ip = results[0].ip;
      const intervalId = setInterval(() => {
        setHackerHost(hostname.substring(0, hackerHost.length + 1));
        setHackerIp(ip.substring(0, hackerIp.length + 1));
      }, 50);
      return () => clearInterval(intervalId);
    }
  }, [results,hackerHost, hackerIp,scanTrigger]);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setScanTrigger((prevTrigger) => prevTrigger + 1);

    try {
      const response = await axios.get(`http://localhost:5000/scan/${scanType}?target=${target}`);
      setResults(response.data);
      console.log(response.data);
      port = response.data[0].openPorts;
      console.log(port);
      port.forEach((ports)=>{
            console.log(ports?.protocol);
            setPort(ports?.protocol)
            console.log(ports?.service);
            setService(ports?.service)
      })
    } catch (err) {
      setError('Failed to perform the scan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <p className="text-green-500 text-xs font-mono whitespace-nowrap animate-scroll">{scrollText}</p>
      </div>
      <div className="flex justify-center mt-4 z-10">
        <h1 className="text-3xl font-bold text-green-500">Network Scanner</h1>
      </div>
      <div className="flex space-x-4 mb-4 mt-8 z-10">
        <input
          type="text"
          placeholder="Target IP"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="border border-gray-600 p-2 rounded bg-gray-800 text-gray-200"
        />
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          className="border border-gray-600 p-2 rounded bg-gray-800 text-gray-200"
        >
          <option value="quick">Quick Scan</option>
          <option value="full">Full Scan</option>
          <option value="os">OS Detection</option>
          <option value="service">Service Detection</option>
        </select>
        <button
          onClick={handleScan}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition"
        >
          Scan
        </button>
      </div>
      {loading && <p className="text-green-500 z-10">Loading...</p>}
      {error && <p className="text-red-500 z-10">{error}</p>}
      {results && (
        <div className="mt-4 z-10">
          <h2 className="text-2xl font-bold text-green-500">Scan Results:</h2>
          <div className="hacker-text">
          <p className="text-green-500 text-xs font-mono">
                {/* {key}: {results[key]} */}
                {/* {results[0].hostname}
                <br></br>
                {results[0].ip} */}
                
                Hostname: {hackerHost}
                <br></br>
                IP: {hackerIp}
                
                {/* {results[0].mac}
                {results[0].openPorts} */}
                {/* {results[0].osNmap} */}
              </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;