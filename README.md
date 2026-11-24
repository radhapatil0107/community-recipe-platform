# 🍳 FlavorVerse — Community Recipe Sharing Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-orange.svg)](https://reactjs.org/)
[![React 19](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Internship](https://img.shields.io/badge/CodeNova-Task%204-purple.svg)](https://codenova.in)

> **FlavorVerse** is a modern, responsive full-stack culinary community platform where food lovers and home chefs can discover handcrafted recipes, contribute their culinary creations, and follow interactive step-by-step cooking guides with live ingredient checklists and dynamic serving adjustments.

Developed by **Radhika Patil** as **Task 4** for the **CodeNova Remote Internship** (Full Stack Development Track, Batch 02).

---

## 🌟 Key Features

### 1. 🔍 Instant Search & Multi-Dimensional Filtering
- **Keyword Search:** Instant live filtering by recipe title, description, or ingredients (e.g. typing `"paneer"`, `"garlic"`, or `"chocolate"` finds all matching recipes without page reloads).
- **Category Filter Pills:** Seamless one-click filtering by category (`All`, `Breakfast`, `Lunch`, `Dinner`, `Dessert`, `Salad`, `Beverage`).
- **Cuisine & Difficulty Dropdowns:** Filter by international cuisines (Italian, Indian, Mexican, Asian, Mediterranean, French) and skill levels (`Easy`, `Medium`, `Hard`).
- **Smart Sorting:** Sort by *Newest First*, *Most Loved (Likes)*, *Quickest Total Time*, or *Alphabetical*.

### 2. 👨‍🍳 Interactive Kitchen Companion (Recipe Detail View)
- **Interactive Ingredient Checklist:** Check off ingredients with real-time checkboxes as you prep in the kitchen, complete with a visual progress bar (`X of Y ready`).
- **Step-by-Step Cooking Guide:** Numbered instructions that can be marked as completed as you cook, so you never lose your place.
- **Dynamic Servings Scaler:** Adjust portions using `+` and `−` controls; the platform automatically recalculates and scales ingredient quantities.
- **Printable Recipe View:** One-click print-friendly mode for physical recipe cards.

### 3. 📝 Recipe Contribution & Management
- **Full-Featured Creation Modal:** Home chefs can publish recipes with titles, descriptions, cook/prep times, servings, and dietary tags.
- **Dynamic Form Builders:** Add or remove multiple ingredient rows (`name` + `measurement`) and instruction steps on the fly.
- **Curated Photo Picker:** One-click food presets (Pizza, Pasta, Curry, Salad, Cake, Ramen, etc.) or custom image URL input.
- **Recipe Management:** In-place edit and delete capabilities with confirmation safeguards.

### 4. ❤️ Community Engagement & Statistics
- **Reactive Like Counter:** Instant heart button with smooth scale animation and persisted like count in MongoDB Atlas.
- **Live Platform Stats:** Real-time summary cards displaying total community recipes, total community likes, and global cuisines.
- **Dark & Light Themes:** High-contrast culinary dark theme with warm amber accents, paired with a clean parchment light mode.

---

## 📸 Screenshots Showcase

*(Add your screenshots in the `screenshots/` directory)*

| 1. Explore Feed & Search | 2. Category & Cuisine Filtering |
| :---: | :---: |
| ![Explore Feed](screenshots/dashboard-feed.png) | ![Filters](screenshots/category-filters.png) |

| 3. Interactive Detail & Ingredient Checklist | 4. Share Recipe Modal |
| :---: | :---: |
| ![Recipe Detail Checklist](screenshots/recipe-checklist.png) | ![Create Recipe](screenshots/recipe-modal.png) |

| 5. Dark & Light Theme Contrast |
| :---: |
| ![Theme Showcase](screenshots/theme-mode.png) |

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Axios, Custom Modular CSS Design System |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **Database** | MongoDB Atlas (Cloud Cluster) with Mongoose ODM |
| **Tools & Security** | Dotenv (environment isolation), CORS, Git & GitHub |

---

## 🔌 REST API Specification

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/recipes` | Fetch recipes with filtering & sorting | `?search=&category=&cuisine=&difficulty=&sortBy=` |
| `GET` | `/api/recipes/stats` | Get recipe count, likes count & categories breakdown | None |
| `GET` | `/api/recipes/:id` | Get full details for a single recipe | URL Parameter `:id` |
| `POST` | `/api/recipes` | Publish a new community recipe | `{ title, description, prepTime, cookTime, servings, difficulty, category, cuisine, ingredients: [{ name, amount }], steps: [String] }` |
| `PUT` | `/api/recipes/:id` | Update an existing recipe | Updated fields |
| `POST` | `/api/recipes/:id/like` | Increment / decrement recipe likes | `{ "action": "like" }` |
| `DELETE` | `/api/recipes/:id` | Delete a recipe | URL Parameter `:id` |

---

## 🚀 Quick Start Guide (Run Locally)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

### Step 1: Clone Repository
```bash
git clone https://github.com/radhapatil0107/community-recipe-platform.git
cd community-recipe-platform
```

---

### Step 2: Configure & Start Backend
1. Navigate to the `server/` directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in `server/` based on `.env.example`:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ee0sh6j.mongodb.net/recipeplatform?retryWrites=true&w=majority
   ```
3. *(Optional)* Seed the database with 8 authentic community recipes:
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *Server will run at `http://localhost:5001`.*

---

### Step 3: Start Frontend Client
1. Open a new terminal and navigate to `client/`:
   ```bash
   cd client
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 📂 Project Directory Structure

```text
task-4-recipe-platform/
├── client/                     # Frontend React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Modular UI Components
│   │   │   ├── FilterBar.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeDetailModal.jsx  # Interactive checklist & step progression
│   │   │   ├── RecipeFormModal.jsx    # Dynamic recipe creator/editor
│   │   │   └── Toast.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios API client
│   │   ├── App.css             # Culinary theme & responsive stylesheet
│   │   ├── App.jsx             # Main container & state management
│   │   ├── index.css           # Global CSS variables & typography
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Development server & proxy configuration
│
├── server/                     # Backend API (Node / Express)
│   ├── models/
│   │   └── Recipe.js           # Mongoose Recipe & Ingredient schema
│   ├── routes/
│   │   └── recipes.js          # REST endpoints (CRUD, likes, stats)
│   ├── seed/
│   │   └── seed.js             # 8 authentic community sample recipes
│   ├── .env.example            # Environment template (secrets safe)
│   ├── index.js                # Express app entry & database connector
│   └── package.json
│
├── screenshots/                # Application preview images for showcase
├── .gitignore                  # Git exclusion rules (node_modules, .env)
└── README.md                   # Comprehensive documentation
```

---

