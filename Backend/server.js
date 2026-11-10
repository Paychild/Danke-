const express = require('express');
const cors = require('cors');  
const db = require('./database');
const transactionsRouter = require('./routes/transactions'); 

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware MUST be at the top before any routes
app.use(cors());
app.use(express.json());

// 2. Mount the router under /api so it matches your frontend fetch calls (/api/transactions & /api/categories)
app.use('/api', transactionsRouter);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});