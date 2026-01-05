import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-3 px-6 z-50 text-center">
      <p className="text-slate-500 text-xs font-light tracking-wide">
        &copy; 2025 Cytyos. All rights reserved. 
        <span className="mx-2">|</span>
        <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Use</a>
      </p>
    </footer>
  );
};