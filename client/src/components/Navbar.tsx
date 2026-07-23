import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ThemeToggle } from './ThemeToggle.js';
import heroLogo from '../assets/hero.png';
import heroDarkLogo from '../assets/hero-dark.png';

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
          <img src={heroLogo} alt="Logo" className="w-10 h-10 object-contain shrink-0 dark:hidden" />
          <img src={heroDarkLogo} alt="Logo" className="w-10 h-10 object-contain shrink-0 hidden dark:block" />
          <span className="font-bold text-lg tracking-tight text-[#091e22]">
            Guild <span className="text-[#006655]">Code</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <Link to="/" className={`${linkClass('/')} flex items-center gap-1.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Home</span>
            </Link>
            {activeIndicator('/')}
          </div>
          <div className="relative">
            <Link to="/projects" className={`${linkClass('/projects')} flex items-center gap-1.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125zM9 3.75h6v1.5H9v-1.5z" />
              </svg>
              <span>Projects</span>
            </Link>
            {activeIndicator('/projects')}
          </div>
          <div className="relative">
            <Link to="/members" className={`${linkClass('/members')} flex items-center gap-1.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span>Members</span>
            </Link>
            {activeIndicator('/members')}
          </div>
          <div className="relative">
            <Link to="/collaborate" className={`${linkClass('/collaborate')} flex items-center gap-1.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641l-.318 1.236c-.125.484.348.908.829.724l3.063-1.177c.394-.152.825-.102 1.206.11a9.704 9.704 0 003.361.386z" />
              </svg>
              <span>Collaboration</span>
            </Link>
            {activeIndicator('/collaborate')}
          </div>
          <div className="relative">
            <Link to="/events" className={`${linkClass('/events')} flex items-center gap-1.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>Events</span>
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
            to="/"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold flex items-center gap-2 ${isActive('/') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span>Home</span>
          </Link>
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold flex items-center gap-2 ${isActive('/projects') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125zM9 3.75h6v1.5H9v-1.5z" />
            </svg>
            <span>Projects</span>
          </Link>
          <Link
            to="/members"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold flex items-center gap-2 ${isActive('/members') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <span>Members</span>
          </Link>
          <Link
            to="/collaborate"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold flex items-center gap-2 ${isActive('/collaborate') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641l-.318 1.236c-.125.484.348.908.829.724l3.063-1.177c.394-.152.825-.102 1.206.11a9.704 9.704 0 003.361.386z" />
            </svg>
            <span>Collaboration</span>
          </Link>
          <Link
            to="/events"
            onClick={() => setIsOpen(false)}
            className={`text-sm font-semibold flex items-center gap-2 ${isActive('/events') ? 'text-[#006655]' : 'text-[#5c7075]'}`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>Events</span>
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
