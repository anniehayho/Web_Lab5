const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

// Initialize MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_lab5'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Create tables
db.query(`CREATE TABLE IF NOT EXISTS User (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    RegistrationDate DATE NOT NULL
)`, err => {
    if (err) {
        console.error('Error creating User table:', err);
    }
});

db.query(`CREATE TABLE IF NOT EXISTS Product (
    ProductId INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ManufacturingDate DATE NOT NULL
)`, err => {
    if (err) {
        console.error('Error creating Product table:', err);
    }
});

db.query(`CREATE TABLE IF NOT EXISTS ShoppingCart (
    CartId INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY(UserId) REFERENCES User(UserId),
    FOREIGN KEY(ProductId) REFERENCES Product(ProductId)
)`, err => {
    if (err) {
        console.error('Error creating ShoppingCart table:', err);
    }
});

// User endpoints
app.get('', (req, res) => {
    db.query('SELECT * FROM User', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    const { FullName, Address, RegistrationDate } = req.body;
    db.query('INSERT INTO User (FullName, Address, RegistrationDate) VALUES (?, ?, ?)', [FullName, Address, RegistrationDate], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ UserId: results.insertId });
    });
});

app.put('/users/:id', (req, res) => {
    const { FullName, Address, RegistrationDate } = req.body;
    db.query('UPDATE User SET FullName = ?, Address = ?, RegistrationDate = ? WHERE UserId = ?', [FullName, Address, RegistrationDate, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: results.affectedRows });
    });
});

app.delete('/users/:id', (req, res) => {
    db.query('DELETE FROM User WHERE UserId = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: results.affectedRows });
    });
});

// Product endpoints
app.get('/products', (req, res) => {
    db.query('SELECT * FROM Product', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/products', (req, res) => {
    const { ProductName, Price, ManufacturingDate } = req.body;
    db.query('INSERT INTO Product (ProductName, Price, ManufacturingDate) VALUES (?, ?, ?)', [ProductName, Price, ManufacturingDate], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ ProductId: results.insertId });
    });
});

app.put('/products/:id', (req, res) => {
    const { ProductName, Price, ManufacturingDate } = req.body;
    db.query('UPDATE Product SET ProductName = ?, Price = ?, ManufacturingDate = ? WHERE ProductId = ?', [ProductName, Price, ManufacturingDate, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: results.affectedRows });
    });
});

app.delete('/products/:id', (req, res) => {
    db.query('DELETE FROM Product WHERE ProductId = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: results.affectedRows });
    });
});

// ShoppingCart endpoints
app.get('/shoppingcarts', (req, res) => {
    db.query('SELECT * FROM ShoppingCart', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/shoppingcarts', (req, res) => {
    const { UserId, ProductId, Quantity } = req.body;
    db.query('INSERT INTO ShoppingCart (UserId, ProductId, Quantity) VALUES (?, ?, ?)', [UserId, ProductId, Quantity], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ CartId: results.insertId });
    });
});

app.put('/shoppingcarts/:id', (req, res) => {
    const { UserId, ProductId, Quantity } = req.body;
    db.query('UPDATE ShoppingCart SET UserId = ?, ProductId = ?, Quantity = ? WHERE CartId = ?', [UserId, ProductId, Quantity, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: results.affectedRows });
    });
});

app.delete('/shoppingcarts/:id', (req, res) => {
    db.query('DELETE FROM ShoppingCart WHERE CartId = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: results.affectedRows });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});