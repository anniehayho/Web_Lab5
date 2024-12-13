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
app.get('/users', (req, res) => {
    db.query('SELECT * FROM User', (err, results) => {
        if (err) {
            res.status(500).json({ action: 'GET', status: '500 Internal Server Error', User: [], error: err.message });
            return;
        }
        res.json({ action: 'GET', status: '200 OK', User: results });
    });
});

app.post('/users', (req, res) => {
    const { FullName, Address, RegistrationDate } = req.body;
    db.query('INSERT INTO User (FullName, Address, RegistrationDate) VALUES (?, ?, ?)', [FullName, Address, RegistrationDate], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'POST', status: '500 Internal Server Error', User: [], error: err.message });
            return;
        }
        res.json({ action: 'POST', status: '200 OK', User: { UserId: results.insertId, FullName, Address, RegistrationDate } });
    });
});

app.put('/users/:id', (req, res) => {
    const { FullName, Address, RegistrationDate } = req.body;
    db.query('UPDATE User SET FullName = ?, Address = ?, RegistrationDate = ? WHERE UserId = ?', [FullName, Address, RegistrationDate, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'PUT', status: '500 Internal Server Error', User: [], error: err.message });
            return;
        }
        res.json({ action: 'PUT', status: '200 OK', User: { UserId: req.params.id, FullName, Address, RegistrationDate } });
    });
});

app.delete('/users/:id', (req, res) => {
    db.query('DELETE FROM User WHERE UserId = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'DELETE', status: '500 Internal Server Error', User: [], error: err.message });
            return;
        }
        res.json({ action: 'DELETE', status: '200 OK', User: { UserId: req.params.id } });
    });
});

// Product endpoints
app.get('/products', (req, res) => {
    db.query('SELECT * FROM Product', (err, results) => {
        if (err) {
            res.status(500).json({ action: 'GET', status: '500 Internal Server Error', Product: [], error: err.message });
            return;
        }
        res.json({ action: 'GET', status: '200 OK', Product: results });
    });
});

app.post('/products', (req, res) => {
    const { ProductName, Price, ManufacturingDate } = req.body;
    db.query('INSERT INTO Product (ProductName, Price, ManufacturingDate) VALUES (?, ?, ?)', [ProductName, Price, ManufacturingDate], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'POST', status: '500 Internal Server Error', Product: [], error: err.message });
            return;
        }
        res.json({ action: 'POST', status: '200 OK', Product: { ProductId: results.insertId, ProductName, Price, ManufacturingDate } });
    });
});

app.put('/products/:id', (req, res) => {
    const { ProductName, Price, ManufacturingDate } = req.body;
    db.query('UPDATE Product SET ProductName = ?, Price = ?, ManufacturingDate = ? WHERE ProductId = ?', [ProductName, Price, ManufacturingDate, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'PUT', status: '500 Internal Server Error', Product: [], error: err.message });
            return;
        }
        res.json({ action: 'PUT', status: '200 OK', Product: { ProductId: req.params.id, ProductName, Price, ManufacturingDate } });
    });
});

app.delete('/products/:id', (req, res) => {
    db.query('DELETE FROM Product WHERE ProductId = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'DELETE', status: '500 Internal Server Error', Product: [], error: err.message });
            return;
        }
        res.json({ action: 'DELETE', status: '200 OK', Product: { ProductId: req.params.id } });
    });
});

// ShoppingCart endpoints
app.get('/shoppingcarts', (req, res) => {
    db.query('SELECT * FROM ShoppingCart', (err, results) => {
        if (err) {
            res.status(500).json({ action: 'GET', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
            return;
        }
        res.json({ action: 'GET', status: '200 OK', ShoppingCart: results });
    });
});

app.post('/shoppingcarts', (req, res) => {
    const { UserId, ProductId, Quantity } = req.body;
    db.query('INSERT INTO ShoppingCart (UserId, ProductId, Quantity) VALUES (?, ?, ?)', [UserId, ProductId, Quantity], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'POST', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
            return;
        }
        res.json({ action: 'POST', status: '200 OK', ShoppingCart: { CartId: results.insertId, UserId, ProductId, Quantity } });
    });
});

app.put('/shoppingcarts/:id', (req, res) => {
    const { UserId, ProductId, Quantity } = req.body;
    db.query('UPDATE ShoppingCart SET UserId = ?, ProductId = ?, Quantity = ? WHERE CartId = ?', [UserId, ProductId, Quantity, req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'PUT', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
            return;
        }
        res.json({ action: 'PUT', status: '200 OK', ShoppingCart: { CartId: req.params.id, UserId, ProductId, Quantity } });
    });
});

app.delete('/shoppingcarts/:id', (req, res) => {
    db.query('DELETE FROM ShoppingCart WHERE CartId = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ action: 'DELETE', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
            return;
        }
        res.json({ action: 'DELETE', status: '200 OK', ShoppingCart: { CartId: req.params.id } });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});