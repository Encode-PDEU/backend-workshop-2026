import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, MessageCircle, ArrowLeft, Send, User, Trash2 } from 'lucide-react';

function CommentBubble({ comment }) {
  return (
    <div style={{
      padding: '1rem 1.25rem',
      background: 'var(--muted)',
      border: '2px solid var(--border)',
      borderRadius: '16px 16px 16px 0',
      boxShadow: '3px 3px 0 var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
        <div style={{
          width: '1.75rem', height: '1.75rem',
          background: '#E2E8F0',
          border: '2px solid var(--border)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <User size={11} color="var(--muted-fg)" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--muted-fg)' }}>
          Anonymous
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--muted-fg)', marginLeft: 'auto' }}>
          {new Date(comment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      <p style={{ fontSize: '0.93rem', lineHeight: 1.6 }}>{comment.content}</p>
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data.data.post);
    } catch { setError('Post not found.'); }
    finally { setLoadingPost(false); }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await API.get(`/comments/post/${id}`);
      setComments(res.data.data.comments);
    } catch { /* silently ignore */ }
    finally { setLoadingComments(false); }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleVote = async (type) => {
    if (!isLoggedIn) return navigate('/login');
    try {
      const res = await API.post(`/posts/${id}/${type}`);
      setPost(res.data.data.post);
    } catch { /* ignore */ }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/');
    } catch { /* ignore */ }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await API.post('/comments', { postId: id, content: newComment });
      setComments(prev => [res.data.data.comment, ...prev]);
      setNewComment('');
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  if (loadingPost) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
      <div className="spinner" />
    </div>
  );

  if (error || !post) return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="alert alert-error">{error || 'Post not found.'}</div>
      <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
        ← Back to Feed
      </button>
    </div>
  );

  const score = (post.likes?.length || 0) - (post.dislikes?.length || 0);
  const hasLiked = isLoggedIn && post.likes?.includes(user?.username);
  const hasDisliked = isLoggedIn && post.dislikes?.includes(user?.username);
  const isOwner = user?.username === post.author;

  return (
    <div>
      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '760px' }}>
        {/* Back */}
        <button className="btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={15} strokeWidth={2.5} /> Back
        </button>

        {/* Post card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          {/* Author row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '3rem', height: '3rem',
                background: '#EDE9FE',
                border: '2px solid var(--accent)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '3px 3px 0 var(--accent)',
              }}>
                <User size={16} color="var(--accent)" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>@{post.author}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-fg)' }}>
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            {isOwner && (
              <button className="btn-danger" onClick={handleDelete}>
                <Trash2 size={14} strokeWidth={2.5} /> Delete
              </button>
            )}
          </div>

          {/* Content */}
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>{post.content}</p>

          {post.image && (
            <div style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--border-dark)' }}>
              <img src={post.image} alt="post" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
            </div>
          )}

          {/* Votes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '2px solid var(--border)', flexWrap: 'wrap' }}>
            <button className={`vote-btn ${hasLiked ? 'liked' : ''}`} onClick={() => handleVote('like')}>
              <ThumbsUp size={16} strokeWidth={2.5} /> {post.likes?.length || 0} Likes
            </button>
            <button className={`vote-btn ${hasDisliked ? 'disliked' : ''}`} onClick={() => handleVote('dislike')}>
              <ThumbsDown size={16} strokeWidth={2.5} /> {post.dislikes?.length || 0} Dislikes
            </button>
            <span className={`badge ${score >= 0 ? 'badge-violet' : 'badge-pink'}`} style={{ marginLeft: 'auto' }}>
              Score: {score >= 0 ? '+' : ''}{score}
            </span>
          </div>
        </div>

        {/* Comments section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem',
              background: 'var(--secondary)',
              border: '2px solid var(--border-dark)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '2px 2px 0 var(--border-dark)',
            }}>
              <MessageCircle size={14} color="white" strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: '1.3rem' }}>Comments</h2>
            <span className="badge badge-pink" style={{ fontSize: '0.72rem' }}>{comments.length}</span>
          </div>

          {/* Add comment */}
          {isLoggedIn ? (
            <form onSubmit={handleComment} style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                    Your comment (posted anonymously)
                  </label>
                  <textarea className="form-input" rows={3} placeholder="Share your thoughts anonymously…"
                    value={newComment} onChange={e => setNewComment(e.target.value)} maxLength={500} />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting || !newComment.trim()}
                  style={{ padding: '0.75rem', alignSelf: 'flex-end', minWidth: '3rem' }}>
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          ) : (
            <div style={{ marginBottom: '1.75rem', padding: '1rem 1.25rem', background: '#EDE9FE', border: '2px solid var(--accent)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontWeight: 600, color: 'var(--accent)' }}>
                <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Login</button>
                {' '}to leave an anonymous comment
              </p>
            </div>
          )}

          {/* Comments list */}
          {loadingComments ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div className="spinner" />
            </div>
          ) : comments.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem' }}>
              <div className="empty-state-icon">
                <MessageCircle size={20} color="var(--muted-fg)" strokeWidth={2.5} />
              </div>
              <p style={{ color: 'var(--muted-fg)', fontWeight: 600 }}>No comments yet. Be the first!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {comments.map(c => <CommentBubble key={c._id} comment={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
