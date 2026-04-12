import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.data.user, res.data.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background decorations */}
      <div className="deco-circle deco-circle-lg" style={{ background: '#EDE9FE', top: '-80px', right: '-80px', opacity: 0.5 }} />
      <div className="deco-circle deco-circle-md" style={{ background: '#FEF9C3', bottom: '40px', left: '-40px', opacity: 0.6 }} />
      <div className="deco-circle deco-circle-sm" style={{ background: '#FCE7F3', bottom: '160px', right: '10%', opacity: 0.7 }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '4rem', height: '4rem',
            background: 'var(--accent)',
            border: '2px solid var(--border-dark)',
            borderRadius: 'var(--radius-full)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-pop)',
            animation: 'float 3s ease-in-out infinite',
          }}>
            <LogIn size={22} color="white" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Welcome back!</h1>
          <p style={{ color: 'var(--muted-fg)' }}>Login to share your campus moments</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="your_username"
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted-fg)', cursor: 'pointer' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--muted-fg)', fontSize: '0.9rem' }}>
          New to CampusLens?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign up free →</Link>
        </p>
      </div>
    </div>
  );
}
