import React from 'react';

const HeroBanner = ({ stats, onQuickCategorySelect }) => {
  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-sparkle">✨</span>
          <span>Open Culinary Network & Kitchen Companion</span>
        </div>
        <h1 className="hero-title">
          Discover, Cook & Share <span className="highlight-text">Delicious Recipes</span>
        </h1>
        <p className="hero-subtitle">
          Explore handcrafted recipes from food lovers worldwide. Step-by-step interactive cooking guides, dynamic ingredient checklists, and instant category filters.
        </p>

        {stats && (
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <span className="stat-number">{stats.totalRecipes || 0}</span>
              <span className="stat-label">Community Recipes</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-card">
              <span className="stat-number">{stats.totalLikes || 0} ❤️</span>
              <span className="stat-label">Community Likes</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-card">
              <span className="stat-number">{stats.cuisineCounts ? Object.keys(stats.cuisineCounts).length : 6}</span>
              <span className="stat-label">Global Cuisines</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
