import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import signBg from '../assets/sign.png';

export const Login: React.FC = () => {
  const { login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Google Sign In Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleCredentialResponse = useCallback(async (response: any) => {
    if (!response?.credential) return;
    setLoading(true);
    try {
      const result = await loginWithOAuth('google', { credential: response.credential });
      if (result.success) {
        if (result.user?.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Google authentication failed');
      }
    } catch {
      setError('An error occurred during Google authentication.');
    } finally {
      setLoading(false);
    }
  }, [loginWithOAuth, navigate]);

  useEffect(() => {
    if (!googleClientId) return;

    const setupGoogle = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
        });

        const btnDiv = document.getElementById('googleNativeBtn');
        if (btnDiv) {
          btnDiv.innerHTML = '';
          (window as any).google.accounts.id.renderButton(btnDiv, {
            theme: 'outline',
            size: 'large',
            width: 250,
            text: 'continue_with',
            shape: 'pill',
          });
        }
      }
    };

    setupGoogle();
    const timer = setTimeout(setupGoogle, 500);
    return () => clearTimeout(timer);
  }, [googleClientId, handleGoogleCredentialResponse]);

  const handleOAuth = async (provider: 'google' | 'github') => {
    if (provider === 'google') {
      setError('');
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id && googleClientId) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
          (window as any).google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Trigger click on official Google button if prompt is dismissed
              const officialBtn = document.querySelector('#googleNativeBtn div[role="button"]') as HTMLElement;
              if (officialBtn) {
                officialBtn.click();
              } else {
                setShowGoogleModal(true);
              }
            }
          });
          return;
        } catch (err) {
          console.error('Google prompt error:', err);
        }
      }
      setShowGoogleModal(true);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await loginWithOAuth(provider);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'OAuth authentication failed');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) {
      setError('Please enter a valid Google email address');
      return;
    }
    setShowGoogleModal(false);
    setLoading(true);
    try {
      const result = await loginWithOAuth('google', {
        email: googleEmail,
        fullName: googleName || googleEmail.split('@')[0],
      });
      if (result.success) {
        if (result.user?.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Google authentication failed');
      }
    } catch (err) {
      setError('An error occurred during Google authentication.');
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user?.role === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans antialiased text-[#091e22]">
      {/* Left side: Premium illustration & Info panel */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between p-12 relative overflow-hidden select-none bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${signBg})` }}
      >
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-[#091e22]/50 backdrop-blur-[1px] z-0"></div>

        {/* Top brand logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg flex items-center justify-center">
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
          <span className="font-semibold text-xl tracking-tight text-white">Guild Code</span>
        </div>

        {/* Center slogans */}
        <div className="my-auto max-w-[440px] mx-auto w-full relative z-10 text-center">
          <h3 className="font-extrabold text-2xl mb-3 tracking-tight text-white drop-shadow-md">
            Engineering the future together.
          </h3>
          <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto drop-shadow-sm font-medium">
            Join a verified collective of high-caliber developers building the next generation of open infrastructure.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-white/70 text-xs">
          &copy; 2024 Guild Code Ecosystem. Built for developers.
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-between p-8 md:p-16 min-h-screen">
        <div></div> {/* Spacer */}

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-[#5c7075] text-sm">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* Error / Pending Message Alert */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm mb-6 flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
              />
              {email && !isEmailValid(email) && (
                <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 animate-pulse select-none flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Please enter a valid email address (e.g. name@domain.com)</span>
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs text-[#006655] hover:underline font-semibold"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                />
                 <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#006655] transition-colors focus:outline-none select-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {password && password.length < 6 && (
                <p className="text-[10px] text-red-500 font-bold mt-1.5 ml-1 animate-pulse select-none flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Password must be at least 6 characters long</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006655] hover:bg-[#004d40] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#006655]/30 dark:border-[#00a88a]/40"></div>
            </div>
            <span className="relative px-3 bg-white text-xs font-semibold text-[#5c7075] uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold"
            >
              {/* Google logo SVG */}
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
              onClick={() => handleOAuth('github')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold"
            >
              {/* GitHub logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-[#5c7075]">Don't have an account? </span>
            <Link to="/signup" className="text-[#006655] hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>

        {/* Right side footer */}
        <div className="flex justify-center gap-6 text-xs text-[#5c7075] mt-8">
          <a href="#help" className="hover:underline">Help Center</a>
          <a href="#status" className="hover:underline">Status</a>
          <a href="#privacy" className="hover:underline">Privacy</a>
        </div>
      </div>

      {/* Google Account OAuth Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in select-none">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#006655]/15 dark:border-[#00a88a]/20 relative">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Google Brand & Consent Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.1h3.99c2.34-2.16 3.69-5.32 3.69-8.72z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.99-3.1c-1.1.74-2.52 1.18-3.94 1.18-3.04 0-5.61-2.05-6.53-4.82H1.31v3.2A12 12 0 0 0 12 24z" />
                <path fill="#FBBC05" d="M5.47 14.35A7.16 7.16 0 0 1 5.06 12c0-.82.14-1.61.41-2.35v-3.2H1.31A12 12 0 0 0 0 12c0 1.94.47 3.79 1.31 5.55l4.16-3.2z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.31 6.8l4.16 3.2c.92-2.77 3.49-4.82 6.53-4.82z" />
              </svg>
              <span className="font-extrabold text-lg tracking-tight text-[#091e22]">Sign in to Guild Code</span>
            </div>

            <p className="text-xs text-center text-[#5c7075] mb-5">
              Guild Code Community Hub requests permission to access your basic Google profile details.
            </p>

            {/* Scope & Permissions Disclosure Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 space-y-3">
              <span className="text-[11px] font-bold text-[#091e22] uppercase tracking-wider block">
                Information to be shared:
              </span>
              <div className="space-y-2 text-xs text-[#5c7075]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#34A853]"></div>
                  <span>Your full name and Google email address</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#4285F4]"></div>
                  <span>Your Google profile picture & avatar</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Google Email Address *</label>
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#006655]/30 dark:border-[#00a88a]/40">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reject & Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#006655] hover:bg-[#004d40] text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Accept & Continue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
