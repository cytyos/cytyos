import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-4 px-6 z-50 text-center">
      {/* Copyright and Links */}
      <p className="text-slate-500 text-xs font-light tracking-wide flex justify-center items-center flex-wrap gap-2 mb-2">
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

      {/* AI Disclaimer */}
      <p className="text-[10px] text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
        DISCLAIMER: Cytyos is an AI-powered research and analysis support tool. 
        Generated data, zoning interpretations, and financial estimates may contain errors and should be treated as preliminary. 
        Always verify information with official local sources and qualified professionals before making any investment or construction decisions.
      </p>
    </footer>
  );
};