import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-3 px-4 z-50">
      <p className="text-[11px] text-gray-300 font-normal tracking-wide text-center flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
        <span>&copy; 2025 Cytyos</span>
        
        <span className="text-gray-600 hidden sm:inline">|</span>
        
        <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
        
        <span className="text-gray-600 hidden sm:inline">|</span>
        
        <span className="text-gray-500 max-w-xl truncate sm:overflow-visible sm:whitespace-normal">
           DISCLAIMER: AI results are estimates. Consult professionals before investing.
        </span>
      </p>
    </footer>
  );
};