import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col z-10 overflow-hidden">
      {/* Visual background glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-[130px] animate-float-1" />
        <div className="absolute bottom-[25%] right-[5%] w-[35rem] h-[35rem] rounded-full bg-secondary/10 blur-[150px] animate-float-2" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-glow-gradient z-[-1]" />
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>

      {/* Page Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
