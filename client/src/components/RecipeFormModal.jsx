import React, { useState, useEffect } from 'react';

const PRESET_IMAGES = [
  { label: '🍕 Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80' },
  { label: '🍛 Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80' },
  { label: '🍝 Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=80' },
  { label: '🥗 Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80' },
  { label: '🥞 Pancakes', url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1000&q=80' },
  { label: '🍰 Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80' },
  { label: '🍜 Noodles', url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1000&q=80' },
  { label: '🥑 Toast', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80' }
];

const RecipeFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'Italian',
    imageUrl: '',
    tagsString: ''
  });

  const [ingredients, setIngredients] = useState([
    { name: '', amount: '' },
    { name: '', amount: '' }
  ]);

  const [steps, setSteps] = useState(['', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        author: initialData.author || '',
        prepTime: initialData.prepTime || 15,
        cookTime: initialData.cookTime || 0,
        servings: initialData.servings || 2,
        difficulty: initialData.difficulty || 'Easy',
        category: initialData.category || 'Dinner',
        cuisine: initialData.cuisine || 'Italian',
        imageUrl: initialData.imageUrl || '',
        tagsString: initialData.tags ? initialData.tags.join(', ') : ''
      });

      if (initialData.ingredients && initialData.ingredients.length > 0) {
        setIngredients(initialData.ingredients.map((i) => ({ name: i.name, amount: i.amount })));
      }

      if (initialData.steps && initialData.steps.length > 0) {
        setSteps([...initialData.steps]);
      }
    } else {
      // Reset form
      setFormData({
        title: '',
        description: '',
        author: '',
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        difficulty: 'Easy',
        category: 'Dinner',
        cuisine: 'Italian',
        imageUrl: '',
        tagsString: ''
      });
      setIngredients([
        { name: '', amount: '' },
        { name: '', amount: '' }
      ]);
      setSteps(['', '']);
    }
  }, [initialData, isOpen]);

  // Handle generic inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Ingredients handlers
  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients((prev) => [...prev, { name: '', amount: '' }]);
  };

  const removeIngredientRow = (index) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  // Steps handlers
  const handleStepChange = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStepRow = () => {
    setSteps((prev) => [...prev, '']);
  };

  const removeStepRow = (index) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Recipe title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Recipe description is required');
      return;
    }

    const cleanIngredients = ingredients.filter((ing) => ing.name && ing.name.trim());
    if (cleanIngredients.length === 0) {
      setError('Please add at least one valid ingredient');
      return;
    }

    const cleanSteps = steps.filter((s) => s && s.trim());
    if (cleanSteps.length === 0) {
      setError('Please add at least one cooking instruction step');
      return;
    }

    const tagsArray = formData.tagsString
      ? formData.tagsString
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      author: formData.author.trim() || 'Community Chef',
      prepTime: Number(formData.prepTime) || 10,
      cookTime: Number(formData.cookTime) || 0,
      servings: Number(formData.servings) || 2,
      difficulty: formData.difficulty,
      category: formData.category,
      cuisine: formData.cuisine,
      imageUrl: formData.imageUrl.trim(),
      ingredients: cleanIngredients,
      steps: cleanSteps,
      tags: tagsArray
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload, initialData?._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="recipe-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <div className="form-header-title-wrap">
            <span className="header-icon">{isEditing ? '✏️' : '👨‍🍳'}</span>
            <h2 className="form-modal-title">
              {isEditing ? 'Edit Community Recipe' : 'Share a New Recipe'}
            </h2>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {error && <div className="form-error-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Basic Info Section */}
          <div className="form-section">
            <h4 className="form-section-title">1. Basic Details</h4>
            <div className="form-group">
              <label className="form-label">
                Recipe Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Creamy Tuscan Garlic Chicken"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Short Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                className="form-textarea"
                rows="2"
                placeholder="Give a brief, appetizing summary of your dish..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Chef / Author Name</label>
                <input
                  type="text"
                  name="author"
                  className="form-input"
                  placeholder="Your Name (e.g. Radhika Patil)"
                  value={formData.author}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Breakfast">🥞 Breakfast</option>
                  <option value="Lunch">🥗 Lunch</option>
                  <option value="Dinner">🍲 Dinner</option>
                  <option value="Dessert">🍰 Dessert</option>
                  <option value="Salad">🥑 Salad</option>
                  <option value="Beverage">🍹 Beverage</option>
                </select>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Cuisine</label>
                <select
                  name="cuisine"
                  className="form-select"
                  value={formData.cuisine}
                  onChange={handleChange}
                >
                  <option value="Italian">Italian</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Asian">Asian</option>
                  <option value="American">American</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="French">French</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  name="difficulty"
                  className="form-select"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Servings</label>
                <input
                  type="number"
                  name="servings"
                  className="form-input"
                  min="1"
                  max="50"
                  value={formData.servings}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Prep Time (mins)</label>
                <input
                  type="number"
                  name="prepTime"
                  className="form-input"
                  min="1"
                  value={formData.prepTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cook Time (mins)</label>
                <input
                  type="number"
                  name="cookTime"
                  className="form-input"
                  min="0"
                  value={formData.cookTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Food Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <div className="preset-images-strip">
                <span className="preset-label">Or pick a photo:</span>
                {PRESET_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="preset-btn"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: p.url }))}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Ingredients Section */}
          <div className="form-section">
            <div className="section-title-action-row">
              <h4 className="form-section-title">2. Ingredients List</h4>
              <button
                type="button"
                className="add-sub-item-btn"
                onClick={addIngredientRow}
              >
                ＋ Add Ingredient
              </button>
            </div>
            <p className="form-help-text">Specify each ingredient name and its measurement.</p>

            <div className="dynamic-inputs-container">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="ingredient-input-row">
                  <span className="row-index">{idx + 1}.</span>
                  <input
                    type="text"
                    className="form-input ing-name"
                    placeholder="Ingredient (e.g. Fresh Paneer cubes, Olive oil)"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input ing-amount"
                    placeholder="Amount (e.g. 200g, 2 tbsp)"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      className="delete-sub-item-btn"
                      onClick={() => removeIngredientRow(idx)}
                      title="Remove ingredient"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Instructions Section */}
          <div className="form-section">
            <div className="section-title-action-row">
              <h4 className="form-section-title">3. Cooking Instructions</h4>
              <button
                type="button"
                className="add-sub-item-btn"
                onClick={addStepRow}
              >
                ＋ Add Step
              </button>
            </div>
            <p className="form-help-text">Provide clear, sequential preparation and cooking instructions.</p>

            <div className="dynamic-inputs-container">
              {steps.map((step, idx) => (
                <div key={idx} className="step-input-row">
                  <span className="step-number-tag">Step {idx + 1}</span>
                  <textarea
                    rows="2"
                    className="form-textarea step-textarea"
                    placeholder={`Describe step ${idx + 1}...`}
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                  ></textarea>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      className="delete-sub-item-btn"
                      onClick={() => removeStepRow(idx)}
                      title="Remove step"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <h4 className="form-section-title">4. Tags & Dietary Labels</h4>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                name="tagsString"
                className="form-input"
                placeholder="e.g. Vegetarian, High-Protein, Quick-Dinner, Spicy"
                value={formData.tagsString}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-footer">
            <button
              type="button"
              className="modal-secondary-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-btn submit-recipe-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving Recipe...</span>
              ) : isEditing ? (
                <span>Update Recipe</span>
              ) : (
                <span>Publish Recipe 🚀</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormModal;
