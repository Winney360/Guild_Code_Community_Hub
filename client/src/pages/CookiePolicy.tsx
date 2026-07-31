import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Banner */}
      <ScrollReveal>
        <div className="bg-gradient-to-r from-teal-700 to-[#006655] rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy & Storage Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Cookie & Storage Policy</h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Learn how Guild Code uses HTTP cookies and browser LocalStorage technologies to maintain active sessions, remember user preferences, and safeguard account access.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        {/* Intro */}
        <ScrollReveal delay={100}>
          <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-3">What Are Cookies & Storage Tokens?</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Cookies and browser LocalStorage are small data files placed on your device when visiting websites. They allow web applications to maintain state, recognize your device across page transitions, and store user preferences securely.
            </p>
          </div>
        </ScrollReveal>

        {/* Types of Cookies Used */}
        <ScrollReveal delay={150}>
          <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4">Categories of Cookies We Employ</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider">1. Strictly Necessary / Essential</span>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-[#006655] dark:text-emerald-400 font-bold text-[10px] rounded-full">Required</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Essential for platform security and user authentication (JWT session tokens). Without these, you would be unable to log in, create projects, or respond to collaboration requests.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider">2. Functionality & Preferences</span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold text-[10px] rounded-full">Functional</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Stores customization choices such as dark mode / light mode appearance, notification preferences, and search filters across sessions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider">3. Analytical & Performance</span>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-[10px] rounded-full">Analytics</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Aggregated, anonymized statistics helping our developer team identify page load bottlenecks, popular project categories, and feature utilization.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Third-Party Ad Free Assurance */}
        <ScrollReveal delay={200}>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#006655] text-white flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#091e22] dark:text-[#f1f5f9] text-base mb-1">No Third-Party Advertising Cookies</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Guild Code is built for developers. We do not host third-party advertisement banners or install tracking pixels from ad networks. Your data remains isolated within our ecosystem.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* How to Manage Cookies */}
        <ScrollReveal delay={250}>
          <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-3">Managing Your Preferences</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              You can clear or block cookies at any time directly through your web browser settings (Chrome, Firefox, Safari, Edge). Please note that disabling essential cookies may impact your ability to remain logged into your Guild Code dashboard.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-[#006655] dark:text-emerald-400">
              <Link to="/privacy" className="hover:underline">Read Privacy Policy &rarr;</Link>
              <span>•</span>
              <Link to="/terms" className="hover:underline">Read Terms of Service &rarr;</Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
