import React from 'react';

const Navbar = ({ onOpenAddModal, theme, onToggleTheme, activeTab, onSelectTab }) => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="brand" onClick={() => onSelectTab('explore')}>
          <div className="brand-icon">🍳</div>
          <div className="brand-text">
            <span className="brand-name">FlavorVerse</span>
            <span className="brand-tagline">Community Recipe Sharing</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => onSelectTab('explore')}
          >
            <span className="tab-icon">📖</span>
            <span className="tab-label">Explore Recipes</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => onSelectTab('popular')}
          >
            <span className="tab-icon">🔥</span>
            <span className="tab-label">Most Loved</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => onSelectTab('quick')}
          >
            <span className="tab-icon">⚡</span>
            <span className="tab-label">Quick & Easy</span>
          </button>
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="primary-btn add-recipe-btn" onClick={onOpenAddModal}>
            <span className="btn-icon">＋</span>
            <span className="btn-text">Share Recipe</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
