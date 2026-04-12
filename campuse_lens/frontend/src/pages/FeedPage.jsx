import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, RefreshCw } from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/posts?page=${p}&limit=10`);
      setPosts(res.data.data.posts);
      setPagination(res.data.data.pagination);
    } catch {
      setError('Could not load posts. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(page); }, [fetchPosts, page]);

  const handleVote = (updatedPost) => {
    setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
  };
  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div>
      {/* Hero banner */}
      <div style={{ background: 'var(--accent)', borderBottom: '2px solid var(--border-dark)', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div className="deco-circle deco-circle-md" style={{ background: 'var(--tertiary)', right: '8%', top: '-40px', opacity: 0.3 }} />
        <div className="deco-circle deco-circle-sm" style={{ background: 'var(--secondary)', right: '20%', bottom: '-20px', opacity: 0.4 }} />
        <div className="container" style={{ padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ color: 'white', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800 }}>Campus Feed 📣</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.4rem', fontSize: '1.05rem' }}>
                What's happening on your campus right now
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-icon" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.5)' }}
                onClick={() => fetchPosts(page)}>
                <RefreshCw size={15} color="white" strokeWidth={2.5} />
              </button>
              {isLoggedIn && (
                <button className="btn-primary" style={{ background: 'var(--tertiary)', color: 'var(--fg)', borderColor: 'var(--border-dark)' }}
                  onClick={() => navigate('/create')}>
                  <PenSquare size={16} strokeWidth={2.5} /> New Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="spinner" />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ background: '#EDE9FE' }}>
              <PenSquare size={24} color="var(--accent)" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)' }}>No posts yet!</h3>
            <p style={{ color: 'var(--muted-fg)' }}>Be the first to share something with your campus.</p>
            {isLoggedIn && <button className="btn-primary" onClick={() => navigate('/create')}>Create First Post</button>}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {posts.map((post, i) => (
                <PostCard key={post._id} post={post} index={i} onVote={handleVote} onDelete={handleDelete} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', alignItems: 'center' }}>
                <button className="btn-secondary" style={{ padding: '0.5rem 1.25rem' }}
                  disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span style={{ padding: '0.5rem 1rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {page} / {pagination.pages}
                </span>
                <button className="btn-secondary" style={{ padding: '0.5rem 1.25rem' }}
                  disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
