import React, { useState } from 'react';

const RecipeDetailModal = ({
  recipe,
  onClose,
  onLike,
  onEdit,
  onDelete
}) => {
  if (!recipe) return null;

  // Servings multiplier state
  const baseServings = recipe.servings || 2;
  const [currentServings, setCurrentServings] = useState(baseServings);

  // Checked ingredients tracker
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Completed steps tracker
  const [completedSteps, setCompletedSteps] = useState({});

  // Local like state for smooth animation
  const [likesCount, setLikesCount] = useState(recipe.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetChecklist = () => {
    setCheckedIngredients({});
    setCompletedSteps({});
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setLikesCount((prev) => prev + 1);
    try {
      await onLike(recipe._id);
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  // Helper to dynamically scale ingredient amounts if they contain numbers
  const scaleAmount = (amountStr) => {
    if (!amountStr || currentServings === baseServings) return amountStr;
    const ratio = currentServings / baseServings;

    // Match numbers (including decimals or fractions)
    return amountStr.replace(/(\d+(\.\d+)?)/g, (match) => {
      const val = parseFloat(match);
      if (isNaN(val)) return match;
      const scaled = val * ratio;
      // Round nicely: 2 decimals if needed, or integer
      return Math.round(scaled * 10) / 10;
    });
  };

  const totalIngredients = recipe.ingredients?.length || 0;
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const ingredientsProgress = totalIngredients > 0 ? Math.round((checkedCount / totalIngredients) * 100) : 0;

  const totalSteps = recipe.steps?.length || 0;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const stepsProgress = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="recipe-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header Bar */}
        <div className="modal-top-bar">
          <div className="top-bar-tags">
            <span className="modal-tag category">{recipe.category}</span>
            <span className="modal-tag cuisine">🌍 {recipe.cuisine}</span>
            <span className={`modal-tag difficulty diff-${recipe.difficulty?.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Hero Banner */}
        <div className="modal-hero">
          <img
            src={recipe.imageUrl || fallbackImage}
            alt={recipe.title}
            className="modal-hero-image"
          />
          <div className="modal-hero-overlay"></div>
          <div className="modal-hero-text">
            <h2 className="modal-recipe-title">{recipe.title}</h2>
            <p className="modal-recipe-desc">{recipe.description}</p>
            <div className="modal-meta-row">
              <span className="meta-pill">👤 Shared by {recipe.author || 'Community Chef'}</span>
              <span className="meta-pill">⏱️ Prep: {recipe.prepTime}m</span>
              <span className="meta-pill">🔥 Cook: {recipe.cookTime}m</span>
              <span className="meta-pill">⏱️ Total: {(recipe.prepTime || 0) + (recipe.cookTime || 0)}m</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Servings Scaler */}
        <div className="detail-controls-row">
          <div className="servings-scaler-box">
            <span className="scaler-label">Servings:</span>
            <div className="scaler-controls">
              <button
                className="scaler-btn"
                onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                title="Decrease servings"
              >
                −
              </button>
              <span className="scaler-value">{currentServings}</span>
              <button
                className="scaler-btn"
                onClick={() => setCurrentServings((s) => s + 1)}
                title="Increase servings"
              >
                +
              </button>
            </div>
            {currentServings !== baseServings && (
              <span className="scaler-note">Quantities scaled from base {baseServings}</span>
            )}
          </div>

          <div className="modal-cta-group">
            <button
              className={`modal-like-btn ${isLiking ? 'pulsing' : ''}`}
              onClick={handleLike}
              title="Like this recipe"
            >
              ❤️ {likesCount} Likes
            </button>
            <button className="modal-secondary-btn" onClick={() => window.print()} title="Print recipe">
              🖨️ Print
            </button>
            <button
              className="modal-secondary-btn"
              onClick={() => {
                onClose();
                onEdit(recipe);
              }}
              title="Edit recipe"
            >
              ✏️ Edit
            </button>
            <button
              className="modal-danger-btn"
              onClick={() => {
                onClose();
                onDelete(recipe._id, recipe.title);
              }}
              title="Delete recipe"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Two-Column Recipe Body: Ingredients Checklist & Step-by-Step Cooking Instructions */}
        <div className="modal-body-grid">
          {/* Left Column: Interactive Ingredient Checklist */}
          <div className="ingredients-panel">
            <div className="section-header">
              <div className="section-title-wrap">
                <h3 className="section-title">🛒 Ingredients Checklist</h3>
                <span className="progress-badge">
                  {checkedCount}/{totalIngredients} ready ({ingredientsProgress}%)
                </span>
              </div>
              {checkedCount > 0 && (
                <button className="reset-checklist-link" onClick={resetChecklist}>
                  Reset
                </button>
              )}
            </div>

            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${ingredientsProgress}%` }}
              ></div>
            </div>

            <p className="section-hint">Click checkboxes as you measure and prep ingredients:</p>

            <ul className="checklist-list">
              {recipe.ingredients?.map((ing, idx) => {
                const isChecked = Boolean(checkedIngredients[idx]);
                return (
                  <li
                    key={idx}
                    className={`checklist-item ${isChecked ? 'completed' : ''}`}
                    onClick={() => toggleIngredient(idx)}
                  >
                    <input
                      type="checkbox"
                      className="styled-checkbox"
                      checked={isChecked}
                      onChange={() => toggleIngredient(idx)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="ingredient-info">
                      <span className="ingredient-name">{ing.name}</span>
                      <span className="ingredient-amount">{scaleAmount(ing.amount)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Column: Step-by-Step Cooking Guide */}
          <div className="instructions-panel">
            <div className="section-header">
              <div className="section-title-wrap">
                <h3 className="section-title">👨‍🍳 Cooking Instructions</h3>
                <span className="progress-badge">
                  {completedStepsCount}/{totalSteps} steps completed ({stepsProgress}%)
                </span>
              </div>
            </div>

            <div className="progress-bar-track">
              <div
                className="progress-bar-fill steps-fill"
                style={{ width: `${stepsProgress}%` }}
              ></div>
            </div>

            <p className="section-hint">Click on each step as you complete it to track your cooking progress:</p>

            <ol className="steps-list">
              {recipe.steps?.map((stepText, idx) => {
                const isDone = Boolean(completedSteps[idx]);
                return (
                  <li
                    key={idx}
                    className={`step-item ${isDone ? 'done' : ''}`}
                    onClick={() => toggleStep(idx)}
                  >
                    <div className="step-number-bubble">{isDone ? '✓' : idx + 1}</div>
                    <div className="step-content">
                      <p className="step-text">{stepText}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Tags Footer */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="modal-tags-footer">
            <span className="tags-label">Tags:</span>
            {recipe.tags.map((tag, idx) => (
              <span key={idx} className="recipe-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailModal;
