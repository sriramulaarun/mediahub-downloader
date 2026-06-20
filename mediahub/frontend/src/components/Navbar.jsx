import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Download, Play, Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-darkbg bg-opacity-70 backdrop-blur-lg border-b border-borderglass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-gradient shadow-md shadow-indigo-600/40">
                <Download className="w-5 h-5 text-white absolute group-hover:translate-y-0.5 transition-transform duration-300" />
                <Play className="w-2.5 h-2.5 text-white absolute translate-y-[-1px] rotate-90 scale-75 opacity-90" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                MediaHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  text-sm font-medium transition-colors duration-300 hover:text-white
                  ${isActive && link.path !== '/' ? 'text-white border-b-2 border-primary pb-1' : 'text-gray-400'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Call to Actions / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="glass-btn-secondary py-2 px-4 text-sm flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary-light" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-xl border border-red-500/20 transition-all duration-300 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="glass-btn-primary py-2 px-4 text-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 bg-darkbg border-b border-borderglass bg-opacity-95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-gray-400 hover:text-white hover:bg-cardbg transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-borderglass flex flex-col gap-2 px-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-btn-secondary py-2 text-center flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary-light" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-gray-400 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="glass-btn-primary py-2 text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
