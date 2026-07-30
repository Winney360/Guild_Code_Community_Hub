import React from 'react';
import { Link } from 'react-router-dom';

export const CommunityGuidelines: React.FC = () => {
  const pillars = [
    {
      title: '1. Inclusivity & Respect',
      icon: (
        <svg className="w-6 h-6 text-[#006655] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: 'Guild Code is dedicated to offering a welcoming, harassment-free environment for all developers regardless of skill level, background, identity, or stack preference.',
    },
    {
      title: '2. Collaborative Integrity',
      icon: (
        <svg className="w-6 h-6 text-[#006655] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      description: 'Be transparent about project requirements, license terms, and contribution expectations. Credit co-authors and maintain open communication in team collaborations.',
    },
    {
      title: '3. Constructive Feedback',
      icon: (
        <svg className="w-6 h-6 text-[#006655] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: 'Review code submissions thoughtfully. Offer constructive suggestions rather than dismissal. Celebrate fellow developers’ achievements and learning journeys.',
    },
    {
      title: '4. Zero Tolerance for Spam & Abuse',
      icon: (
        <svg className="w-6 h-6 text-[#006655] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      description: 'Strict prohibition of spam project links, deceptive referral schemes, malicious code repositories, hate speech, dox attempts, or unsolicited self-promotion.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#006655] via-emerald-700 to-[#091e22] rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          Developer Ecosystem Standard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Community Guidelines & Code of Conduct</h1>
        <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
          Guild Code is designed to bring developers together to learn, build open-source software, and launch exciting products. We expect all community members to uphold these core guidelines.
        </p>
      </div>

      {/* Four Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {pillars.map((pillar, idx) => (
          <div key={idx} className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#1e2e30] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="font-bold text-base text-[#091e22] dark:text-[#f1f5f9] mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enforcement & Reporting */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#1e2e30] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-3">Reporting Violations</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            If you encounter content, projects, comments, or collaboration listings that breach these standards, please report them using the flag button on the post or contact our moderation queue.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="mailto:moderation@guildcode.dev"
              className="px-4 py-2 bg-[#006655] hover:bg-[#004d40] text-white font-bold rounded-xl shadow-xs transition-all"
            >
              Report via Email
            </a>
            <Link
              to="/dashboard/activity"
              className="px-4 py-2 bg-slate-100 dark:bg-[#1a292c] hover:bg-slate-200 text-[#091e22] dark:text-[#f1f5f9] font-bold rounded-xl transition-all"
            >
              View Activity & Alerts
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#1e2e30] rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-3">Moderation Actions</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Our moderation team reviews reported items in accordance with internal guidelines. Actions taken may include warning notices, removal of content/listings, temporary account suspension, or permanent ban for severe violations.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-[#006655] dark:text-emerald-400">
            <Link to="/terms" className="hover:underline">Terms of Service &rarr;</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:underline">Privacy Policy &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
