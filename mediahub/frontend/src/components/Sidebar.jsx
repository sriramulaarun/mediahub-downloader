import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  History, 
  Heart, 
  Settings, 
  User, 
  ShieldCheck, 
  LogOut,
  Download,
  ArrowLeft
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Download History', path: '/history', icon: History },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-cardbg bg-opacity-20 backdrop-blur-lg border-r border-borderglass flex flex-col h-full">
      {/* Brand Header inside Dashboard */}
      <div className="p-6 border-b border-borderglass">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-gradient">
            <Download className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">MediaHub</span>
        </NavLink>
        <p className="text-xs text-gray-500 mt-1">SaaS Control Center</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                ${isActive 
                  ? 'bg-primary bg-opacity-20 border border-primary/30 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-cardbg hover:bg-opacity-40 border border-transparent'}
              `}
            >
              <Icon className="w-5 h-5 text-indigo-400" />
              {item.name}
            </NavLink>
          );
        })}

        {/* Admin Navigation (Conditional) */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 mt-6
              ${isActive 
                ? 'bg-purple-600 bg-opacity-20 border border-purple-500/30 text-white' 
                : 'text-purple-300 hover:text-white hover:bg-purple-900/10 border border-transparent'}
            `}
          >
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* User Footer Profile Card */}
      <div className="p-4 border-t border-borderglass bg-cardbg bg-opacity-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
