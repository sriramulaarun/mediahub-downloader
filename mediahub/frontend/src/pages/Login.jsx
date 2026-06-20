import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';
import { Mail, Lock, AlertCircle, Loader2, KeyRound } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const showExpiredMsg = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    // Simulate fetching Google OAuth Profile Info
    const result = await loginWithGoogle('Google User', 'google.user@example.com');
    setLoading(false);

    if (result.success) {
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative z-10">
      <GlassCard className="max-w-md w-full p-8">
        
        {/* Header titles */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-2">Sign in to sync your download history & favorites</p>
        </div>

        {showExpiredMsg && (
          <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Session expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 pl-12 pr-4 py-3 rounded-xl border border-borderglass focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 pl-12 pr-4 py-3 rounded-xl border border-borderglass focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              required
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-btn-primary w-full py-3 text-sm font-semibold cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-borderglass" />
          <span className="flex-shrink mx-4 text-gray-500 text-xs uppercase">Or continue with</span>
          <div className="flex-grow border-t border-borderglass" />
        </div>

        {/* Simulated Google SSO button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-borderglass bg-white bg-opacity-5 hover:bg-opacity-10 text-white font-medium text-sm transition-all duration-300 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign In with Google
        </button>

        <p className="text-center text-xs text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Register now
          </Link>
        </p>

      </GlassCard>
    </div>
  );
};

export default Login;
