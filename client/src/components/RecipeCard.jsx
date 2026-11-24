import React, { useState } from 'react';

const RecipeCard = ({ recipe, onSelect, onLike, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const getDifficultyColorClass = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'diff-easy';
      case 'Medium':
        return 'diff-medium';
      case 'Hard':
        return 'diff-hard';
      default:
        return 'diff-easy';
    }
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(recipe._id);
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  return (
    <article className="recipe-card" onClick={() => onSelect(recipe)}>
      <div className="card-image-wrapper">
        <img
          src={!imageError && recipe.imageUrl ? recipe.imageUrl : fallbackImage}
          alt={recipe.title}
          className="card-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="card-overlay-gradient"></div>

        <div className="card-badges-top">
          <span className="card-category-badge">{recipe.category}</span>
          <span className={`card-difficulty-badge ${getDifficultyColorClass(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        <button
          className={`card-like-btn ${isLiking ? 'pulsing' : ''}`}
          onClick={handleLikeClick}
          aria-label="Like recipe"
          title="Like recipe"
        >
          <span className="heart-icon">❤️</span>
          <span className="like-count">{recipe.likes || 0}</span>
        </button>
      </div>

      <div className="card-body">
        <div className="card-cuisine-meta">
          <span className="cuisine-tag">🌍 {recipe.cuisine}</span>
          <span className="author-tag">by {recipe.author || 'Community Chef'}</span>
        </div>

        <h3 className="card-title" title={recipe.title}>
          {recipe.title}
        </h3>

        <p className="card-description">
          {recipe.description}
        </p>

        <div className="card-metrics-row">
          <div className="metric-item" title="Total preparation & cooking time">
            <span className="metric-icon">⏱️</span>
            <span className="metric-text">{totalTime} mins</span>
          </div>
          <div className="metric-item" title="Servings">
            <span className="metric-icon">👥</span>
            <span className="metric-text">{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</span>
          </div>
          <div className="metric-item" title="Ingredient count">
            <span className="metric-icon">🥗</span>
            <span className="metric-text">{recipe.ingredients?.length || 0} items</span>
          </div>
        </div>

        <div className="card-footer-actions">
          <button
            className="card-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recipe);
            }}
          >
            <span>Cook Recipe</span>
            <span className="arrow-icon">→</span>
          </button>

          <div className="card-admin-actions">
            <button
              className="card-icon-action-btn edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              title="Edit recipe"
              aria-label="Edit recipe"
            >
              ✏️
            </button>
            <button
              className="card-icon-action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe._id, recipe.title);
              }}
              title="Delete recipe"
              aria-label="Delete recipe"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
