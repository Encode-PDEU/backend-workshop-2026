import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Trophy, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MEDALS = [
  { label: '🥇 1st Place', color: '#FBBF24', shadow: '8px 8px 0 #1E293B', bg: '#FEF9C3', size: '1.15em' },
  { label: '🥈 2nd Place', color: '#94A3B8', shadow: '8px 8px 0 #F472B6', bg: '#F8FAFC', size: '1em' },
  { label: '🥉 3rd Place', color: '#CD7C2F', shadow: '8px 8px 0 #E2E8F0', bg: '#FFF7ED', size: '0.9em' },
];

const MARQUEE_WORDS = ['🏆 Winners', '✨ Top Posts', '🔥 Trending', '💜 Most Loved', '📣 Campus Stars'];

export default function WinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/winners');
        setWinners(res.data.data.winners);
      } catch {
        setError('Could not load winners.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* Marquee banner */}
      <div style={{ background: 'var(--fg)', borderBottom: '2px solid var(--border-dark)', overflow: 'hidden', padding: '0.5rem 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 15s linear infinite', whiteSpace: 'nowrap', gap: '3rem' }}>
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', color: 'white', opacity: 0.85 }}>{w}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'var(--tertiary)', borderBottom: '2px solid var(--border-dark)', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div className="deco-circle deco-circle-lg" style={{ background: 'var(--accent)', right: '-60px', top: '-60px', opacity: 0.2 }} />
        <div className="deco-circle deco-circle-md" style={{ background: 'var(--secondary)', left: '-40px', bottom: '-40px', opacity: 0.25 }} />
        <div className="container" style={{ padding: '3.5rem 1.5rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '5rem', height: '5rem',
            background: 'var(--fg)',
            border: '2px solid var(--border-dark)',
            borderRadius: '50%',
            boxShadow: '6px 6px 0 var(--border-dark)',
            marginBottom: '1rem',
            animation: 'float 2.5s ease-in-out infinite',
          }}>
            <Trophy size={28} color={MEDALS[0].color} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.5rem' }}>Hall of Fame</h1>
          <p style={{ color: 'var(--fg)', opacity: 0.7, fontSize: '1.05rem' }}>
            Top 3 most loved campus posts, ranked by likes − dislikes
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="spinner" />
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && winners.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ background: '#FEF9C3' }}>
              <Trophy size={24} color="var(--tertiary)" strokeWidth={2.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)' }}>No winners yet</h3>
            <p style={{ color: 'var(--muted-fg)' }}>Like posts to help the community pick its champions!</p>
          </div>
        )}

        {!loading && winners.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '720px', margin: '0 auto' }}>
            {winners.map((post, i) => {
              const medal = MEDALS[i] || MEDALS[2];
              const score = (post.likes?.length || 0) - (post.dislikes?.length || 0);
              return (
                <div key={post._id} className="card pop-in" onClick={() => navigate(`/posts/${post._id}`)}
                  style={{ padding: '2rem', cursor: 'pointer', boxShadow: medal.shadow, background: medal.bg, position: 'relative', overflow: 'hidden' }}
                >
                  {/* Rank badge pinned top-right */}
                  <div style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: medal.color,
                    border: '2px solid var(--border-dark)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.3rem 0.9rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: medal.size,
                    boxShadow: '2px 2px 0 var(--border-dark)',
                  }}>
                    {medal.label}
                  </div>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: '2.5rem', height: '2.5rem',
                      background: medal.color,
                      border: '2px solid var(--border-dark)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '2px 2px 0 var(--border-dark)',
                    }}>
                      <User size={14} color="var(--fg)" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>@{post.author}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)' }}>
                        {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <p style={{ lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '0.97rem' }}>
                    {post.content.length > 300 ? post.content.slice(0, 300) + '…' : post.content}
                  </p>

                  {/* Stats row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                      <ThumbsUp size={16} strokeWidth={2.5} color="var(--accent)" /> {post.likes?.length || 0}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                      <ThumbsDown size={16} strokeWidth={2.5} color="var(--secondary)" /> {post.dislikes?.length || 0}
                    </div>
                    <span style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                      color: score >= 0 ? 'var(--accent)' : 'var(--secondary)',
                    }}>
                      {score >= 0 ? '+' : ''}{score} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
