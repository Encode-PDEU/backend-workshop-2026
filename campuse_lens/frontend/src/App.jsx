import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [authError, setAuthError] = useState('');

  // Logout utility
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setPosts([]);
  };

  // Auth Submit
  const handleAuth = async (endpoint) => {
    setAuthError('');
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.data.token);
        localStorage.setItem('token', data.data.token);
        fetchPosts();
      } else {
        setAuthError(data.message);
      }
    } catch (e) {
      setAuthError('Connection error (is backend running?).');
    }
  };

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data.posts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Post
  const handleCreatePost = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newPost }),
      });
      const data = await res.json();
      if (data.success) {
        setNewPost('');
        fetchPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Like Post
  const handleLike = async (id, type) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${id}/${type}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts(); // refresh
    } catch (e) {
      console.error(e);
    }
  };

  // Initial Data
  useEffect(() => {
    if (token) fetchPosts();
  }, [token]);

  if (!token) {
    return (
      <div className="auth-box">
        <h1>CampusLens Testing UI 🕵️</h1>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => handleAuth('login')}>Login</button>
          <button onClick={() => handleAuth('register')} style={{ marginLeft: 5 }}>Register</button>
        </div>
        {authError && <p style={{ color: 'red' }}>{authError}</p>}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>CampusLens (Authenticated)</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="create-post">
        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share something anonymously..." rows={3} />
        <button onClick={handleCreatePost}>Post to CampusLens</button>
      </section>

      <section className="posts-feed">
        <h2>Global Feed</h2>
        {posts.length === 0 ? <p>No posts yet! Be the first.</p> : null}
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <p className="post-author">By: <strong>{post.author}</strong></p>
            <p className="post-content">{post.content}</p>
            <div className="post-actions">
              <button onClick={() => handleLike(post._id, 'like')}>🔥 Hot ({post.likes.length})</button>
              <button onClick={() => handleLike(post._id, 'dislike')}>👎 Not ({post.dislikes.length})</button>
              <span className="post-score">Score: {post.likes.length - post.dislikes.length}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
