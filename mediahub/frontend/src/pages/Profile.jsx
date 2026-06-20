import React from 'react';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/GlassCard';
import { User, Mail, Calendar, Shield, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-white">My Profile</h2>
        <p className="text-xs text-gray-400">Manage your account information and membership details.</p>
      </div>

      <GlassCard className="p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        {/* Avatar badge */}
        <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shadow-indigo-600/35 border-2 border-white/10 shrink-0">
          {getInitials(user?.name)}
        </div>
        
        <div className="flex-grow space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-lg font-bold text-white">{user?.name || 'User Name'}</h3>
            <span className={`self-center px-2 py-0.5 rounded text-xxs font-bold uppercase
              ${user?.role === 'admin' 
                ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' 
                : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'}`}>
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-indigo-400" />
            {user?.email}
          </p>
        </div>
      </GlassCard>

      {/* Profile settings card */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-md font-bold text-white border-b border-borderglass pb-3">Account Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xxs text-gray-500 font-medium">Joined On</div>
              <div className="text-white mt-0.5">{formatDate(user?.created_at)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xxs text-gray-500 font-medium">Security Clearances</div>
              <div className="text-white mt-0.5 capitalize">{user?.role} Access</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xxs text-gray-500 font-medium">Subscription Tier</div>
              <div className="text-white mt-0.5 capitalize flex items-center gap-1.5">
                {user?.subscription?.plan || 'Free'} Plan
                <span className="text-xxs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-semibold border border-emerald-500/20">
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </GlassCard>
    </div>
  );
};

export default Profile;
