import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout } from '../components/LegalLayout.js';
import type { TocItem } from '../components/LegalLayout.js';
import { LegalSection } from '../components/LegalSection.js';
import { LegalContact } from '../components/LegalContact.js';

const icons = {
  cookie: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a9.75 9.75 0 109.75 9.75c0-1.053-1.636-1.813-2.135-2.867a.75.75 0 01.288-.843 1.5 1.5 0 001.41-1.556 9.75 9.75 0 00-9.313-4.484zM12 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8.25 15a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM14.25 9.75a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
    </svg>
  ),
  grid: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  sliders: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 16.5V13.5m0 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM18 10.5V3.75m0 16.5V10.5m0 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
};

const toc: TocItem[] = [
  { id: 'overview', label: '1. What Are Cookies & Storage Tokens?', icon: icons.info },
  { id: 'categories', label: '2. Categories of Cookies We Employ', icon: icons.grid },
  { id: 'noads', label: '3. No Third-Party Advertising Cookies', icon: icons.shield },
  { id: 'manage', label: '4. Managing Your Preferences', icon: icons.sliders },
];

export const CookiePolicy: React.FC = () => {
  return (
    <LegalLayout
      eyebrow="Privacy & Storage Compliance"
      eyebrowIcon={icons.cookie}
      title="Cookie & Storage Policy"
      description="Learn how Guild Code uses HTTP cookies and browser LocalStorage technologies to maintain active sessions, remember user preferences, and safeguard account access."
      lastUpdated="July 28, 2026"
      version="1.2"
      toc={toc}
      sidebarNote={
        <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0">
              {icons.mail}
            </div>
            <p className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9]">Privacy Assistance</p>
          </div>
          <p className="text-xs text-[#5c7075] dark:text-slate-400 leading-relaxed mb-3">
            Concerns about storage, tracking, or data preferences?
          </p>
          <a
            href="mailto:privacy@guildcode.dev"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#006655] dark:text-emerald-400 hover:underline"
          >
            Email Privacy Team
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      }
    >
      {/* 1. What Are Cookies & Storage Tokens? */}
      <LegalSection id="overview" number="Section 01" icon={icons.info} title="What Are Cookies & Storage Tokens?" delay={50} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Cookies and browser LocalStorage are small data files placed on your device when visiting websites. They allow web applications to maintain state, recognize your device across page transitions, and store user preferences securely.
        </p>
      </LegalSection>

      {/* 2. Categories of Cookies We Employ */}
      <LegalSection id="categories" number="Section 02" icon={icons.grid} title="Categories of Cookies We Employ" delay={100} collapsible>
        <div className="space-y-5">
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
              <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9]">1. Strictly Necessary / Essential</h4>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-[#006655] dark:text-emerald-400 font-bold text-[10px] rounded-full">Required</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Essential for platform security and user authentication (JWT session tokens). Without these, you would be unable to log in, create projects, or respond to collaboration requests.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
              <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9]">2. Functionality &amp; Preferences</h4>
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold text-[10px] rounded-full">Functional</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Stores customization choices such as dark mode / light mode appearance, notification preferences, and search filters across sessions.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
              <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9]">3. Analytical &amp; Performance</h4>
              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold text-[10px] rounded-full">Analytics</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Aggregated, anonymized statistics helping our developer team identify page load bottlenecks, popular project categories, and feature utilization.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 3. No Third-Party Advertising Cookies */}
      <LegalSection id="noads" number="Section 03" icon={icons.shield} title="No Third-Party Advertising Cookies" delay={150} collapsible>
        <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 p-5 sm:p-6">
          <div className="w-10 h-10 rounded-xl bg-[#006655] text-white flex items-center justify-center shrink-0 shadow-sm">
            {icons.shield}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Guild Code is built for developers. We do not host third-party advertisement banners or install tracking pixels from ad networks. Your data remains isolated within our ecosystem.
          </p>
        </div>
      </LegalSection>

      {/* 4. Managing Your Preferences */}
      <LegalSection id="manage" number="Section 04" icon={icons.sliders} title="Managing Your Preferences" delay={200} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          You can clear or block cookies at any time directly through your web browser settings (Chrome, Firefox, Safari, Edge). Please note that disabling essential cookies may impact your ability to remain logged into your Guild Code dashboard.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[#006655] dark:text-emerald-400">
          <Link to="/privacy" className="hover:underline inline-flex items-center gap-1.5">
            Read Privacy Policy
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <span className="text-[#006655]/30 dark:text-[#00a88a]/30">•</span>
          <Link to="/terms" className="hover:underline inline-flex items-center gap-1.5">
            Read Terms of Service
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </LegalSection>

      <LegalContact
        icon={icons.mail}
        title="Cookie & storage concerns?"
        description="Reach out to our privacy compliance team for questions about how your preferences are handled."
        actions={[{ label: 'Email Privacy Team', href: 'mailto:privacy@guildcode.dev', primary: true }]}
      />
    </LegalLayout>
  );
};

export default CookiePolicy;
