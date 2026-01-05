import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-3 px-6 z-50 text-center">
      <p className="text-slate-500 text-xs font-light tracking-wide flex justify-center items-center flex-wrap gap-2">
        <span>&copy; 2025 Cytyos. All rights reserved.</span>
        <span className="hidden sm:inline mx-1 text-slate-700">|</span>
        
        <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
          Privacy Policy
        </Link>
        
        <span className="text-slate-700">|</span>
        
        <Link to="/terms" className="hover:text-cyan-400 transition-colors">
          Terms of Use
        </Link>
      </p>
    </footer>
  );
};