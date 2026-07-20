import React from 'react';
import { Link } from 'react-router-dom';
import heroLogo from '../assets/hero.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Brand Logo & Copyright */}
        <div className="flex items-center gap-3">
          <img src={heroLogo} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
          <div className="flex flex-col items-center md:items-start gap-0.5">
            <span className="font-bold text-sm text-[#091e22] tracking-tight">Guild Code</span>
            <span className="text-xs text-[#5c7075]">
              &copy; {new Date().getFullYear()} Guild Code Ecosystem. Built for developers.
            </span>
          </div>
        </div>

        {/* Right Side: Links & Icons */}
        <div className="flex items-center gap-6 text-xs text-[#5c7075]">
          <Link to="/privacy" className="hover:text-[#091e22] transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-[#091e22] transition-colors">Terms</Link>
          <a href="#changelog" className="hover:text-[#091e22] transition-colors">Changelog</a>
          <a href="#status" className="hover:text-[#091e22] transition-colors">Status</a>
        </div>
      </div>
    </footer>
  );
};
