const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Initialize Sequelize
const sequelize = new Sequelize('web_lab5', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define Models
const User = sequelize.define('User', {
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  RegistrationDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

const Product = sequelize.define('Product', {
  ProductId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  ManufacturingDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

const ShoppingCart = sequelize.define('ShoppingCart', {
  CartId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

// Define relationships
ShoppingCart.belongsTo(User, { foreignKey: 'UserId' });
ShoppingCart.belongsTo(Product, { foreignKey: 'ProductId' });

// Sync database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database:', err);
});

// User endpoints
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ action: 'GET', status: '200 OK', User: users });
  } catch (err) {
    res.status(500).json({ action: 'GET', status: '500 Internal Server Error', User: [], error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ action: 'POST', status: '200 OK', User: user });
  } catch (err) {
    res.status(500).json({ action: 'POST', status: '500 Internal Server Error', User: [], error: err.message });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ action: 'PUT', status: '404 Not Found', User: [], error: 'User not found' });
    }
    await user.update(req.body);
    res.json({ action: 'PUT', status: '200 OK', User: user });
  } catch (err) {
    res.status(500).json({ action: 'PUT', status: '500 Internal Server Error', User: [], error: err.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ action: 'DELETE', status: '404 Not Found', User: [], error: 'User not found' });
    }
    await user.destroy();
    res.json({ action: 'DELETE', status: '200 OK', User: { UserId: req.params.id } });
  } catch (err) {
    res.status(500).json({ action: 'DELETE', status: '500 Internal Server Error', User: [], error: err.message });
  }
});

// Product endpoints
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json({ action: 'GET', status: '200 OK', Product: products });
  } catch (err) {
    res.status(500).json({ action: 'GET', status: '500 Internal Server Error', Product: [], error: err.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ action: 'POST', status: '200 OK', Product: product });
  } catch (err) {
    res.status(500).json({ action: 'POST', status: '500 Internal Server Error', Product: [], error: err.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ action: 'PUT', status: '404 Not Found', Product: [], error: 'Product not found' });
    }
    await product.update(req.body);
    res.json({ action: 'PUT', status: '200 OK', Product: product });
  } catch (err) {
    res.status(500).json({ action: 'PUT', status: '500 Internal Server Error', Product: [], error: err.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ action: 'DELETE', status: '404 Not Found', Product: [], error: 'Product not found' });
    }
    await product.destroy();
    res.json({ action: 'DELETE', status: '200 OK', Product: { ProductId: req.params.id } });
  } catch (err) {
    res.status(500).json({ action: 'DELETE', status: '500 Internal Server Error', Product: [], error: err.message });
  }
});

// ShoppingCart endpoints
app.get('/shoppingcarts', async (req, res) => {
  try {
    const carts = await ShoppingCart.findAll({
      include: [
        { model: User },
        { model: Product }
      ]
    });
    res.json({ action: 'GET', status: '200 OK', ShoppingCart: carts });
  } catch (err) {
    res.status(500).json({ action: 'GET', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
  }
});

app.post('/shoppingcarts', async (req, res) => {
  try {
    const cart = await ShoppingCart.create(req.body);
    res.json({ action: 'POST', status: '200 OK', ShoppingCart: cart });
  } catch (err) {
    res.status(500).json({ action: 'POST', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
  }
});

app.put('/shoppingcarts/:id', async (req, res) => {
  try {
    const cart = await ShoppingCart.findByPk(req.params.id);
    if (!cart) {
      return res.status(404).json({ action: 'PUT', status: '404 Not Found', ShoppingCart: [], error: 'Cart not found' });
    }
    await cart.update(req.body);
    res.json({ action: 'PUT', status: '200 OK', ShoppingCart: cart });
  } catch (err) {
    res.status(500).json({ action: 'PUT', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
  }
});

app.delete('/shoppingcarts/:id', async (req, res) => {
  try {
    const cart = await ShoppingCart.findByPk(req.params.id);
    if (!cart) {
      return res.status(404).json({ action: 'DELETE', status: '404 Not Found', ShoppingCart: [], error: 'Cart not found' });
    }
    await cart.destroy();
    res.json({ action: 'DELETE', status: '200 OK', ShoppingCart: { CartId: req.params.id } });
  } catch (err) {
    res.status(500).json({ action: 'DELETE', status: '500 Internal Server Error', ShoppingCart: [], error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});