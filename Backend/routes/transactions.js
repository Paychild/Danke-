const express = require('express');
const router = express.Router();
const db = require('../database');

// GET: Fetch all categories (becomes /api/categories)
router.get('/categories', (req, res) => {
    const sql = `SELECT * FROM categories`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Success', data: rows });
    });
});

// GET: Fetch all transactions (becomes /api/transactions)
router.get('/transactions', (req, res) => {
    const sql = `
        SELECT t.*, c.name as category_name, c.type as category_type 
        FROM transactions t 
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Success', data: rows });
    });
});

// POST: Add a new transaction (/api/transactions)
router.post('/transactions', (req, res) => {
    const { amount, description, category_id, date } = req.body;
    const sql = `INSERT INTO transactions (amount, description, category_id, date) VALUES (?, ?, ?, ?)`;
    db.run(sql, [amount, description, category_id, date], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({
            message: 'Success',
            data: { id: this.lastID }
        });
    });
});

module.exports = router;