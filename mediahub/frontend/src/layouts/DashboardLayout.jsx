import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import { Menu, X, Bell, User } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Route protection redirect
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
    }
  }, [isAuthenticated, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevents flashing dashboard before redirect
  }

  return (
    <div className="min-h-screen bg-darkbg text-textwhite flex relative overflow-hidden">
      
      {/* Background visual blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[25rem] h-[25rem] rounded-full bg-primary/5 blur-[120px] animate-float-1" />
        <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-secondary/5 blur-[140px] animate-float-2" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-darkbg z-50">
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-xl bg-cardbg bg-opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative z-10">
        
        {/* Dashboard Top Navbar */}
        <header className="h-16 border-b border-borderglass bg-darkbg bg-opacity-35 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white md:hidden cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold capitalize text-white">
              {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white rounded-xl bg-cardbg bg-opacity-40 hover:bg-opacity-80 transition-all border border-borderglass cursor-pointer">
              <Bell className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center gap-2 border-l border-borderglass pl-4">
              <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center font-bold text-white text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-300">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Route Panel content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
};

export default DashboardLayout;
