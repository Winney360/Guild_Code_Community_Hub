import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout } from '../components/LegalLayout.js';
import type { TocItem } from '../components/LegalLayout.js';
import { LegalSection } from '../components/LegalSection.js';

const icons = {
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  trend: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  share: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  ),
  scale: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    </svg>
  ),
  cookie: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a9.75 9.75 0 109.75 9.75c0-1.053-1.636-1.813-2.135-2.867a.75.75 0 01.288-.843 1.5 1.5 0 001.41-1.556 9.75 9.75 0 00-9.313-4.484zM12 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8.25 15a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM14.25 9.75a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
    </svg>
  ),
  puzzle: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const toc: TocItem[] = [
  { id: 'collection', label: '1. Information We Collect', icon: icons.user },
  { id: 'usage', label: '2. How We Use Your Data', icon: icons.trend },
  { id: 'sharing', label: '3. Data Sharing & Disclosure', icon: icons.share },
  { id: 'security', label: '4. Security & Data Storage', icon: icons.shield },
  { id: 'rights', label: '5. Your Data Rights', icon: icons.scale },
  { id: 'cookies', label: '6. Cookies & Tracking', icon: icons.cookie },
  { id: 'thirdparty', label: '7. Third-Party Services', icon: icons.puzzle },
  { id: 'contact', label: '8. Contact Information', icon: icons.mail },
];

export const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout
      eyebrow="Legal & Data Protection"
      eyebrowIcon={icons.shield}
      title="Privacy Policy"
      description="At Guild Code, we respect your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information when using our developer hub."
      lastUpdated="July 28, 2026"
      effectiveDate="July 28, 2026"
      version="1.2"
      toc={toc}
      sidebarNote={
        <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0">
              {icons.mail}
            </div>
            <p className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9]">Need clarification?</p>
          </div>
          <p className="text-xs text-[#5c7075] dark:text-slate-400 leading-relaxed mb-3">
            Our privacy compliance team is ready to answer questions regarding data requests.
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
      {/* 1. Information We Collect */}
      <LegalSection id="collection" number="Section 01" icon={icons.user} title="Information We Collect" delay={50} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We collect information to provide a seamless collaborative platform for developers, project maintainers, and community members.
        </p>

        <div className="space-y-6">
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              Account &amp; Profile Information
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When you register, we collect your full name, email address, username, password hash, avatar URL, bio, tech stack skills, and social links (GitHub, LinkedIn, Portfolio).
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              Community &amp; Project Submissions
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Projects created or submitted, collaboration listings, event RSVPs, comments, feedback ratings, and collaboration application forms.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              Technical &amp; Usage Logs
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              IP addresses, browser type, operating system details, device type, referring URLs, pages visited, and interaction timestamps.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 2. How We Use Your Data */}
      <LegalSection id="usage" number="Section 02" icon={icons.trend} title="How We Use Your Data" delay={100} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We process your personal information for specific, legitimate operational purposes:
        </p>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="font-semibold text-[#091e22] dark:text-[#f1f5f9]">Platform Services:</strong>{' '}
              To display developer profiles, index public projects, match collaborators, and process event registrations.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="font-semibold text-[#091e22] dark:text-[#f1f5f9]">Communication:</strong>{' '}
              Sending transactional notifications, collaboration request alerts, security notices, and community news.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="font-semibold text-[#091e22] dark:text-[#f1f5f9]">Safety &amp; Moderation:</strong>{' '}
              Moderating public content, detecting abuse or spam, enforcing community guidelines, and securing developer accounts.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="font-semibold text-[#091e22] dark:text-[#f1f5f9]">Platform Optimization:</strong>{' '}
              Analyzing user engagement trends to improve user experience and introduce new community features.
            </p>
          </li>
        </ul>
      </LegalSection>

      {/* 3. Data Sharing & Disclosure */}
      <LegalSection id="sharing" number="Section 03" icon={icons.share} title="Data Sharing & Disclosure" delay={150} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="font-semibold text-[#006655] dark:text-emerald-400">
            We do not sell, rent, or trade your personal data to third parties.
          </strong>{' '}
          Data is shared only under the following limited conditions:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="w-9 h-9 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center mb-3">
              {icons.user}
            </div>
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1.5">Public Profiles &amp; Projects</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your public profile details, listed projects, and public collaboration requests are visible to other members of the Guild Code ecosystem.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="w-9 h-9 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center mb-3">
              {icons.shield}
            </div>
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1.5">Service Providers</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Trusted infrastructure vendors (e.g., cloud hosting, email delivery) bound by strict confidentiality obligations.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 4. Security & Data Storage */}
      <LegalSection id="security" number="Section 04" icon={icons.shield} title="Security & Data Storage" delay={200} collapsible>
        <div className="flex gap-4 rounded-2xl border border-[#006655]/15 dark:border-[#00a88a]/25 bg-[#006655]/4 dark:bg-[#00a88a]/8 p-5">
          <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.shield}</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We employ industry-standard administrative, physical, and technical safeguards (TLS/SSL encryption in transit, bcrypt password hashing, automated security audits) to protect your information.
          </p>
        </div>
      </LegalSection>

      {/* 5. Your Data Rights */}
      <LegalSection id="rights" number="Section 05" icon={icons.scale} title="Your Data Rights" delay={250} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Regardless of your jurisdiction, Guild Code affords all users comprehensive privacy controls:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="w-9 h-9 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center mb-3">
              {icons.share}
            </div>
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1.5">Access &amp; Export</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Request a copy of your personal data archive anytime via dashboard settings.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="w-9 h-9 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center mb-3">
              {icons.check}
            </div>
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1.5">Rectification</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Edit or correct inaccurate profile info instantly in your account settings.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <div className="w-9 h-9 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center mb-3">
              {icons.shield}
            </div>
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1.5">Erasure</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Delete your account and permanently remove your personal profile from our servers.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 6. Cookies & Tracking */}
      <LegalSection id="cookies" number="Section 06" icon={icons.cookie} title="Cookies & Tracking" delay={300} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We use essential HTTP cookies and local storage tokens to keep you logged in securely and remember your theme preferences (Dark/Light mode). For full details, please view our{' '}
          <Link to="/cookies" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      {/* 7. Third-Party Services */}
      <LegalSection id="thirdparty" number="Section 07" icon={icons.puzzle} title="Third-Party Services" delay={350} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Our platform allows authentication or repository sync with GitHub, Discord, and external developer tools. These third-party services operate under their own privacy policies.
        </p>
      </LegalSection>

      {/* 8. Contact Information */}
      <LegalSection id="contact" number="Section 08" icon={icons.mail} title="Contact Information" delay={400} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data:
        </p>
        <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-6 space-y-3">
          <p className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9]">Guild Code Data Governance</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="text-[#006655] dark:text-emerald-400">{icons.mail}</span>
            Email:{' '}
            <a href="mailto:privacy@guildcode.dev" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
              privacy@guildcode.dev
            </a>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="text-[#006655] dark:text-emerald-400">{icons.user}</span>
            Community Support:{' '}
            <a href="mailto:support@guildcode.dev" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
              support@guildcode.dev
            </a>
          </p>
        </div>
      </LegalSection>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
