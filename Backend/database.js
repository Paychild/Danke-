const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbFile = path.resolve(__dirname, 'expenses.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create tables and seed default categories
        db.serialize(() => {
            // Categories table
            db.run(`CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL
            )`, (err) => {
                if (!err) {
                    // Check if categories already exist, if not, insert defaults
                    db.get(`SELECT COUNT(*) as count FROM categories`, (err, row) => {
                        if (row && row.count === 0) {
                            const defaultCategories = [
                                ['Salary', 'income'],
                                ['Freelance', 'income'],
                                ['Food & Groceries', 'expense'],
                                ['Rent & Housing', 'expense'],
                                ['Utilities', 'expense'],
                                ['Entertainment', 'expense']
                            ];

                            const stmt = db.prepare(`INSERT INTO categories (name, type) VALUES (?, ?)`);
                            defaultCategories.forEach(cat => stmt.run(cat));
                            stmt.finalize();
                            console.log('Default categories seeded successfully.');
                        }
                    });
                }
            });

            // Transactions table
            db.run(`CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                description TEXT,
                category_id INTEGER,
                date TEXT NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )`);
        });
    }
});

module.exports = db;