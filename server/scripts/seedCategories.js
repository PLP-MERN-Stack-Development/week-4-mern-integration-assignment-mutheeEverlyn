const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  {
    name: 'Technology',
    description: 'Posts about technology, programming, and digital innovations'
  },
  {
    name: 'Lifestyle',
    description: 'Posts about daily life, habits, and personal development'
  },
  {
    name: 'Travel',
    description: 'Posts about travel experiences, destinations, and tips'
  },
  {
    name: 'Food',
    description: 'Posts about recipes, cooking, and food experiences'
  }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Created categories:', createdCategories);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCategories(); 