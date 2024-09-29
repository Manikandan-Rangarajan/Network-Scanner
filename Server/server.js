// import express from 'express';
// import portscanner from 'portscanner';

// const app = express();
// const HOST = '10.10.52.1';
// const START_PORT = 1;
// const END_PORT = 4000;

// // app.get('/available-port', (req, res) => {
//     // Scan for the first available port between 3000 and 4000
//     portscanner.portscan(START_PORT, END_PORT, HOST, (error, results) => {
//         if (error) {
//             console.error('Error finding port:', error);
//             // res.status(500).json({ error: 'Failed to scan ports' });
//         } else {
//             console.log('Available port:', port);
//             // res.json({ availablePort: port });
//         }
//     });
// // });

// const PORT = 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// import portscanner from 'portscanner';

// portscanner.findAPortNotInUse(3000, 3000, '45.33.32.156', (error, port) => {
//   if (error) {
//     console.error('Error finding port:', error);
//   } else {
//     console.log('Available port:', port);
//   }
// });

// portscanner.checkPortStatus(443, '45.33.32.156', (error, status) => {
//     if (error) {
//       console.error('Error checking port status:', error);
//     } else {
//       console.log('Port 443 is:', status);
//     }
//   });

import express from 'express';
import nmap from 'node-nmap';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Route to perform a network scan
app.get('/scan', (req, res) => {
    // Get the target from query parameters, default to '127.0.0.1'
    const target = req.query.target || '127.0.0.1';
    
    // Create a new QuickScan instance
    const quickscan = new nmap.QuickScan(target);

    // Handle the complete event
    quickscan.on('complete', (data) => {
        res.json(data);
    });

    // Handle the error event
    quickscan.on('error', (error) => {
        res.status(500).json({ error: error.message });
    });

    // Start the scan
    quickscan.startScan();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

  
