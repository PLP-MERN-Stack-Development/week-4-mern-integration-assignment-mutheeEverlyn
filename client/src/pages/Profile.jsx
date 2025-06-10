import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const response = await postService.getAllPosts(1, 10, null, user._id);
        setUserPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        toast.error('Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Posts</h2>
          <button
            onClick={() => navigate('/create-post')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create New Post
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.category.name}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/posts/${post._id}`)}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userPosts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start sharing your thoughts with the world!
            </p>
            <button
              onClick={() => navigate('/create-post')}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 