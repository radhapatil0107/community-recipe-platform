const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const recipeRoutes = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipeRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FlavorVerse Community Recipe Sharing API',
    version: '1.0.0',
    endpoints: {
      recipes: '/api/recipes',
      stats: '/api/recipes/stats'
    }
  });
});

// Database connection & Server start
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not defined in .env file!');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(' Successfully connected to MongoDB Atlas (database: recipeplatform)');
    app.listen(PORT, () => {
      console.log(` FlavorVerse Server running on port ${PORT} (http://localhost:${PORT})`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB Atlas connection error:', err.message);
    process.exit(1);
  });
