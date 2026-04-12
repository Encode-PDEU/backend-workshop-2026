import { ThumbsUp, ThumbsDown, MessageCircle, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ACCENT_COLORS = [
  { bg: '#EDE9FE', border: '#8B5CF6' },
  { bg: '#FCE7F3', border: '#F472B6' },
  { bg: '#FEF9C3', border: '#FBBF24' },
  { bg: '#D1FAE5', border: '#34D399' },
];

export default function PostCard({ post, onDelete, onVote, index = 0 }) {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const isOwner = user?.username === post.author;
  const hasLiked = isLoggedIn && post.likes?.includes(user?.username);
  const hasDisliked = isLoggedIn && post.dislikes?.includes(user?.username);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return navigate('/login');
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      onVote && onVote(res.data.data.post);
    } catch { /* ignore */ }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) return navigate('/login');
    try {
      const res = await API.post(`/posts/${post._id}/dislike`);
      onVote && onVote(res.data.data.post);
    } catch { /* ignore */ }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete && onDelete(post._id);
    } catch { /* ignore */ }
  };

  const score = (post.likes?.length || 0) - (post.dislikes?.length || 0);

  return (
    <div className="card pop-in" style={{ padding: '1.5rem', cursor: 'pointer', position: 'relative' }}
      onClick={() => navigate(`/posts/${post._id}`)}>

      {/* Author chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '2rem', height: '2rem',
            background: color.bg,
            border: `2px solid ${color.border}`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `2px 2px 0 ${color.border}`,
          }}>
            <User size={13} color={color.border} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem' }}>
            @{post.author}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted-fg)' }}>
          {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Content */}
      <p style={{ color: 'var(--fg)', lineHeight: 1.65, marginBottom: '1.1rem', fontSize: '0.95rem' }}>
        {post.content.length > 220 ? post.content.slice(0, 220) + '…' : post.content}
      </p>

      {/* Image */}
      {post.image && (
        <div style={{ marginBottom: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--border)' }}>
          <img src={post.image} alt="post" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }} />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
        <button className={`vote-btn ${hasLiked ? 'liked' : ''}`} onClick={handleLike}>
          <ThumbsUp size={14} strokeWidth={2.5} /> {post.likes?.length || 0}
        </button>
        <button className={`vote-btn ${hasDisliked ? 'disliked' : ''}`} onClick={handleDislike}>
          <ThumbsDown size={14} strokeWidth={2.5} /> {post.dislikes?.length || 0}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--muted-fg)', fontSize: '0.85rem', marginLeft: 'auto' }}>
          <MessageCircle size={14} strokeWidth={2.5} />
          <span>Comments</span>
        </div>
        {/* Score badge */}
        <span className={`badge ${score >= 0 ? 'badge-green' : 'badge-pink'}`} style={{ fontSize: '0.7rem' }}>
          Score: {score >= 0 ? '+' : ''}{score}
        </span>
        {isOwner && (
          <button className="btn-danger" onClick={handleDelete} style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}>
            <Trash2 size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
