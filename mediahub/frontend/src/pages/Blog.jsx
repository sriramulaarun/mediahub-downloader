import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { Calendar, User, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/blog');
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to load blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadPost = async (slug) => {
    setLoading(true);
    try {
      const response = await api.get(`/blog?slug=${slug}`);
      setSelectedPost(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load article detail', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 relative z-10 text-left">
      
      {selectedPost ? (
        /* Blog Detail Reader */
        <article className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors duration-300 font-semibold mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles List
          </button>

          {selectedPost.image && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-borderglass shadow-lg">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 border-b border-borderglass pb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(selectedPost.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              MediaHub Editorial
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {selectedPost.title}
          </h1>

          <div className="text-sm text-gray-300 leading-relaxed space-y-4 pt-4 whitespace-pre-line">
            {selectedPost.content}
          </div>

        </article>
      ) : (
        /* Blog Posts Grid */
        <>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">MediaHub Blog</h2>
            <p className="max-w-xl mx-auto text-gray-400">Tips, technical breakdowns, and articles on downloading high-resolution social media clips.</p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {posts.map((post) => (
                <GlassCard key={post.id} className="p-0 overflow-hidden flex flex-col justify-between" hover={true}>
                  <div>
                    {post.image && (
                      <div className="aspect-video w-full bg-slate-900 overflow-hidden border-b border-borderglass">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    
                    <div className="p-5">
                      <div className="text-xxs text-indigo-400 font-semibold mb-2">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-borderglass/30 mt-2">
                    <button
                      onClick={() => handleReadPost(post.slug)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              No blog articles found. Seeding is in progress.
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Blog;
