import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout } from '../components/LegalLayout.js';
import type { TocItem } from '../components/LegalLayout.js';
import { LegalSection } from '../components/LegalSection.js';
import { LegalContact } from '../components/LegalContact.js';

const icons = {
  rocket: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  code: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  status: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
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
  { id: 'getting-started', label: '1. Getting Started', icon: icons.rocket },
  { id: 'projects', label: '2. Projects & Collaboration', icon: icons.code },
  { id: 'account', label: '3. Account & Security', icon: icons.shield },
  { id: 'status', label: '4. Platform Status', icon: icons.status },
];

export const HelpCenter: React.FC = () => {
  return (
    <LegalLayout
      eyebrow="Developer Community Support"
      eyebrowIcon={icons.rocket}
      title="Help Center"
      description="Find answers to common questions about your account, projects, and collaboration on the platform."
      toc={toc}
      sidebarNote={
        <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0">
              {icons.mail}
            </div>
            <p className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9]">Still need help?</p>
          </div>
          <p className="text-xs text-[#5c7075] dark:text-slate-400 leading-relaxed mb-3">
            Reach out to our support team and we will get back to you as soon as possible.
          </p>
          <a
            href="mailto:guildcommunity@guild-code.com"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#006655] dark:text-emerald-400 hover:underline"
          >
            Email Support
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      }
    >
      {/* 1. Getting Started */}
      <LegalSection id="getting-started" number="Section 01" icon={icons.rocket} title="Getting Started" delay={50} collapsible>
        <div className="space-y-6">
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              What is Guild Code Community?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A verified collective of high-caliber developers, designers, and creators collaborating on open-source infrastructure and community projects. Active members are strictly verified Guild Code community members.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              How do I create an account?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Head to the Sign Up page, fill in your details, and submit. New accounts require admin approval before you can access the dashboard.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              How long does approval take?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Most applications are reviewed within 24-48 hours. You will receive an email once your account is activated.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 2. Projects & Collaboration */}
      <LegalSection id="projects" number="Section 02" icon={icons.code} title="Projects & Collaboration" delay={100} collapsible>
        <div className="space-y-6">
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              How do I publish a project?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              From the dashboard, open My Projects and select New Project. Fill in your project details, cover image, and tech stack, then submit for review.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              How does collaboration matchmaking work?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create a collaboration listing with your skills and project goals. Members can apply, and you can review applicants from the Applications tab.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              Can I edit or remove a project?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes. Your projects and collaborations can be edited or deleted anytime from their respective dashboard sections.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 3. Account & Security */}
      <LegalSection id="account" number="Section 03" icon={icons.shield} title="Account & Security" delay={150} collapsible>
        <div className="space-y-6">
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              How do I reset my password?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Use the Forgot Password option on the Sign In page. A reset link will be sent to your registered email address.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              Why was my account rejected?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Applications are reviewed for genuine professional intent and profile completeness. Contact support to understand the specific reason and re-apply.
            </p>
          </div>
          <div className="border-l-2 border-[#006655]/25 dark:border-[#00a88a]/40 pl-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#091e22] dark:text-[#f1f5f9] mb-1.5">
              How is my data protected?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We follow strict security and privacy practices. Review our{' '}
              <Link to="/privacy" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
                Privacy Policy
              </Link>{' '}
              for full details on how your data is stored and handled.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 4. Platform Status */}
      <LegalSection id="status" number="Section 04" icon={icons.status} title="Platform Status" delay={200} collapsible>
        <div className="flex gap-4 rounded-2xl border border-[#006655]/15 dark:border-[#00a88a]/25 bg-[#006655]/4 dark:bg-[#00a88a]/8 p-5">
          <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.status}</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Experiencing an outage or slowdown? Visit the{' '}
            <Link to="/status" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
              System Status
            </Link>{' '}
            page for real-time uptime, incident history, and scheduled maintenance windows.
          </p>
        </div>
      </LegalSection>

      <LegalContact
        icon={icons.mail}
        title="Still need help?"
        description="Our support team is ready to answer questions about your account, projects, and collaborations."
        actions={[
          { label: 'Email Support', href: 'mailto:guildcommunity@guild-code.com', primary: true },
        ]}
      />
    </LegalLayout>
  );
};

export default HelpCenter;
