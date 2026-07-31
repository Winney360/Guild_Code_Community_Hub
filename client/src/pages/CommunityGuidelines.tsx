import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout, TocItem } from '../components/LegalLayout.js';
import { LegalSection } from '../components/LegalSection.js';
import { LegalContact } from '../components/LegalContact.js';

const icons = {
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  alert: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  flag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
};

const toc: TocItem[] = [
  { id: 'inclusivity', label: '1. Inclusivity & Respect', icon: icons.users },
  { id: 'integrity', label: '2. Collaborative Integrity', icon: icons.code },
  { id: 'feedback', label: '3. Constructive Feedback', icon: icons.chat },
  { id: 'zero', label: '4. Zero Tolerance for Spam & Abuse', icon: icons.alert },
  { id: 'reporting', label: '5. Reporting Violations', icon: icons.flag },
  { id: 'moderation', label: '6. Moderation Actions', icon: icons.shield },
];

export const CommunityGuidelines: React.FC = () => {
  return (
    <LegalLayout
      eyebrow="Developer Ecosystem Standard"
      eyebrowIcon={icons.users}
      title="Community Guidelines & Code of Conduct"
      description="Guild Code is designed to bring developers together to learn, build open-source software, and launch exciting products. We expect all community members to uphold these core guidelines."
      lastUpdated="July 28, 2026"
      version="1.2"
      toc={toc}
      sidebarNote={
        <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0">
              {icons.mail}
            </div>
            <p className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9]">Moderation Queue</p>
          </div>
          <p className="text-xs text-[#5c7075] dark:text-slate-400 leading-relaxed mb-3">
            Concerned about a listing, comment, or member?
          </p>
          <a
            href="mailto:moderation@guildcode.dev"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#006655] dark:text-emerald-400 hover:underline"
          >
            Report via Email
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      }
    >
      {/* 1. Inclusivity & Respect */}
      <LegalSection id="inclusivity" number="Pillar 01" icon={icons.users} title="Inclusivity & Respect" delay={50} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Guild Code is dedicated to offering a welcoming, harassment-free environment for all developers regardless of skill level, background, identity, or stack preference.
        </p>
      </LegalSection>

      {/* 2. Collaborative Integrity */}
      <LegalSection id="integrity" number="Pillar 02" icon={icons.code} title="Collaborative Integrity" delay={100} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Be transparent about project requirements, license terms, and contribution expectations. Credit co-authors and maintain open communication in team collaborations.
        </p>
      </LegalSection>

      {/* 3. Constructive Feedback */}
      <LegalSection id="feedback" number="Pillar 03" icon={icons.chat} title="Constructive Feedback" delay={150} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Review code submissions thoughtfully. Offer constructive suggestions rather than dismissal. Celebrate fellow developers&rsquo; achievements and learning journeys.
        </p>
      </LegalSection>

      {/* 4. Zero Tolerance for Spam & Abuse */}
      <LegalSection id="zero" number="Pillar 04" icon={icons.alert} title="Zero Tolerance for Spam & Abuse" delay={200} collapsible>
        <div className="flex gap-4 rounded-2xl border border-[#006655]/15 dark:border-[#00a88a]/25 bg-[#006655]/4 dark:bg-[#00a88a]/8 p-5">
          <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.alert}</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Strict prohibition of spam project links, deceptive referral schemes, malicious code repositories, hate speech, dox attempts, or unsolicited self-promotion.
          </p>
        </div>
      </LegalSection>

      {/* 5. Reporting Violations */}
      <LegalSection id="reporting" number="Section 05" icon={icons.flag} title="Reporting Violations" delay={250} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
          If you encounter content, projects, comments, or collaboration listings that breach these standards, please report them using the flag button on the post or contact our moderation queue.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:moderation@guildcode.dev"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006655] hover:bg-[#004d40] text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {icons.flag}
            Report via Email
          </a>
          <Link
            to="/dashboard/activity"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-[#1a292c] hover:bg-slate-200 text-[#091e22] dark:text-[#f1f5f9] font-bold text-sm rounded-xl transition-all"
          >
            View Activity &amp; Alerts
          </Link>
        </div>
      </LegalSection>

      {/* 6. Moderation Actions */}
      <LegalSection id="moderation" number="Section 06" icon={icons.shield} title="Moderation Actions" delay={300} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
          Our moderation team reviews reported items in accordance with internal guidelines. Actions taken may include warning notices, removal of content/listings, temporary account suspension, or permanent ban for severe violations.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[#006655] dark:text-emerald-400">
          <Link to="/terms" className="hover:underline inline-flex items-center gap-1.5">
            Terms of Service
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <span className="text-[#006655]/30 dark:text-[#00a88a]/30">•</span>
          <Link to="/privacy" className="hover:underline inline-flex items-center gap-1.5">
            Privacy Policy
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </LegalSection>

      <LegalContact
        icon={icons.mail}
        title="Questions about our standards?"
        description="Our moderation team can help clarify the expectations we set for every member of the ecosystem."
        actions={[
          { label: 'Email Moderation Team', href: 'mailto:moderation@guildcode.dev', primary: true },
          { label: 'Community Support', href: 'mailto:support@guildcode.dev' },
        ]}
      />
    </LegalLayout>
  );
};

export default CommunityGuidelines;
