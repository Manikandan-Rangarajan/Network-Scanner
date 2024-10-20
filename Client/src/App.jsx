import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [target, setTarget] = useState('45.33.32.156');
  const [scanType, setScanType] = useState('quick');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanTrigger, setScanTrigger] = useState(0);
  const [scrollText, setScrollText] = useState('');
  const [hackerHost, setHackerHost] = useState('');
  const [hackerIp, setHackerIp] = useState('');
  let [port, setPort] = useState([]);
  let [service, setService] = useState([]);
  let [hport, setHport] = useState('');
  let [hservice, setHservice] = useState('');


  useEffect(() => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n' +
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n' +
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n' +
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'; 
    const intervalId = setInterval(() => {
      setScrollText(text.substring(0, scrollText.length + 1));
    }, 50);
    return () => clearInterval(intervalId);
  }, [scrollText, scanTrigger]);

  useEffect(() => {
    if (results) {
      const hostname = results[0].hostname;
      const ip = results[0].ip;
      const intervalId = setInterval(() => {
        setHackerHost(hostname.substring(0, hackerHost.length + 1));
        setHackerIp(ip.substring(0, hackerIp.length + 1));
      }, 50);
      return () => clearInterval(intervalId);
    }
  }, [results, hackerHost, hackerIp, scanTrigger]);

  // nver uncomment this
  // useEffect(() => {
  //   if (results) {
  //     const hport = port
  //     const hservice = service;
  //     const intervalId = setInterval(() => {
  //       setHackerHost(hport(0, hackerHost.length + 1));
  //       setHackerIp(hservice(0, hackerIp.length + 1));
  //     }, 50);
  //     return () => clearInterval(intervalId);
  //   }
  // }, [results, hport, hservice, scanTrigger]);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setScanTrigger((prevTrigger) => prevTrigger + 1);

    // Call the respective scan function based on the selected scan type
    if (scanType === 'quick') {
      await quickScan();
    } else if (scanType === 'full') {
      await fullScan();
    } else if (scanType === 'os') {
      await osDetectionScan();
    } else if (scanType === 'service') {
      await serviceDetectionScan();
    }
  };

  // Separate functions for each scan type
  const quickScan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scan/quick?target=${target}`);
      setResults(response.data);
      console.log(response.data);
    } catch (err) {
      setError('Failed to perform the quick scan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fullScan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scan/full?target=${target}`);
      setResults(response.data);
      console.log(response.data);
      port = response.data[0].openPorts;
      port.forEach((ports)=>{
        setPort(ports?.protocol)
        console.log(ports?.protocol,ports?.service);
        setService(ports?.service)
  })
    } catch (err) {
      setError('Failed to perform the full scan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const osDetectionScan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scan/os?target=${target}`);
      setResults(response.data);
      console.log(response.data);
      port = response.data[0].openPorts;
      port.forEach((ports)=>{
        setPort(ports?.protocol)
        console.log(ports?.protocol,ports?.service);
        setService(ports?.service)
  })
} catch (err) {
      setError('Failed to perform the OS detection scan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const serviceDetectionScan = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scan/service?target=${target}`);
      setResults(response.data);
      console.log(response.data);
      port = response.data[0].openPorts;
      port.forEach((ports)=>{
        setPort(ports?.protocol)
        console.log(ports?.protocol,ports?.service);
        setService(ports?.service)
      })

    } catch (err) {
      setError('Failed to perform the service detection scan.');
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
      {error && <p className="text-red-500 z-10 ">{error}</p>}
      {results && (
        <div className="mt-4 z-10">
          <h2 className="text-2xl font-bold text-green-500">Scan Results:</h2>
          <div className="hacker-text">
            <p className="text-green-500 text-xs font-mono">
              Hostname: {hackerHost}
              <br></br>
              IP: {hackerIp}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
