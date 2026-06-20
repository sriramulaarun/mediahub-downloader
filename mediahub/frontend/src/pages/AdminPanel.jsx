import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Users, 
  Download, 
  DollarSign, 
  CreditCard, 
  Trash2, 
  ShieldAlert, 
  Loader2, 
  TrendingUp,
  Award 
} from 'lucide-react';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load admin statistics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    setActionLoadingId(userId + '_role');
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      await fetchStats();
    } catch (err) {
      alert('Failed to change user role.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePlan = async (userId, currentPlan) => {
    setActionLoadingId(userId + '_plan');
    const newPlan = currentPlan === 'premium' ? 'free' : 'premium';
    try {
      await api.put(`/admin/users/${userId}/subscription`, { plan: newPlan });
      await fetchStats();
    } catch (err) {
      alert('Failed to alter user subscription.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    setActionLoadingId(userId + '_delete');
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchStats();
    } catch (err) {
      alert('Failed to delete user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  const { metrics, users, platforms } = stats || {
    metrics: { total_users: 0, total_downloads: 0, active_premium_subscriptions: 0, estimated_monthly_revenue: 0 },
    users: [],
    platforms: []
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <p className="text-sm text-gray-400">Manage all registered users, monitor download spikes, and track simulated monthly revenue.</p>
      </div>

      {/* Global SaaS Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.total_users}</div>
            <div className="text-xs text-gray-400 mt-0.5">Total Users</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.total_downloads}</div>
            <div className="text-xs text-gray-400 mt-0.5">Total Downloads</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{metrics.active_premium_subscriptions}</div>
            <div className="text-xs text-gray-400 mt-0.5">Active Pro Plans</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">${metrics.estimated_monthly_revenue}</div>
            <div className="text-xs text-gray-400 mt-0.5">Estimated MRR</div>
          </div>
        </GlassCard>

      </div>

      {/* User Management Control Table */}
      <GlassCard className="p-6">
        <h3 className="text-md font-bold text-white mb-6">User Accounts Control List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-borderglass bg-cardbg bg-opacity-40 text-xxs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Membership Plan</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderglass">
              {users.map((u) => {
                const isRoleLoading = actionLoadingId === u.id + '_role';
                const isPlanLoading = actionLoadingId === u.id + '_plan';
                const isDeleteLoading = actionLoadingId === u.id + '_delete';
                
                return (
                  <tr key={u.id} className="hover:bg-cardbg hover:bg-opacity-10 transition-colors">
                    {/* User profile name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-white">{u.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-300">
                      {u.email}
                    </td>

                    {/* Role toggler */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleRole(u.id, u.role)}
                        disabled={isRoleLoading}
                        className={`px-3 py-1 rounded text-xxs font-bold cursor-pointer transition-all border
                          ${u.role === 'admin'
                            ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20'
                            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'}`}
                      >
                        {isRoleLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : u.role.toUpperCase()}
                      </button>
                    </td>

                    {/* Plan toggler */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePlan(u.id, u.subscription.plan)}
                        disabled={isPlanLoading}
                        className={`px-3 py-1 rounded text-xxs font-bold cursor-pointer transition-all border
                          ${u.subscription.plan === 'premium'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white'}`}
                      >
                        {isPlanLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : u.subscription.plan.toUpperCase()}
                      </button>
                    </td>

                    {/* Delete account */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={isDeleteLoading}
                        className="p-2 bg-red-500/5 border border-red-500/10 hover:bg-red-500/15 text-red-400 rounded-lg transition-all cursor-pointer"
                        title="Delete User"
                      >
                        {isDeleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminPanel;
