import React from 'react';

const GlassCard = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`
        bg-cardbg bg-opacity-25 
        backdrop-blur-md 
        border border-borderglass 
        rounded-2xl 
        shadow-glass shadow-glass-inset
        transition-all duration-300
        ${hover ? 'hover:bg-opacity-40 hover:border-white/20 hover:-translate-y-1 hover:shadow-indigo-500/10' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
