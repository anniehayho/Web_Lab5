// index.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const addressSchema = new mongoose.Schema({
  street: String,
  suite: String,
  city: String,
  zipcode: String,
  geo: {
    lat: String,
    lng: String
  }
});

const companySchema = new mongoose.Schema({
  name: String,
  catchPhrase: String,
  bs: String
});

const userSchema = new mongoose.Schema({
  externalId: Number,
  name: String,
  username: String,
  email: String,
  phone: String,
  website: String,
  address: addressSchema,
  company: companySchema
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Fetch and save users endpoint
app.post('/api/users/fetch', async (req, res) => {
  try {
    // Fetch users from JSONPlaceholder
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = response.data;

    // Map and save each user
    const savedUsers = await Promise.all(users.map(async (userData) => {
      const user = new User({
        externalId: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        website: userData.website,
        address: {
          street: userData.address.street,
          suite: userData.address.suite,
          city: userData.address.city,
          zipcode: userData.address.zipcode,
          geo: {
            lat: userData.address.geo.lat,
            lng: userData.address.geo.lng
          }
        },
        company: {
          name: userData.company.name,
          catchPhrase: userData.company.catchPhrase,
          bs: userData.company.bs
        }
      });

      // Use findOneAndUpdate to avoid duplicates
      return User.findOneAndUpdate(
        { externalId: userData.id },
        user,
        { upsert: true, new: true }
      );
    }));

    res.json({
      success: true,
      message: `${savedUsers.length} users saved successfully`,
      data: savedUsers
    });

  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch and save users'
    });
  }
});

// Get saved users endpoint
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort('externalId');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
});

// Get single user endpoint
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ externalId: req.params.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

// Delete all users endpoint
app.delete('/api/users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({
      success: true,
      message: 'All users deleted successfully'
    });
  } catch (error) {
    console.error('Delete users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete users'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});