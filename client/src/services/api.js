import axios from 'axios';

// When using Vite proxy, '/api/recipes' proxies to http://localhost:5001/api/recipes
const API_BASE = '/api/recipes';

export const fetchRecipes = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.cuisine && params.cuisine !== 'All') query.append('cuisine', params.cuisine);
  if (params.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
  if (params.sortBy) query.append('sortBy', params.sortBy);

  const queryString = query.toString();
  const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
  const res = await axios.get(url);
  return res.data;
};

export const fetchRecipeById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const fetchRecipeStats = async () => {
  const res = await axios.get(`${API_BASE}/stats`);
  return res.data;
};

export const createRecipe = async (recipeData) => {
  const res = await axios.post(API_BASE, recipeData);
  return res.data;
};

export const updateRecipe = async (id, recipeData) => {
  const res = await axios.put(`${API_BASE}/${id}`, recipeData);
  return res.data;
};

export const deleteRecipe = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const toggleLikeRecipe = async (id, action = 'like') => {
  const res = await axios.post(`${API_BASE}/${id}/like`, { action });
  return res.data;
};
