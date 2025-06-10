import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { postService, categoryService } from '../services/api';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await categoryService.getAllCategories();
        console.log('Categories response:', response);
        if (response && response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Invalid categories response:', response);
          toast.error('Failed to load categories: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error(error.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log('Submitting post data:', data);
      await postService.createPost(data);
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     hover:border-gray-400 transition-colors duration-200"
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows="6"
            {...register('content', { required: 'Content is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     hover:border-gray-400 transition-colors duration-200 resize-y"
            placeholder="Write your post content here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     hover:border-gray-400 transition-colors duration-200
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={loadingCategories}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {loadingCategories ? (
            <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="mt-1 text-sm text-red-600">No categories available</p>
          ) : null}
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            {...register('image')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     hover:border-gray-400 transition-colors duration-200"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-sm text-gray-500">
            Optional: Add an image URL to make your post more engaging
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md 
                     shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-primary-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || loadingCategories}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent 
                     rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 