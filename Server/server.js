import express from 'express';
import nmap from 'node-nmap';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the 'dist' directory (assumes a build step for a frontend application)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../Client/dist')));

// Route to perform a network scan
app.get('/scan', (req, res) => {
    // Get the target from query parameters, default to '127.0.0.1'
    const target = req.query.target || '10.10.52.1';
    
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
