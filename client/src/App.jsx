import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import RecipeCard from './components/RecipeCard';
import RecipeDetailModal from './components/RecipeDetailModal';
import RecipeFormModal from './components/RecipeFormModal';
import Toast from './components/Toast';
import {
  fetchRecipes,
  fetchRecipeStats,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  toggleLikeRecipe
} from './services/api';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [cuisine, setCuisine] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('explore');

  // Modals state
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Liked recipes tracking (one like per user stored in localStorage)
  const [likedRecipeIds, setLikedRecipeIds] = useState(() => {
    try {
      const stored = localStorage.getItem('flavorverse_liked_recipes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('flavorverse_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('flavorverse_liked_recipes', JSON.stringify(likedRecipeIds));
  }, [likedRecipeIds]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('flavorverse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchRecipeStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not load recipe stats:', err.message);
    }
  }, []);

  // Load recipes based on current filters
  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        category,
        cuisine,
        difficulty,
        sortBy
      };

      const res = await fetchRecipes(params);
      if (res.success) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error('Failed to load recipes:', err);
      setError('Unable to reach the recipe server. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [search, category, cuisine, difficulty, sortBy]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Tab switching logic
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'popular') {
      setSortBy('popular');
      setCategory('All');
      setSearch('');
    } else if (tab === 'quick') {
      setSortBy('quickest');
      setCategory('All');
      setSearch('');
    } else {
      setSortBy('newest');
      setCategory('All');
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCuisine('All');
    setDifficulty('All');
    setSortBy('newest');
    setActiveTab('explore');
  };

  // Like handler with toggle (one like per person)
  const handleLike = async (recipeId) => {
    const isAlreadyLiked = likedRecipeIds.includes(recipeId);
    const action = isAlreadyLiked ? 'unlike' : 'like';
    const delta = isAlreadyLiked ? -1 : 1;

    // Update local user's liked IDs list
    setLikedRecipeIds((prev) =>
      isAlreadyLiked ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );

    // Optimistic state update in recipe list
    setRecipes((prev) =>
      prev.map((r) =>
        r._id === recipeId ? { ...r, likes: Math.max(0, (r.likes || 0) + delta) } : r
      )
    );

    // Update open modal if viewing this recipe
    if (selectedRecipe && selectedRecipe._id === recipeId) {
      setSelectedRecipe((prev) => ({
        ...prev,
        likes: Math.max(0, (prev.likes || 0) + delta)
      }));
    }

    try {
      const res = await toggleLikeRecipe(recipeId, action);
      if (res.success) {
        setRecipes((prev) =>
          prev.map((r) => (r._id === recipeId ? { ...r, likes: res.likes } : r))
        );
        showToast(action === 'like' ? 'Added to your favorites! ❤️' : 'Removed from favorites', 'info');
        loadStats();
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update on error
      setLikedRecipeIds((prev) =>
        isAlreadyLiked ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );
      showToast('Could not update like', 'error');
    }
  };

  // Recipe creation / edit handler
  const handleSaveRecipe = async (recipeData, recipeId) => {
    try {
      if (recipeId) {
        const res = await updateRecipe(recipeId, recipeData);
        if (res.success) {
          showToast('Recipe updated successfully! ✨', 'success');
          // If modal was open, refresh selectedRecipe
          if (selectedRecipe && selectedRecipe._id === recipeId) {
            setSelectedRecipe(res.data);
          }
        }
      } else {
        const res = await createRecipe(recipeData);
        if (res.success) {
          showToast('New recipe published to community! 🚀', 'success');
        }
      }
      setIsFormModalOpen(false);
      setEditingRecipe(null);
      loadRecipes();
      loadStats();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error saving recipe';
      showToast(msg, 'error');
      throw err;
    }
  };

  // Delete handler with confirmation
  const handleDeleteRecipe = async (recipeId, recipeTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${recipeTitle}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const res = await deleteRecipe(recipeId);
      if (res.success) {
        showToast(`"${recipeTitle}" deleted successfully.`, 'info');
        if (selectedRecipe && selectedRecipe._id === recipeId) {
          setSelectedRecipe(null);
        }
        loadRecipes();
        loadStats();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete recipe', 'error');
    }
  };

  // Open Edit modal
  const handleOpenEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormModalOpen(true);
  };

  // Open Create modal
  const handleOpenCreate = () => {
    setEditingRecipe(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        onOpenAddModal={handleOpenCreate}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section with platform statistics */}
        <HeroBanner stats={stats} />

        {/* Filter and Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          cuisine={cuisine}
          onCuisineChange={setCuisine}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          totalResults={recipes.length}
          onResetFilters={handleResetFilters}
        />

        {/* Recipe Grid & States */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Loading delicious community recipes...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Oops! Connection Issue</h3>
            <p className="error-message">{error}</p>
            <button className="primary-btn retry-btn" onClick={loadRecipes}>
              Retry Loading
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍳</div>
            <h3 className="empty-title">No Recipes Found</h3>
            <p className="empty-desc">
              We couldn't find any recipes matching your current filter criteria.
            </p>
            <div className="empty-actions">
              <button className="secondary-btn" onClick={handleResetFilters}>
                Clear All Filters
              </button>
              <button className="primary-btn" onClick={handleOpenCreate}>
                ＋ Add the First Recipe
              </button>
            </div>
          </div>
        ) : (
          <section className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                isLiked={likedRecipeIds.includes(recipe._id)}
                onSelect={(rec) => setSelectedRecipe(rec)}
                onLike={handleLike}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-icon">🍳</span>
            <span className="footer-name">FlavorVerse</span>
            <span className="footer-badge">MERN Stack Edition</span>
          </div>
          <p className="footer-copy">
            Crafted for CodeNova Internship (Task 4) • Built with React, Node.js, Express & MongoDB Atlas
          </p>
        </div>
      </footer>

      {/* Interactive Detail Modal (with Ingredient Checklist, Servings Scaler & Steps) */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isLiked={likedRecipeIds.includes(selectedRecipe._id)}
          onClose={() => setSelectedRecipe(null)}
          onLike={handleLike}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRecipe}
        />
      )}

      {/* Add / Edit Recipe Modal */}
      <RecipeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRecipe(null);
        }}
        onSubmit={handleSaveRecipe}
        initialData={editingRecipe}
      />

      {/* Non-intrusive Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default App;
