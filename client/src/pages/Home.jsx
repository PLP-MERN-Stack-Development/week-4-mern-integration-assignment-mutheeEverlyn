import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts for home page');
        const response = await postService.getAllPosts();
        console.log('Posts data received:', response);
        
        if (response?.success && Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('Invalid posts response format:', response);
          setError('Failed to load posts: Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getAuthorInfo = (author) => {
    if (!author) return { name: 'Unknown', initials: 'U' };
    
    if (typeof author === 'string') {
      return { name: author, initials: author.charAt(0).toUpperCase() };
    }
    
    if (typeof author === 'object') {
      const name = author.name || 'Unknown';
      return {
        name,
        initials: name.charAt(0).toUpperCase()
      };
    }
    
    return { name: 'Unknown', initials: 'U' };
  };

  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'string') return category;
    return category.name || 'Uncategorized';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h2>
          <p className="text-gray-600 mb-8">Be the first to share your thoughts!</p>
          <Link
            to="/create-post"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Create Post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
        <p className="mt-2 text-gray-600">Discover stories, thinking, and expertise from writers on any topic.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const authorInfo = getAuthorInfo(post.author);
          const categoryName = getCategoryName(post.category);
          const postId = post._id || post.id;
          
          return (
            <article key={postId} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {authorInfo.initials}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{authorInfo.name}</p>
                    <p className="text-sm text-gray-500">{categoryName}</p>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link to={`/posts/${postId}`} className="hover:text-primary-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <Link
                  to={`/posts/${postId}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
} 