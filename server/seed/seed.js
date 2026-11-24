const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Recipe = require('../models/Recipe');

const sampleRecipes = [
  {
    title: 'Classic Neapolitan Margherita Pizza',
    description: 'Crispy blistered artisan crust topped with San Marzano tomato sauce, creamy fresh mozzarella, fragrant basil leaves, and a drizzle of extra-virgin olive oil.',
    author: 'Chef Marco Bellini',
    prepTime: 25,
    cookTime: 12,
    servings: 3,
    difficulty: 'Medium',
    category: 'Dinner',
    cuisine: 'Italian',
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegetarian', 'Italian Classic', 'Wood-Fired', 'Baking'],
    likes: 42,
    ingredients: [
      { name: 'Pizza dough ball (room temp)', amount: '350g' },
      { name: 'San Marzano canned crushed tomatoes', amount: '1 cup' },
      { name: 'Fresh Fior di Latte or Mozzarella (torn)', amount: '200g' },
      { name: 'Fresh basil leaves', amount: '10 leaves' },
      { name: 'Extra virgin olive oil', amount: '2 tbsp' },
      { name: 'Flaky sea salt & black pepper', amount: 'to taste' },
      { name: 'Semolina flour (for dusting)', amount: '2 tbsp' }
    ],
    steps: [
      'Preheat your oven with a baking stone or heavy steel sheet to maximum temperature (250°C / 480°F) for 45 minutes.',
      'Stretch pizza dough on a semolina-dusted counter using fingertips, pressing outwards while preserving a puffy 1-inch crust perimeter.',
      'Spoon crushed San Marzano tomatoes evenly across the dough center in gentle spirals.',
      'Scatter torn fresh mozzarella pieces over the sauce evenly, keeping moisture well distributed.',
      'Slide onto the scorching hot pizza stone. Bake for 8–12 minutes until crust blistered and cheese is bubbling and golden.',
      'Garnish immediately with fresh fragrant basil leaves and a generous drizzle of premium olive oil before slicing.'
    ]
  },
  {
    title: 'Creamy Shahi Paneer Makhani',
    description: 'Silky, restaurant-style cottage cheese cubes simmered in a velvety cashew, ripe tomato, and aromatic fenugreek (kasuri methi) butter gravy.',
    author: 'Radhika Patil',
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    category: 'Dinner',
    cuisine: 'Indian',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegetarian', 'Rich Curry', 'North Indian', 'Gluten-Free'],
    likes: 68,
    ingredients: [
      { name: 'Fresh Paneer cubes', amount: '400g' },
      { name: 'Ripe red tomatoes (pureed)', amount: '5 medium' },
      { name: 'Soaked cashew nuts', amount: '15 whole' },
      { name: 'Butter & Ghee', amount: '3 tbsp' },
      { name: 'Ginger-garlic paste', amount: '1.5 tbsp' },
      { name: 'Heavy cream', amount: '1/4 cup' },
      { name: 'Kashmiri red chili powder', amount: '1 tbsp' },
      { name: 'Garam masala & coriander powder', amount: '1 tsp each' },
      { name: 'Crushed Kasuri Methi (dried fenugreek)', amount: '1 tbsp' },
      { name: 'Honey or sugar (to balance acidity)', amount: '1 tsp' },
      { name: 'Salt', amount: 'to taste' }
    ],
    steps: [
      'Blend soaked cashews with 3 tablespoons warm water into a silk-smooth paste.',
      'Heat 2 tbsp butter in a heavy kadai; add ginger-garlic paste and sauté until golden and fragrant.',
      'Pour in fresh tomato puree, Kashmiri chili powder, coriander powder, and salt. Cook on medium flame until oil gently separates from gravy edges.',
      'Stir in the cashew paste and 1/2 cup warm water. Simmer on low heat for 7 minutes until gravy thickens into a velvet texture.',
      'Gently fold in fresh paneer cubes and let them absorb the flavors for 4 minutes without overcooking.',
      'Finish with heavy cream, honey, garam masala, and crush toasted kasuri methi between palms into the curry.',
      'Serve hot with garlic butter naan, jeera rice, or crisp tandoori roti.'
    ]
  },
  {
    title: 'Avocado & Poached Egg Sourdough Tartine',
    description: 'Golden toasted artisan sourdough slathered with citrus-infused mashed Hass avocado, perfectly runny poached eggs, feta crumbs, and chili crunch.',
    author: 'Chef Liam Sanders',
    prepTime: 10,
    cookTime: 6,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'American',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
    tags: ['High-Protein', 'Breakfast Favorite', 'Vegetarian', 'Quick 15-Min'],
    likes: 54,
    ingredients: [
      { name: 'Artisan sourdough bread slices (thick cut)', amount: '2 slices' },
      { name: 'Ripe Hass avocados', amount: '2' },
      { name: 'Farm fresh eggs', amount: '2' },
      { name: 'Fresh lemon juice', amount: '1 tbsp' },
      { name: 'Crumbled feta cheese', amount: '2 tbsp' },
      { name: 'Chili crunch oil or red pepper flakes', amount: '1 tsp' },
      { name: 'Extra virgin olive oil', amount: '1 tbsp' },
      { name: 'Flaky Maldon salt & coarse pepper', amount: 'pinch' }
    ],
    steps: [
      'Toast sourdough slices in a skillet with olive oil until golden brown and delightfully crunchy.',
      'In a small bowl, scoop avocados and mash coarsely with lemon juice, salt, and freshly cracked black pepper.',
      'Bring a small pot of water to a gentle bare simmer. Create a gentle whirlpool with a spoon and slide a cracked fresh egg into the center.',
      'Poach egg for 3 minutes for a warm, runny yolk center. Lift out carefully with a slotted spoon and blot on kitchen paper.',
      'Spread the seasoned avocado generously across warm sourdough toasts.',
      'Nestle the poached egg on top, crown with crumbled feta, microgreens, flaky salt, and spicy chili crunch oil.'
    ]
  },
  {
    title: 'Rainbow Roasted Veggie & Quinoa Buddha Bowl',
    description: 'Nourishing power bowl loaded with fluffy tri-color quinoa, maple-roasted sweet potatoes, charred broccoli florets, creamy avocado, and velvety tahini-lemon dressing.',
    author: 'Elena Rostova',
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: 'Easy',
    category: 'Lunch',
    cuisine: 'Mediterranean',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegan', 'Gluten-Free', 'Healthy Meal Prep', 'Fiber-Rich'],
    likes: 39,
    ingredients: [
      { name: 'Cooked tri-color quinoa', amount: '1.5 cups' },
      { name: 'Sweet potato (cubed)', amount: '1 large' },
      { name: 'Broccoli florets', amount: '1.5 cups' },
      { name: 'Canned chickpeas (rinsed & drained)', amount: '1 cup' },
      { name: 'Sliced avocado', amount: '1' },
      { name: 'Runny sesame tahini', amount: '3 tbsp' },
      { name: 'Fresh lemon juice', amount: '2 tbsp' },
      { name: 'Pure maple syrup', amount: '1 tsp' },
      { name: 'Smoked paprika & garlic powder', amount: '1 tsp each' },
      { name: 'Olive oil', amount: '2 tbsp' }
    ],
    steps: [
      'Preheat oven to 200°C (400°F). Toss sweet potato cubes and chickpeas with olive oil, smoked paprika, salt, and garlic powder.',
      'Spread evenly on a baking sheet and roast for 20 minutes until tender and crispy at the edges.',
      'Steam or roast broccoli florets for 8 minutes until bright green and tender-crisp.',
      'Whisk tahini, lemon juice, maple syrup, warm water, and pinch of salt in a ramekin until creamy and pourable.',
      'Divide warm quinoa between two bowls. Arrange roasted sweet potatoes, crispy chickpeas, broccoli, and sliced avocado around the base.',
      'Drizzle lavishly with lemon-tahini dressing and garnish with toasted sesame seeds.'
    ]
  },
  {
    title: 'Decadent Molten Chocolate Lava Cake',
    description: 'Warm dark chocolate souffle-style cake with an irresistible, flowing molten chocolate center, dusted with snowy powdered sugar and paired with vanilla bean gelato.',
    author: 'Chef Antoine Dubois',
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    difficulty: 'Hard',
    category: 'Dessert',
    cuisine: 'French',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Dessert', 'Chocolate Lovers', 'Date Night', 'Baking'],
    likes: 87,
    ingredients: [
      { name: '70% dark bittersweet chocolate (chopped)', amount: '120g' },
      { name: 'Unsalted European butter', amount: '100g' },
      { name: 'Confectioners powdered sugar', amount: '1/2 cup' },
      { name: 'Whole large eggs', amount: '2' },
      { name: 'Egg yolks (extra)', amount: '2' },
      { name: 'All-purpose flour', amount: '3 tbsp' },
      { name: 'Pure vanilla extract', amount: '1 tsp' },
      { name: 'Fine sea salt', amount: '1/4 tsp' },
      { name: 'Cocoa powder (for dusting ramekins)', amount: '1 tbsp' }
    ],
    steps: [
      'Preheat oven to 220°C (425°F). Generously butter two 6-oz ceramic ramekins and dust with cocoa powder, tapping out excess.',
      'Melt chopped dark chocolate and butter together in a heatproof glass bowl set over a gentle water bath; stir until glossy and let cool slightly.',
      'In a separate bowl, whisk whole eggs, egg yolks, powdered sugar, and salt with a hand whisk until pale and slightly frothy.',
      'Gently fold melted chocolate into the whipped eggs until homogenous.',
      'Sift all-purpose flour over batter and fold with a rubber spatula just until combined without overworking.',
      'Divide batter between prepared ramekins. Bake for exactly 11–12 minutes until sides are set but the center remains soft and wobbly.',
      'Let rest 2 minutes. Invert onto dessert plates carefully, dust with powdered sugar, and serve with vanilla gelato and raspberries.'
    ]
  },
  {
    title: 'Authentic Tokyo Shoyu Ramen',
    description: 'Deep savory dashi-chicken broth served with springy ramen noodles, tender braised chashu pork or marinated tofu, jammy ajitsuke tamago egg, and nori sheets.',
    author: 'Kenji Takahashi',
    prepTime: 30,
    cookTime: 40,
    servings: 2,
    difficulty: 'Hard',
    category: 'Dinner',
    cuisine: 'Asian',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80',
    tags: ['Asian Comfort', 'Soup & Noodles', 'Authentic', 'Hearty'],
    likes: 51,
    ingredients: [
      { name: 'Fresh Tokyo-style wavy ramen noodles', amount: '2 portions (240g)' },
      { name: 'Rich chicken or vegetable stock', amount: '4 cups' },
      { name: 'Dashi broth (kombu & bonito or shiitake)', amount: '1 cup' },
      { name: 'Japanese soy sauce (Shoyu tare)', amount: '4 tbsp' },
      { name: 'Mirin & sake', amount: '1 tbsp each' },
      { name: 'Aroma garlic-scallion oil', amount: '2 tbsp' },
      { name: 'Ajitsuke Tamago (marinated soft-boiled eggs)', amount: '2 halves' },
      { name: 'Crispy nori seaweed sheets', amount: '2 pieces' },
      { name: 'Menma (bamboo shoots) & sliced scallions', amount: '1/4 cup' }
    ],
    steps: [
      'Whisk soy sauce, mirin, sake, and finely grated ginger in a bowl to build the flavorful seasoning tare.',
      'Heat chicken stock and dashi together to a rolling simmer; keep piping hot.',
      'Cook fresh ramen noodles in a large pot of boiling water for 90 seconds until perfectly al dente. Drain thoroughly.',
      'In deep pre-warmed ramen bowls, add 2 tbsp shoyu tare and 1 tbsp fragrant scallion oil.',
      'Pour 2.5 cups of simmering hot broth into each bowl and stir gently.',
      'Fold drained noodles into the soup with chopsticks in a neat wave fold.',
      'Crown with sliced ajitsuke tamago egg, menma bamboo shoots, fresh scallions, nori seaweed, and sesame seeds.'
    ]
  },
  {
    title: 'Greek Village Salad (Horiatiki)',
    description: 'Crisp English cucumbers, vine-ripened tomatoes, Kalamata olives, thinly sliced red onion, and a generous block of authentic sheep feta seasoned with Greek oregano.',
    author: 'Eleni Kostas',
    prepTime: 12,
    cookTime: 0,
    servings: 3,
    difficulty: 'Easy',
    category: 'Salad',
    cuisine: 'Mediterranean',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Low-Carb', 'Salad', 'Fresh', 'No-Cook'],
    likes: 31,
    ingredients: [
      { name: 'Ripe vine tomatoes (cut into wedges)', amount: '4 medium' },
      { name: 'English cucumber (semi-peeled & sliced)', amount: '1 large' },
      { name: 'Red onion (thinly sliced half-moons)', amount: '1/2' },
      { name: 'Pitted Kalamata olives in brine', amount: '1/2 cup' },
      { name: 'Authentic Greek block feta cheese', amount: '150g' },
      { name: 'Extra virgin olive oil (Greek Kalamata)', amount: '3 tbsp' },
      { name: 'Red wine vinegar', amount: '1 tbsp' },
      { name: 'Dried wild Greek oregano', amount: '1 tsp' },
      { name: 'Sea salt flakes & capers', amount: 'to taste' }
    ],
    steps: [
      'Rinse tomatoes and cut into bite-sized rustic wedges. Place in a large shallow serving bowl.',
      'Score cucumber with fork tines, slice into thick rounds, and add to the bowl with Kalamata olives and capers.',
      'Soak thinly sliced red onion in cold water for 5 minutes to mellow sharpness, drain, and scatter over vegetables.',
      'Drizzle red wine vinegar and extra virgin olive oil over the fresh vegetables. Toss gently with a pinch of sea salt.',
      'Place whole or thick slabs of authentic block feta directly on top — traditional village style avoids crumbling feta beforehand.',
      'Sprinkle dried wild oregano generously over the feta slab and finish with a final swirl of olive oil.'
    ]
  },
  {
    title: 'Tropical Mango Passionfruit Smoothie Bowl',
    description: 'Thick sunshine smoothie blended from frozen Alphonso mango chunks, passionfruit pulp, and creamy coconut milk, topped with kiwi, chia seeds, and toasted granola.',
    author: 'Sunita Mehra',
    prepTime: 8,
    cookTime: 0,
    servings: 1,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1200&q=80',
    tags: ['Vegan', 'Gluten-Free', 'Smoothie Bowl', 'Summer Refresh'],
    likes: 47,
    ingredients: [
      { name: 'Frozen mango chunks (Alphonso or honey)', amount: '1.5 cups' },
      { name: 'Frozen banana slices', amount: '1 medium' },
      { name: 'Full-fat coconut milk or Greek yogurt', amount: '1/3 cup' },
      { name: 'Fresh passionfruit pulp', amount: '2 fruits' },
      { name: 'Crisp almond honey granola', amount: '3 tbsp' },
      { name: 'Fresh kiwi slices & blueberries', amount: '1/4 cup' },
      { name: 'Chia seeds & toasted coconut flakes', amount: '1 tbsp' }
    ],
    steps: [
      'Add frozen mango chunks, frozen banana slices, and coconut milk to a high-speed blender container.',
      'Blend on low using tamper to push fruit down into the blades until an ultra-thick, soft-serve ice cream texture is reached.',
      'Scoop vibrant yellow smoothie into a wide coconut or ceramic bowl and smooth the surface with the back of a spoon.',
      'Artfully line one side with crunchy granola, fresh kiwi wheels, and plump blueberries.',
      'Drizzle fresh tart passionfruit pulp with fragrant crunchy black seeds across the center.',
      'Sprinkle chia seeds and toasted coconut flakes. Enjoy immediately with a chilled spoon!'
    ]
  }
];

async function seedDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGO_URI missing in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected! Resetting recipes collection...');

    await Recipe.deleteMany({});
    console.log('Old records purged.');

    const inserted = await Recipe.insertMany(sampleRecipes);
    console.log(` Successfully seeded ${inserted.length} delicious community recipes into MongoDB Atlas!`);

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
