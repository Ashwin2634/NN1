const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.get('/render/dashboard', (req, res) => {
    console.log("Dashboard endpoint hit");
    res.json(["ashwin", "vinod", "rani"]);
});

app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});