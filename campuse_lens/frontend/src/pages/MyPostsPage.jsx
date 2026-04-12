import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { User, PenSquare } from 'lucide-react';

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMyPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/posts/my-posts');
      setPosts(res.data.data.posts);
    } catch {
      setError('Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMyPosts(); }, [fetchMyPosts]);

  const handleDelete = (id) => setPosts(prev => prev.filter(p => p._id !== id));
  const handleVote = (updated) => setPosts(prev => prev.map(p => p._id === updated._id ? updated : p));

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--tertiary)', borderBottom: '2px solid var(--border-dark)', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div className="deco-circle deco-circle-md" style={{ background: 'var(--accent)', right: '5%', top: '-30px', opacity: 0.25 }} />
        <div className="container" style={{ padding: '3rem 1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '4rem', height: '4rem',
              background: 'var(--fg)',
              border: '2px solid var(--border-dark)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-pop)',
            }}>
              <User size={22} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>My Posts</h1>
              <p style={{ color: 'var(--fg)', opacity: 0.7 }}>
                @{user?.username} · {posts.length} post{posts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/create')} style={{ marginLeft: 'auto' }}>
              <PenSquare size={16} strokeWidth={2.5} /> New Post
            </button>
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

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <PenSquare size={24} color="var(--muted-fg)" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)' }}>No posts yet</h3>
            <p style={{ color: 'var(--muted-fg)' }}>Start sharing — your campus is waiting!</p>
            <button className="btn-primary" onClick={() => navigate('/create')}>Write your first post</button>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} onVote={handleVote} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
