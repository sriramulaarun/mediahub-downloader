import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import { 
  Download, 
  Heart, 
  Database, 
  CreditCard,
  TrendingUp,
  Clock,
  Sparkles,
  Play,
  FileVideo,
  FileAudio
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatStorage = (bytes) => {
    if (!bytes) return '0.0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  const { stats, charts, timeline } = data || {
    stats: { total_downloads: 0, total_favorites: 0, storage_used_bytes: 0, subscription: { plan: 'free', status: 'active' } },
    charts: { platforms: [], days: [] },
    timeline: []
  };

  // Generate SVG Points for Line Chart
  const days = charts.days || [];
  const maxDownloads = Math.max(...days.map(d => d.downloads), 4);
  const chartWidth = 500;
  const chartHeight = 150;
  
  const points = days.map((d, index) => {
    const x = (index / (days.length - 1)) * chartWidth;
    const y = chartHeight - (d.downloads / maxDownloads) * (chartHeight - 30) - 10;
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M 0 ${chartHeight} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartWidth} ${chartHeight} Z` 
    : '';
  const lineD = points.length > 0
    ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Hello, {user?.name}</h2>
          <p className="text-sm text-gray-400">Here's a review of your downloads and cloud analytics.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {stats.subscription.plan === 'premium' ? 'Premium Subscriber' : 'Free Account'}
        </div>
      </div>

      {/* Key Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.total_downloads}</div>
            <div className="text-xs text-gray-400 mt-0.5">Total Downloads</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats.total_favorites}</div>
            <div className="text-xs text-gray-400 mt-0.5">Saved Favorites</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{formatStorage(stats.storage_used_bytes)}</div>
            <div className="text-xs text-gray-400 mt-0.5">Bandwidth Consumed</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-white capitalize">{stats.subscription.plan} Plan</div>
            <div className="text-xs text-gray-400 mt-0.5">Status: {stats.subscription.status}</div>
          </div>
        </GlassCard>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SVG Area Chart: Downloads over last 7 days */}
        <GlassCard className="p-6 lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                Download Activity
              </h3>
              <span className="text-xs text-gray-400">Past 7 Days</span>
            </div>
            
            {days.length > 0 ? (
              <div className="w-full relative mt-4">
                <svg className="w-full h-auto text-indigo-500" viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none">
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  <line x1="0" y1="70" x2={chartWidth} y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                  <line x1="0" y1="110" x2={chartWidth} y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

                  {/* SVG Area fill */}
                  <path d={pathD} fill="url(#chartGlow)" />
                  {/* SVG Line draw */}
                  <path d={lineD} stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Plot Dots */}
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2.5" />
                  ))}
                </svg>

                {/* X Axis Date labels */}
                <div className="flex justify-between mt-4 px-1 text-xxs text-gray-500 font-semibold">
                  {days.map((d, i) => (
                    <span key={i}>{d.date}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-sm text-gray-500">
                No activity logs available
              </div>
            )}
          </div>
        </GlassCard>

        {/* Platform distribution list */}
        <GlassCard className="p-6 lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-white mb-6">Platforms Distribution</h3>
            {charts.platforms && charts.platforms.length > 0 ? (
              <div className="flex flex-col gap-4">
                {charts.platforms.map((p) => {
                  // Calculate percentage relative to total
                  const pct = stats.total_downloads > 0 ? (p.value / stats.total_downloads) * 100 : 0;
                  return (
                    <div key={p.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-300">{p.name}</span>
                        <span className="text-white">{p.value} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-full
                            ${p.name === 'YouTube' ? 'bg-red-500' : ''}
                            ${p.name === 'Instagram' ? 'bg-pink-500' : ''}
                            ${p.name === 'Facebook' ? 'bg-blue-500' : ''}
                            ${p.name !== 'YouTube' && p.name !== 'Instagram' && p.name !== 'Facebook' ? 'bg-indigo-500' : ''}
                          `} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-sm text-gray-500">
                No platform logs found
              </div>
            )}
          </div>
        </GlassCard>

      </div>

      {/* Activity Timeline List */}
      <GlassCard className="p-6">
        <h3 className="text-md font-bold text-white flex items-center gap-2 mb-6">
          <Clock className="w-4.5 h-4.5 text-indigo-400" />
          Recent Activity Timeline
        </h3>
        
        {timeline.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {timeline.map((item, idx) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {idx !== timeline.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-borderglass" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border border-borderglass ring-8 ring-darkbg">
                          {item.format === 'mp3' ? <FileAudio className="w-4 h-4" /> : <FileVideo className="w-4 h-4" />}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-300">
                            Downloaded <span className="font-semibold text-white">"{item.title}"</span> ({item.format})
                          </p>
                          <span className="text-xxs font-medium text-indigo-400 mt-1 block">
                            Platform: {item.platform}
                          </span>
                        </div>
                        <div className="text-xxs text-gray-500 shrink-0 text-right">
                          {new Date(item.time).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-500">
            No downloads logged in your history yet.
          </div>
        )}
      </GlassCard>

    </div>
  );
};

export default Dashboard;
