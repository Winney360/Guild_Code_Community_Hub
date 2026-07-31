import React from 'react';
import { Link } from 'react-router-dom';

interface Release {
  version: string;
  date: string;
  badge: string;
  summary: string;
  changes: { type: 'Feature' | 'Improvement' | 'Fix' | 'Security'; text: string }[];
}

export const Changelog: React.FC = () => {
  const releases: Release[] = [
    {
      version: 'v1.2.0',
      date: 'July 28, 2026',
      badge: 'Latest Release',
      summary: 'Complete legal framework integration, dark mode optimizations, enhanced multi-column footer, and live system status indicators.',
      changes: [
        { type: 'Feature', text: 'Added full Privacy Policy, Terms of Service, Cookie Policy, and Community Guidelines pages.' },
        { type: 'Feature', text: 'Created live System Status page monitoring API, WebSocket, and Database health.' },
        { type: 'Improvement', text: 'Redesigned Footer component with multi-column quick links, newsletter subscription box, and social links.' },
        { type: 'Fix', text: 'Optimized dark mode color variables across all cards, modals, and navigation headers.' },
        { type: 'Security', text: 'Enhanced JWT authentication token storage compliance in headers.' },
      ],
    },
    {
      version: 'v1.1.0',
      date: 'June 15, 2026',
      badge: 'Minor Update',
      summary: 'Admin Moderation Dashboard, member search filters, and expanded Community Events schedule.',
      changes: [
        { type: 'Feature', text: 'Admin Moderation Queue for reviewing reported projects and user submissions.' },
        { type: 'Feature', text: 'Added tech-stack skill filter pills in Members Directory.' },
        { type: 'Improvement', text: 'Interactive RSVP counter for developer workshops and hackathons.' },
        { type: 'Fix', text: 'Resolved avatar image crop modal canvas rendering ratio on mobile viewports.' },
      ],
    },
    {
      version: 'v1.0.0',
      date: 'May 01, 2026',
      badge: 'Major Launch',
      summary: 'Initial official release of Guild Code Ecosystem Hub.',
      changes: [
        { type: 'Feature', text: 'Launched Project Showcase with tag filtering, live demo URLs, and GitHub repo links.' },
        { type: 'Feature', text: 'Collaboration Marketplace for finding co-founders, contributors, and tech mentors.' },
        { type: 'Feature', text: 'User Profile dashboards with customizable avatars, bios, and tech stack badges.' },
      ],
    },
  ];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Feature':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'Improvement':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'Fix':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'Security':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#091e22] via-[#006655] to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Release Notes & Updates
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Platform Changelog</h1>
        <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
          Stay up to date with new features, bug fixes, performance improvements, and ecosystem changes introduced in Guild Code.
        </p>
      </div>

      {/* Release Timeline */}
      <div className="relative border-l-2 border-slate-200 dark:border-[#00a88a]/20 ml-4 sm:ml-6 space-y-10">
        {releases.map((release, idx) => (
          <div key={idx} className="relative pl-6 sm:pl-8">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#006655] border-4 border-white dark:border-[#0b1315] shadow-xs" />

            {/* Card */}
            <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9]">{release.version}</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-[#006655] dark:text-emerald-400 text-xs font-bold rounded-full">
                    {release.badge}
                  </span>
                </div>
                <span className="text-xs text-[#5c7075] font-medium">{release.date}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {release.summary}
              </p>

              {/* Items */}
              <div className="space-y-2 border-t border-[#006655]/30 dark:border-[#00a88a]/40 dark:border-[#00a88a]/20 pt-4">
                {release.changes.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold shrink-0 ${getTypeStyle(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-normal">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-[#1a292c] hover:bg-slate-200 dark:hover:bg-[#273b3e] text-[#091e22] dark:text-[#f1f5f9] rounded-xl text-xs font-bold transition-all"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};
