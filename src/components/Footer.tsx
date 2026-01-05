import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-2 px-4 z-50">
      <p className="text-[10px] text-slate-500 font-light tracking-wide text-center flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
        <span>&copy; 2025 Cytyos</span>
        
        <span className="text-slate-800">|</span>
        
        <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
        
        <span className="text-slate-800 hidden sm:inline">|</span>
        
        <span className="text-slate-600 opacity-80">
           DISCLAIMER: AI decision support tool. Results are estimates and must be verified by professionals.
        </span>
      </p>
    </footer>
  );
};