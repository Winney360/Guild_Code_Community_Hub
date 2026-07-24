import React from 'react';
import { Link } from 'react-router-dom';

export const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between font-sans text-[#091e22]">
      {/* Mini header */}
      <header className="px-8 py-4 border-b border-slate-100 bg-white flex justify-between items-center select-none">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#006655]/10 p-1.5 rounded-lg text-[#006655]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-[#091e22]">
            Guild <span className="text-[#006655]">Code</span>
          </span>
        </Link>
        <div className="flex gap-4 text-xs font-semibold text-[#5c7075]">
          <Link to="/status" className="hover:text-[#091e22]">Status</Link>
          <Link to="/docs" className="hover:text-[#091e22]">Documentation</Link>
          <a href="#support" className="bg-[#006655] hover:bg-[#004d40] text-white py-1.5 px-4 rounded-lg font-bold">Support</a>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex-grow flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
        
        {/* Left column (Info & CLI) */}
        <div className="max-w-md space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-[#006655] select-none">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            HTTP_STATUS_CODE: 404
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight select-none">
            Lost in the <br />
            <span className="text-[#006655]">Stack.</span>
          </h1>
          <p className="text-[#5c7075] text-sm leading-relaxed">
            The resource you are looking for has been moved, deleted, or never existed in this branch. Let's get you back to production.
          </p>

          <div className="flex flex-wrap gap-3 select-none">
            <Link
              to="/"
              className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return Home
            </Link>
            <Link
              to="/dashboard"
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Go to Dashboard
            </Link>
          </div>

          {/* Terminal window box (matching designs/404-pageNotFound.png) */}
          <div className="bg-[#091e22] text-[#e2e8f0] font-mono text-[10px] p-5 rounded-2xl border border-slate-800 shadow-lg select-none">
            <div className="flex gap-1.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400">
                <span className="text-emerald-400">$</span> guild fetch route --target "{window.location.pathname}"
              </p>
              <p className="text-red-400">Error: Route not found in manifest.json</p>
              <p className="text-slate-400">
                <span className="text-emerald-400">$</span> <span className="animate-pulse">_</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right column (Visual illustration card) */}
        <div className="relative w-full max-w-sm shrink-0 flex items-center justify-center">
          {/* Main Card */}
          <div className="border border-slate-100 bg-white rounded-3xl p-8 shadow-xl w-full flex flex-col items-center text-center relative z-20">
            <div className="w-full flex justify-between items-center text-[10px] text-slate-400 font-bold border-b border-slate-50 pb-4 mb-8 select-none">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                broken_logic.ts
              </span>
            </div>

            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6 select-none relative">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">!</span>
            </div>

            <h3 className="font-extrabold text-base mb-2 select-none">Null Pointer</h3>
            <p className="text-xs text-[#5c7075] leading-relaxed max-w-xs select-none">
              We couldn't resolve the request path to a valid entity.
            </p>
          </div>

          {/* Decorative backdrop blobs */}
          <div className="absolute w-80 h-80 bg-gradient-to-tr from-[#8be0eb]/20 to-[#a3f0f9]/20 rounded-full filter blur-2xl z-10 -bottom-10 -right-10" />
          <div className="absolute w-72 h-72 bg-[#006655]/5 rounded-full filter blur-2xl z-10 -top-10 -left-10" />
        </div>

      </main>

      {/* Footer bar */}
      <footer className="px-8 py-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-[#5c7075] select-none">
        <span>Guild Code &bull; © 2026 Guild Code Ecosystem. Built for developers.</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/status" className="hover:underline">System Status</Link>
        </div>
      </footer>
    </div>
  );
};
export default PageNotFound;
