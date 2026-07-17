import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export const Signup: React.FC = () => {
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await signup({ fullName, email, password, confirmPassword });
      if (result.success) {
        // Spec 4.2: Show success message, do NOT auto login
        setSuccessMessage(result.message || 'Your account is pending admin approval.');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased text-[#091e22]">
      {/* Left side: Premium illustration & Info panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-[#3b93a2] via-[#5fb9c9] to-[#92e2eb] flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Top brand logo */}
        <div className="flex items-center gap-3 text-white">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 p-2 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="font-semibold text-xl tracking-tight">Guild Code</span>
        </div>

        {/* Center Illustration - Browser/Editor mockup (Glassmorphic) */}
        <div className="my-auto max-w-[440px] mx-auto w-full">
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-6 shadow-2xl relative aspect-[4/3] flex flex-col justify-between">
            {/* Browser top-bar */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
              </div>
              <div className="h-4 w-28 bg-white/20 rounded"></div>
            </div>

            {/* Central icon container */}
            <div className="flex-grow flex items-center justify-center">
              <div className="bg-white/10 p-4 rounded-xl border border-white/15">
                <svg
                  className="w-10 h-10 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom mockup layout */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="h-10 bg-white/15 rounded-lg"></div>
              <div className="h-10 bg-white/15 rounded-lg"></div>
              <div className="h-10 bg-white/15 rounded-lg"></div>
            </div>
          </div>

          {/* Slogans */}
          <div className="text-center mt-8 text-white">
            <h3 className="font-semibold text-lg mb-2">Engineering the future together.</h3>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm mx-auto">
              Join a verified collective of high-caliber developers building the next generation of open infrastructure.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-white/60 text-xs">
          &copy; 2024 Guild Code Ecosystem. Built for developers.
        </div>
      </div>

      {/* Right side: Signup form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-between p-8 md:p-16 min-h-screen">
        <div></div> {/* Spacer */}

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create an account</h2>
            <p className="text-[#5c7075] text-sm">
              Register below to apply for membership.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm mb-6 flex items-start gap-2 animate-pulse">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message Alert (Pending Approval) */}
          {successMessage && (
            <div className="bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] rounded-lg p-4 text-sm mb-6 flex items-start gap-2.5">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-semibold block mb-0.5">Application Submitted</span>
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006655] hover:bg-[#004d40] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-3 bg-white text-xs font-semibold text-[#5c7075] uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h3.99c2.34-2.16 3.69-5.32 3.69-8.72z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.99-3.1c-1.1.74-2.52 1.18-3.94 1.18-3.04 0-5.61-2.05-6.53-4.82H1.31v3.2A12 12 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.47 14.35A7.16 7.16 0 0 1 5.06 12c0-.82.14-1.61.41-2.35v-3.2H1.31A12 12 0 0 0 0 12c0 1.94.47 3.79 1.31 5.55l4.16-3.2z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.31 6.8l4.16 3.2c.92-2.77 3.49-4.82 6.53-4.82z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#5c7075]">Already have an account? </span>
            <Link to="/login" className="text-[#006655] hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>

        {/* Right side footer */}
        <div className="flex justify-center gap-6 text-xs text-[#5c7075] mt-6">
          <a href="#help" className="hover:underline">Help Center</a>
          <a href="#status" className="hover:underline">Status</a>
          <a href="#privacy" className="hover:underline">Privacy</a>
        </div>
      </div>
    </div>
  );
};
