import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ThemeToggle } from './ThemeToggle.js';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `text-sm font-semibold transition-colors duration-200 py-1.5 relative ${
      isActive(path)
        ? 'text-[#006655]'
        : 'text-[#5c7075] hover:text-[#091e22]'
    }`;
  };

  const activeIndicator = (path: string) => {
    return isActive(path) ? (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006655] rounded-full"></span>
    ) : null;
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#006655]/10 p-1.5 rounded-lg text-[#006655]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-[#091e22]">
            Guild <span className="text-[#006655]">Code</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative">
            <Link to="/projects" className={linkClass('/projects')}>
              Projects
            </Link>
            {activeIndicator('/projects')}
          </div>
          <div className="relative">
            <Link to="/members" className={linkClass('/members')}>
              Members
            </Link>
            {activeIndicator('/members')}
          </div>
          <div className="relative">
            <Link to="/collaborate" className={linkClass('/collaborate')}>
              Ecosystem
            </Link>
            {activeIndicator('/collaborate')}
          </div>
          <div className="relative">
            <Link to="/events" className={linkClass('/events')}>
              Events
            </Link>
            {activeIndicator('/events')}
          </div>
        </div>

        {/* Right Side: CTA / Auth Links */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-[#006655] hover:bg-[#004d40] text-white font-semibold py-2 px-5 rounded-xl transition-all text-sm shadow-sm hover:shadow"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#5c7075] hover:text-[#091e22] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#006655] hover:bg-[#004d40] text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-sm shadow-sm hover:shadow"
              >
                Get Started
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Header Right wrapper */}
        <div className="flex md:hidden items-center gap-3">
          <div className="md:hidden">
            <ThemeToggle />
          </div>
          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#5c7075] hover:text-[#091e22] focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 animate-fadeIn">
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold ${isActive('/projects') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            Projects
          </Link>
          <Link
            to="/members"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold ${isActive('/members') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            Members
          </Link>
          <Link
            to="/collaborate"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold ${isActive('/collaborate') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            Ecosystem
          </Link>
          <Link
            to="/events"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold ${isActive('/events') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            Events
          </Link>

          <hr className="border-slate-100 my-1" />

          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#006655] text-white text-center py-2.5 rounded-xl font-semibold text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full border border-slate-200 text-center py-2.5 rounded-xl font-semibold text-sm text-[#5c7075]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#006655] text-white text-center py-2.5 rounded-xl font-semibold text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
