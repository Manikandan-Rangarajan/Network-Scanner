// server.js
import express from 'express';
import nmap from 'node-nmap';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the 'dist' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Client/dist')));

// Route to perform a network scan
app.get('/scan/:type', (req, res) => {
    const target = req.query.target ;
    const scanType = req.params.type;
    let scanOptions;

    switch (scanType) {
        case 'quick':
            scanOptions = new nmap.QuickScan(target);
            break;
        case 'full':
            scanOptions = new nmap.NmapScan(target,"--webxml");
            break;
        case 'os':
            scanOptions = new nmap.NmapScan(target, "--script-trace");
            break;
        case 'service':
            scanOptions = new nmap.NmapScan(target, "--reason");
            break;
        default:
            return res.status(400).json({ error: 'Invalid scan type' });
    }

    scanOptions.on('complete', (data,time) => {
        res.json(data);
        console.log("total scan time" + scanOptions.scanTime);
    });

    scanOptions.on('error', (error) => {
        res.status(500).json({ error: error.message });
    });

    // Start the scan
    scanOptions.startScan();
});

// Serve the main index.html for other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(path.resolve(), '../Client/dist', 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
