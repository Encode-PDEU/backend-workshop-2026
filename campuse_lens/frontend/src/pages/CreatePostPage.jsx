import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Send, ImagePlus, X } from 'lucide-react';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return setError('Post content cannot be empty!');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) formData.append('image', image);
      await API.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;
  const maxChars = 1000;
  const pct = (charCount / maxChars) * 100;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div className="deco-circle deco-circle-md" style={{ background: 'var(--tertiary)', top: '2rem', right: '5%', opacity: 0.25 }} />
      <div className="deco-circle deco-circle-sm" style={{ background: 'var(--secondary)', bottom: '4rem', left: '5%', opacity: 0.35 }} />

      <div style={{ width: '100%', maxWidth: '660px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '3.25rem', height: '3.25rem',
              background: 'var(--secondary)',
              border: '2px solid var(--border-dark)',
              borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-pop)',
              animation: 'wiggle 2s ease-in-out infinite',
            }}>
              <Send size={18} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '2rem' }}>New Post</h1>
              <p style={{ color: 'var(--muted-fg)' }}>Share what's on your campus mind</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Content */}
            <div className="form-group">
              <label className="form-label">What's happening? ✍️</label>
              <textarea className="form-input" rows={6} placeholder="Share a campus update, question, or thought..."
                value={content} onChange={e => setContent(e.target.value)} maxLength={maxChars} />
              {/* Char counter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct > 90 ? 'var(--secondary)' : 'var(--accent)', borderRadius: '2px', transition: 'width 0.2s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: pct > 90 ? 'var(--secondary)' : 'var(--muted-fg)', fontWeight: 700 }}>
                  {charCount}/{maxChars}
                </span>
              </div>
            </div>

            {/* Image upload */}
            <div className="form-group">
              <label className="form-label">Photo (optional)</label>
              {preview ? (
                <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '2px solid var(--border-dark)', boxShadow: 'var(--shadow-card)' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                  <button type="button" onClick={clearImage}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'white', border: '2px solid var(--border-dark)', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-pop)' }}>
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--muted-fg)', fontWeight: 600, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <ImagePlus size={20} strokeWidth={2.5} />
                  <span>Click to add an image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? 'Posting…' : <><Send size={16} strokeWidth={2.5} /> Publish Post</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
