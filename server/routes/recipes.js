const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// @route   GET /api/recipes
// @desc    Get all recipes with optional filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { search, category, cuisine, difficulty, sortBy } = req.query;
    let query = {};

    // Search filter across title, description, and ingredients
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'ingredients.name': searchRegex },
        { tags: searchRegex },
        { cuisine: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Cuisine filter
    if (cuisine && cuisine !== 'All') {
      query.cuisine = cuisine;
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sortBy === 'popular') {
      sortOption = { likes: -1, createdAt: -1 };
    } else if (sortBy === 'quickest') {
      sortOption = { prepTime: 1, cookTime: 1 };
    } else if (sortBy === 'title') {
      sortOption = { title: 1 };
    }

    const recipes = await Recipe.find(query).sort(sortOption);
    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching recipes', error: error.message });
  }
});

// @route   GET /api/recipes/stats
// @desc    Get summary analytics (total recipes, total likes, categories breakdown)
router.get('/stats', async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const recipes = await Recipe.find({}, 'category cuisine likes');

    const totalLikes = recipes.reduce((sum, r) => sum + (r.likes || 0), 0);

    const categoryCounts = {};
    const cuisineCounts = {};
    recipes.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalRecipes,
        totalLikes,
        categoryCounts,
        cuisineCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats', error: error.message });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe details
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Invalid Recipe ID' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   POST /api/recipes
// @desc    Create a new recipe
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      prepTime,
      cookTime,
      servings,
      difficulty,
      category,
      cuisine,
      ingredients,
      steps,
      imageUrl,
      tags
    } = req.body;

    // Validation
    if (!title || !description || !prepTime || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, prepTime, category'
      });
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipe must include at least one ingredient'
      });
    }

    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipe must include at least one instruction step'
      });
    }

    // Clean ingredients & steps
    const cleanIngredients = ingredients
      .filter(item => item && item.name && item.name.trim())
      .map(item => ({
        name: item.name.trim(),
        amount: (item.amount || 'to taste').trim()
      }));

    const cleanSteps = steps
      .filter(step => step && typeof step === 'string' && step.trim().length > 0)
      .map(step => step.trim());

    if (cleanIngredients.length === 0 || cleanSteps.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid ingredients and instructions are required'
      });
    }

    const newRecipe = new Recipe({
      title: title.trim(),
      description: description.trim(),
      author: author ? author.trim() : 'Community Chef',
      prepTime: Number(prepTime),
      cookTime: Number(cookTime) || 0,
      servings: Number(servings) || 2,
      difficulty: difficulty || 'Easy',
      category,
      cuisine: cuisine || 'Other',
      ingredients: cleanIngredients,
      steps: cleanSteps,
      imageUrl: imageUrl ? imageUrl.trim() : '',
      tags: Array.isArray(tags) ? tags : [],
      likes: 0
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json({ success: true, data: savedRecipe, message: 'Recipe published successfully!' });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update an existing recipe
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      prepTime,
      cookTime,
      servings,
      difficulty,
      category,
      cuisine,
      ingredients,
      steps,
      imageUrl,
      tags
    } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (title) recipe.title = title.trim();
    if (description) recipe.description = description.trim();
    if (author) recipe.author = author.trim();
    if (prepTime !== undefined) recipe.prepTime = Number(prepTime);
    if (cookTime !== undefined) recipe.cookTime = Number(cookTime);
    if (servings !== undefined) recipe.servings = Number(servings);
    if (difficulty) recipe.difficulty = difficulty;
    if (category) recipe.category = category;
    if (cuisine) recipe.cuisine = cuisine;
    if (imageUrl !== undefined) recipe.imageUrl = imageUrl.trim();
    if (tags !== undefined) recipe.tags = Array.isArray(tags) ? tags : [];

    if (ingredients && Array.isArray(ingredients)) {
      recipe.ingredients = ingredients
        .filter(item => item && item.name && item.name.trim())
        .map(item => ({
          name: item.name.trim(),
          amount: (item.amount || 'to taste').trim()
        }));
    }

    if (steps && Array.isArray(steps)) {
      recipe.steps = steps
        .filter(s => s && typeof s === 'string' && s.trim().length > 0)
        .map(s => s.trim());
    }

    const updated = await recipe.save();
    res.json({ success: true, data: updated, message: 'Recipe updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/recipes/:id/like
// @desc    Increment or decrement like counter
router.post('/:id/like', async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    const delta = action === 'unlike' ? -1 : 1;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    recipe.likes = Math.max(0, (recipe.likes || 0) + delta);
    await recipe.save();

    res.json({
      success: true,
      likes: recipe.likes,
      message: action === 'unlike' ? 'Recipe unliked' : 'Recipe liked!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, message: 'Recipe deleted successfully', data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
