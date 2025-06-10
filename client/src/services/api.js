// api.js - API service for making requests to the backend

import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path
  : 'http://localhost:5000/api';  // In development, use local server

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API services
export const authService = {
  // Register user
  register: (userData) => api.post('/auth/register', userData),

  // Login user
  login: (userData) => api.post('/auth/login', userData),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Update user profile
  updateProfile: (userData) => api.put('/auth/updatedetails', userData),

  // Update password
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
};

// Post API services
export const postService = {
  // Get all posts
  getAllPosts: () => api.get('/posts'),

  // Get single post
  getPost: (id) => api.get(`/posts/${id}`),

  // Create post
  createPost: (postData) => api.post('/posts', postData),

  // Update post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),

  // Delete post
  deletePost: (id) => api.delete(`/posts/${id}`),

  // Get posts by category
  getPostsByCategory: async (category) => {
    try {
      console.log('API call for category:', category);
      const response = await api.get('/posts');
      console.log('All posts response:', response);
      
      if (response?.success && Array.isArray(response.data)) {
        // Filter posts by category name
        const categoryPosts = response.data.filter(post => {
          const postCategory = typeof post.category === 'string' 
            ? post.category 
            : post.category?.name;
          return postCategory?.toLowerCase() === category?.toLowerCase();
        });
        
        console.log('Filtered category posts:', categoryPosts);
        return {
          success: true,
          data: categoryPosts
        };
      }
      return {
        success: false,
        message: 'Invalid response format'
      };
    } catch (error) {
      console.error('Error in getPostsByCategory:', error);
      throw error;
    }
  },

  // Get posts by author
  getPostsByAuthor: (authorId) => api.get(`/posts/author/${authorId}`),
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: () => api.get('/categories'),

  // Create a new category
  createCategory: (categoryData) => api.post('/categories', categoryData),

  // Get category by ID
  getCategoryById: (id) => api.get(`/categories/${id}`),

  // Update a category
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),

  // Delete a category
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const commentService = {
  // Get comments for a post
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),

  // Create a new comment
  createComment: (commentData) => api.post('/comments', commentData),

  // Update an existing comment
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),

  // Delete a comment
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

export default api; 