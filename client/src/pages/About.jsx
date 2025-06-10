import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Welcome to our modern blogging platform! We're passionate about creating a space where writers can share their thoughts, experiences, and expertise with the world.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          Our mission is to provide a platform that empowers writers to express themselves freely, connect with readers, and build meaningful communities around shared interests and passions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>A clean, modern interface for both writers and readers</li>
          <li>Easy-to-use tools for creating and managing content</li>
          <li>Categories to help organize and discover content</li>
          <li>Engagement features like comments and social sharing</li>
          <li>User profiles to build your personal brand</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join Our Community</h2>
        <p className="text-gray-600 mb-6">
          Whether you're a seasoned writer or just starting your journey, we welcome you to join our community. Share your stories, learn from others, and be part of a growing network of passionate individuals.
        </p>

        <div className="bg-primary-50 border border-primary-100 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-primary-900 mb-4">Ready to Start Writing?</h3>
          <p className="text-primary-700 mb-4">
            Create an account today and start sharing your stories with the world.
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
} 