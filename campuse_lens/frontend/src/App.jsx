import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import FeedPage from './pages/FeedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import MyPostsPage from './pages/MyPostsPage';
import WinnersPage from './pages/WinnersPage';
import PostDetailPage from './pages/PostDetailPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/winners" element={<WinnersPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/create" element={
              <ProtectedRoute><CreatePostPage /></ProtectedRoute>
            } />
            <Route path="/my-posts" element={
              <ProtectedRoute><MyPostsPage /></ProtectedRoute>
            } />
            <Route path="*" element={
              <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</h1>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>404 — Page not found</h2>
                <p style={{ color: 'var(--muted-fg)', marginBottom: '1.5rem' }}>Looks like you wandered off campus.</p>
                <a href="/" className="btn-primary">Go back to Feed</a>
              </div>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
