import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.data.user, res.data.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div className="deco-circle deco-circle-lg" style={{ background: '#D1FAE5', top: '-60px', left: '-80px', opacity: 0.5 }} />
      <div className="deco-circle deco-circle-md" style={{ background: '#FCE7F3', bottom: '40px', right: '-40px', opacity: 0.6 }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem', height: '4rem',
            background: 'var(--quaternary)',
            border: '2px solid var(--border-dark)',
            borderRadius: 'var(--radius-full)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-pop)',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <UserPlus size={22} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Join CampusLens</h1>
          <p style={{ color: 'var(--muted-fg)' }}>Your campus voice starts here 🎓</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="campus_hero"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@college.edu"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="At least 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}
              style={{ justifyContent: 'center', marginTop: '0.5rem', background: 'var(--quaternary)', borderColor: 'var(--border-dark)', color: 'var(--fg)' }}>
              {loading ? 'Creating account…' : '🎉 Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--muted-fg)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Login →</Link>
        </p>
      </div>
    </div>
  );
}
