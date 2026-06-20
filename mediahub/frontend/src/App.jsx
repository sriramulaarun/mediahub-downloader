import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

// Layout wrappers
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Authenticated pages
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

// HOC for public page wrapping
const PublicRoute = ({ Component }) => (
  <MainLayout>
    <Component />
  </MainLayout>
);

// HOC for dashboard page wrapping
const PrivateRoute = ({ Component }) => (
  <DashboardLayout>
    <Component />
  </DashboardLayout>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Platform Routes */}
          <Route path="/" element={<PublicRoute Component={Home} />} />
          
          {/* SEO Custom Downloader Landing Pages */}
          <Route path="/youtube-downloader" element={<PublicRoute Component={Home} />} />
          <Route path="/instagram-downloader" element={<PublicRoute Component={Home} />} />
          <Route path="/mp3-downloader" element={<PublicRoute Component={Home} />} />
          <Route path="/facebook-downloader" element={<PublicRoute Component={Home} />} />
          <Route path="/video-downloader" element={<PublicRoute Component={Home} />} />

          <Route path="/blog" element={<PublicRoute Component={Blog} />} />
          <Route path="/contact" element={<PublicRoute Component={ContactUs} />} />
          <Route path="/terms" element={<PublicRoute Component={Terms} />} />
          <Route path="/privacy" element={<PublicRoute Component={PrivacyPolicy} />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<PublicRoute Component={Login} />} />
          <Route path="/register" element={<PublicRoute Component={Register} />} />
          <Route path="/forgot-password" element={<PublicRoute Component={ForgotPassword} />} />

          {/* Private User Dashboard Paths */}
          <Route path="/dashboard" element={<PrivateRoute Component={Dashboard} />} />
          <Route path="/history" element={<PrivateRoute Component={History} />} />
          <Route path="/favorites" element={<PrivateRoute Component={Favorites} />} />
          <Route path="/profile" element={<PrivateRoute Component={Profile} />} />
          <Route path="/settings" element={<PrivateRoute Component={Settings} />} />
          
          {/* Admin Control Center */}
          <Route path="/admin" element={<PrivateRoute Component={AdminPanel} />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
