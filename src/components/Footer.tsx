import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    // Alterado: py-1 (altura mínima) e z-40 (para ficar ABAIXO do Painel que é z-50)
    <footer className="w-full bg-[#0f111a] border-t border-gray-800/50 py-1.5 px-4 z-40 relative">
      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-[10px] text-gray-500 font-medium tracking-wide">
        <span>&copy; 2025 Cytyos</span>
        <span className="text-gray-700 hidden sm:inline">|</span>
        
        <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
        
        <span className="text-gray-700 hidden sm:inline">|</span>
        
        <span className="opacity-70 text-center max-w-lg truncate sm:overflow-visible">
           DISCLAIMER: AI results are estimates. Verify with professionals.
        </span>
      </div>
    </footer>
  );
};