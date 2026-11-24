import React from 'react';

const CATEGORIES = [
  { id: 'All', label: 'All Recipes', icon: '🍽️' },
  { id: 'Breakfast', label: 'Breakfast', icon: '🥞' },
  { id: 'Lunch', label: 'Lunch', icon: '🥗' },
  { id: 'Dinner', label: 'Dinner', icon: '🍲' },
  { id: 'Dessert', label: 'Dessert', icon: '🍰' },
  { id: 'Salad', label: 'Salad', icon: '🥑' },
  { id: 'Beverage', label: 'Beverage', icon: '🍹' }
];

const CUISINES = [
  'All',
  'Italian',
  'Indian',
  'Mexican',
  'Asian',
  'American',
  'Mediterranean',
  'French',
  'Other'
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const FilterBar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  cuisine,
  onCuisineChange,
  difficulty,
  onDifficultyChange,
  sortBy,
  onSortByChange,
  totalResults,
  onResetFilters
}) => {
  const isFiltered =
    Boolean(search) ||
    category !== 'All' ||
    cuisine !== 'All' ||
    difficulty !== 'All' ||
    sortBy !== 'newest';

  return (
    <div className="filter-bar-container">
      {/* Search & Select Controls Row */}
      <div className="search-controls-row">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by recipe name, ingredient (e.g. paneer, cheese, garlic)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => onSearchChange('')} title="Clear search">
              ✕
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <div className="dropdown-group">
            <label className="dropdown-label">Cuisine:</label>
            <select
              className="styled-select"
              value={cuisine}
              onChange={(e) => onCuisineChange(e.target.value)}
            >
              {CUISINES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Cuisines' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <label className="dropdown-label">Difficulty:</label>
            <select
              className="styled-select"
              value={difficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Levels' : d}
                </option>
              ))}
            </select>
          </div>

          <div className="dropdown-group">
            <label className="dropdown-label">Sort by:</label>
            <select
              className="styled-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <option value="newest">🕒 Newest First</option>
              <option value="popular">❤️ Most Loved</option>
              <option value="quickest">⚡ Quickest Total Time</option>
              <option value="title">🔤 Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="category-chips-row">
        <div className="category-scroll-container">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${category === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              <span className="chip-icon">{cat.icon}</span>
              <span className="chip-label">{cat.label}</span>
            </button>
          ))}
        </div>

        {isFiltered && (
          <button className="reset-filters-btn" onClick={onResetFilters} title="Reset all filters">
            ↺ Reset
          </button>
        )}
      </div>

      {/* Results Counter Bar */}
      <div className="results-info-bar">
        <span className="results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'recipe' : 'recipes'}
          {category !== 'All' && ` in ${category}`}
          {cuisine !== 'All' && ` • ${cuisine}`}
          {difficulty !== 'All' && ` • ${difficulty}`}
          {search && ` matching "${search}"`}
        </span>
      </div>
    </div>
  );
};

export default FilterBar;
