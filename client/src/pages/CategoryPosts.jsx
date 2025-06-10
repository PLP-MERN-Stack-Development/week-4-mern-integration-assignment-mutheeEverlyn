import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';

export default function CategoryPosts() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (!category) {
        setError('Category not specified');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching posts for category:', category);
        const response = await postService.getAllPosts();
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
          if (categoryPosts.length === 0) {
            setError(`No posts found in category: ${category}`);
          }
          setPosts(categoryPosts);
        } else {
          console.error('Invalid posts response:', response);
          setError('Failed to load posts: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching category posts:', error);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category]);

  const getAuthorInfo = (author) => {
    if (!author) return { name: 'Unknown Author', initial: '?' };
    
    if (typeof author === 'string') {
      return {
        name: author,
        initial: author[0]?.toUpperCase() || '?'
      };
    }
    
    if (typeof author === 'object' && author !== null) {
      const authorName = author.name || 'Unknown Author';
      return {
        name: authorName,
        initial: authorName[0]?.toUpperCase() || '?'
      };
    }
    
    return { name: 'Unknown Author', initial: '?' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-x-4">
            <Link
              to="/categories"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Categories
            </Link>
            <Link
              to="/posts"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Posts in {category}
            </h1>
            <p className="text-gray-600">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>
          <Link
            to="/categories"
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Categories
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts found in this category
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to create a post in this category!
          </p>
          <Link
            to="/create-post"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Create Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => {
            const authorInfo = getAuthorInfo(post.author);
            const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date';
            
            return (
              <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title || 'Post image'}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{postDate}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title || 'Untitled Post'}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content || 'No content available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm">
                        {authorInfo.initial}
                      </div>
                      <span className="ml-2 text-sm text-gray-700">{authorInfo.name}</span>
                    </div>
                    
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
} 