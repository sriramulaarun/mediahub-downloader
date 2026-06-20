import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Settings as SettingsIcon, 
  Key, 
  CreditCard, 
  Check, 
  AlertCircle,
  Loader2,
  Sparkles,
  Lock
} from 'lucide-react';

const Settings = () => {
  const { user, upgradeSubscription } = useAuth();
  
  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Subscription upgrade state
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState('');
  const [subError, setSubError] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    // Mock password change API success
    setTimeout(() => {
      setPasswordLoading(false);
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
    }, 1000);
  };

  const handleSubscriptionUpgrade = async (plan) => {
    setSubError('');
    setSubMessage('');
    setSubLoading(true);

    try {
      const response = await upgradeSubscription(plan);
      if (response.success) {
        setSubMessage(response.message || `Plan successfully updated to ${plan}!`);
        // Refresh after short delay to reload new context
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setSubError(response.error);
      }
    } catch (err) {
      setSubError('Failed to adjust plan subscription.');
    } finally {
      setSubLoading(false);
    }
  };

  const isPremium = user?.subscription?.plan === 'premium';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">Account Settings</h2>
        <p className="text-xs text-gray-400">Configure your password, notifications, and SaaS plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Change Password Panel */}
        <div className="md:col-span-6 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-borderglass pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              Update Password
            </h3>

            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg text-xxs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg text-xxs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Password updated successfully!
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 font-medium">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-slate-900/50 p-2.5 rounded-lg border border-borderglass focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-400 font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-900/50 p-2.5 rounded-lg border border-borderglass focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="glass-btn-primary py-2.5 text-xs font-semibold cursor-pointer mt-2"
              >
                {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Subscription Plan details */}
        <div className="md:col-span-6 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-borderglass pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              SaaS Subscription Plan
            </h3>

            {subError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 rounded-lg text-xxs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {subError}
              </div>
            )}

            {subMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg text-xxs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {subMessage}
              </div>
            )}

            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                <Sparkles className="w-24 h-24 text-indigo-400" />
              </div>
              
              <div className="text-xxs font-medium text-indigo-400">Current Plan Status</div>
              <div className="text-lg font-bold text-white uppercase">{user?.subscription?.plan || 'Free'} Member</div>
              <p className="text-xxs text-gray-400 mt-1 leading-relaxed">
                {isPremium 
                  ? 'You have unlimited downloads, highest server processing speeds, and 1080p Full HD video/audio transcoders enabled.' 
                  : 'You have limited formats (up to 720p). Upgrades unlock 1080p streams, download lists backups, and direct playlist queues.'}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {isPremium ? (
                <button
                  onClick={() => handleSubscriptionUpgrade('free')}
                  disabled={subLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  {subLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Downgrade to Free Plan'}
                </button>
              ) : (
                <button
                  onClick={() => handleSubscriptionUpgrade('premium')}
                  disabled={subLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-gradient text-white hover:opacity-95 font-semibold text-xs rounded-xl cursor-pointer transition-colors shadow-md shadow-indigo-600/30"
                >
                  {subLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Upgrade to Premium ($9.99/mo)'}
                </button>
              )}
            </div>

          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Settings;
