import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/api';
import toast from 'react-hot-toast';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postService.getPost(id);
        console.log('Post response:', response);
        
        if (response && response._id) {
          setPost(response);
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await postService.deletePost(id);
      toast.success('Post deleted successfully');
      navigate('/posts');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

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

  const getCategoryName = (category) => {
    if (!category) return null;
    
    if (typeof category === 'string') {
      return category;
    }
    
    if (typeof category === 'object' && category !== null) {
      return category.name;
    }
    
    return null;
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
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const authorInfo = getAuthorInfo(post.author);
  const categoryName = getCategoryName(post.category);
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date';
  const isAuthor = post.author?._id === localStorage.getItem('userId');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.image && (
          <img
            src={post.image}
            alt={post.title || 'Post image'}
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{postDate}</span>
            {categoryName && (
              <>
                <span className="mx-2">•</span>
                <Link
                  to={`/category/${categoryName}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {categoryName}
                </Link>
              </>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title || 'Untitled Post'}
          </h1>
          
          <div className="prose max-w-none mb-8">
            {post.content || 'No content available'}
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                {authorInfo.initial}
              </div>
              <span className="ml-3 text-gray-700">{authorInfo.name}</span>
            </div>
            
            <div className="flex space-x-4">
              <Link
                to="/posts"
                className="text-gray-600 hover:text-primary-600"
              >
                ← Back to Posts
              </Link>
              {isAuthor && (
                <>
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Edit Post
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Post'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
} 