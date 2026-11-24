const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true
  },
  amount: {
    type: String,
    required: [true, 'Ingredient amount is required'],
    trim: true
  }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  author: {
    type: String,
    trim: true,
    default: 'Community Chef'
  },
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Prep time must be at least 1 minute']
  },
  cookTime: {
    type: Number,
    required: [true, 'Cooking time is required'],
    min: [0, 'Cook time cannot be negative']
  },
  servings: {
    type: Number,
    required: [true, 'Servings count is required'],
    min: [1, 'Servings must be at least 1'],
    default: 2
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Beverage', 'Snack', 'Salad'],
    required: [true, 'Category is required']
  },
  cuisine: {
    type: String,
    enum: ['Italian', 'Indian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'French', 'Other'],
    default: 'Other'
  },
  ingredients: {
    type: [IngredientSchema],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  steps: {
    type: [String],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one step is required'
    }
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Full-text or regex search index for fast query performance
RecipeSchema.index({ title: 'text', description: 'text', 'ingredients.name': 'text', cuisine: 'text' });

module.exports = mongoose.model('Recipe', RecipeSchema);
