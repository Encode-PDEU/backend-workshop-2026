import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PenSquare, Home, Star, BookOpen, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <div style={{
            width: '2rem', height: '2rem',
            background: 'var(--accent)',
            borderRadius: '50%',
            border: '2px solid var(--border-dark)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '2px 2px 0 var(--border-dark)',
          }}>
            <BookOpen size={14} color="white" strokeWidth={2.5} />
          </div>
          Campus<span>Lens</span>
        </NavLink>

        {/* Nav Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <Home size={15} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} />
            {' '}<span>Feed</span>
          </NavLink>

          <NavLink to="/winners" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Star size={15} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} />
            {' '}<span>Winners</span>
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/my-posts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <User size={15} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} />
                {' '}<span>My Posts</span>
              </NavLink>
              <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PenSquare size={15} strokeWidth={2.5} style={{ display: 'inline', verticalAlign: 'middle' }} />
                {' '}<span>Post</span>
              </NavLink>
            </>
          )}

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                padding: '0.35rem 0.85rem',
                background: 'var(--tertiary)',
                border: '2px solid var(--border-dark)',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '2px 2px 0 var(--border-dark)',
              }}>
                👋 {user?.username}
              </div>
              <button className="btn-icon" onClick={handleLogout} title="Logout">
                <LogOut size={15} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <NavLink to="/login" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Login</NavLink>
              <NavLink to="/register" className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Sign up</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
