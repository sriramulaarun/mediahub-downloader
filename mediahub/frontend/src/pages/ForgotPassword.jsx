import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative z-10 animate-fade-in">
      <GlassCard className="max-w-md w-full p-8 text-left">
        
        {/* Back navigation */}
        <Link 
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors duration-300 mb-6 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-sm text-gray-400 mt-2">
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="flex flex-col gap-6 items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
              <p className="text-sm text-gray-400 mt-2">
                We have sent recovery link and instructions to <strong>{email}</strong>.
              </p>
            </div>
            <Link to="/login" className="glass-btn-primary py-2.5 px-6 text-xs w-full">
              Back to Login
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="glass-btn-primary w-full py-3 text-sm font-semibold cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Recovery Email'
              )}
            </button>
          </form>
        )}

      </GlassCard>
    </div>
  );
};

export default ForgotPassword;
