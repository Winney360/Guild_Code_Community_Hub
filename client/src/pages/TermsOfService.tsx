import React from 'react';
import { Link } from 'react-router-dom';
import { LegalLayout } from '../components/LegalLayout.js';
import type { TocItem } from '../components/LegalLayout.js';
import { LegalSection } from '../components/LegalSection.js';
import { LegalContact } from '../components/LegalContact.js';

const icons = {
  doc: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  key: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  bulb: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  flag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
  ),
  alert: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  scale: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
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
  { id: 'acceptance', label: '1. Acceptance of Terms', icon: icons.doc },
  { id: 'account', label: '2. User Accounts & Security', icon: icons.key },
  { id: 'ip', label: '3. Intellectual Property Rights', icon: icons.bulb },
  { id: 'collaborations', label: '4. Project & Matchmaking Marketplace', icon: icons.users },
  { id: 'conduct', label: '5. Acceptable Conduct & Prohibited Uses', icon: icons.flag },
  { id: 'disclaimer', label: '6. Disclaimer of Warranties', icon: icons.alert },
  { id: 'limitation', label: '7. Limitation of Liability', icon: icons.shield },
  { id: 'governing', label: '8. Termination & Governing Law', icon: icons.scale },
];

export const TermsOfService: React.FC = () => {
  return (
    <LegalLayout
      eyebrow="Terms & Community Agreement"
      eyebrowIcon={icons.doc}
      title="Terms of Service"
      description="These Terms govern your use of the Guild Code platform, API services, and community hub. By using Guild Code, you agree to abide by these terms and our Community Guidelines."
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
            <p className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9]">Legal Inquiries</p>
          </div>
          <p className="text-xs text-[#5c7075] dark:text-slate-400 leading-relaxed mb-3">
            Questions regarding licenses, copyright, or developer terms?
          </p>
          <a
            href="mailto:legal@guildcode.dev"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#006655] dark:text-emerald-400 hover:underline"
          >
            Contact Legal Team
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      }
    >
      {/* 1. Acceptance of Terms */}
      <LegalSection id="acceptance" number="Section 01" icon={icons.doc} title="Acceptance of Terms" delay={50} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          By accessing, browsing, or creating an account on Guild Code (&quot;the Platform&quot;), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service and our{' '}
          <Link to="/privacy" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
          If you are accepting these terms on behalf of a company or open-source organization, you represent that you have full legal authority to bind that entity.
        </p>
      </LegalSection>

      {/* 2. User Accounts & Security */}
      <LegalSection id="account" number="Section 02" icon={icons.key} title="User Accounts & Security" delay={100} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          To utilize core collaboration and project showcase features, you must register for an account. You agree to:
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Provide accurate, current, and complete profile information.</p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Maintain the confidentiality of your authentication credentials.</p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Notify Guild Code immediately of any unauthorized account access.</p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Be solely responsible for all activities occurring under your account.</p>
          </li>
        </ul>
      </LegalSection>

      {/* 3. Intellectual Property Rights */}
      <LegalSection id="ip" number="Section 03" icon={icons.bulb} title="Intellectual Property Rights" delay={150} collapsible>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-2">Your Code &amp; Project Ownership</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              You retain full ownership and intellectual property rights to the source code, projects, and media assets you publish or submit to Guild Code. By showcasing projects, you grant Guild Code a non-exclusive license to index and display project summaries for platform discovery.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 p-5">
            <h4 className="text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] mb-2">Open Source Licensing</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Projects showcased on Guild Code remain governed by their respective open-source licenses (e.g. MIT, Apache 2.0, GPL). Maintainers are responsible for attaching clear license files to their repositories.
            </p>
          </div>
        </div>
      </LegalSection>

      {/* 4. Project & Matchmaking Marketplace */}
      <LegalSection id="collaborations" number="Section 04" icon={icons.users} title="Project & Matchmaking Marketplace" delay={200} collapsible>
        <div className="flex gap-4 rounded-2xl border border-[#006655]/15 dark:border-[#00a88a]/25 bg-[#006655]/4 dark:bg-[#00a88a]/8 p-5">
          <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.users}</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Guild Code facilitates developer introductions, mentorship connections, and open-source project recruitment. Guild Code does not act as an employer, agent, or contractor party to individual member agreements, and makes no representations regarding project outcomes.
          </p>
        </div>
      </LegalSection>

      {/* 5. Acceptable Conduct & Prohibited Uses */}
      <LegalSection id="conduct" number="Section 05" icon={icons.flag} title="Acceptable Conduct & Prohibited Uses" delay={250} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Users must comply with our{' '}
          <Link to="/guidelines" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">
            Community Guidelines
          </Link>
          . You agree not to:
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Distribute malicious software, viruses, or unauthorized scripts.</p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Harass, stalk, threaten, or discriminate against community members.</p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Post fraudulent project listings or deceptive skill credentials.</p>
          </li>
          <li className="flex gap-3">
            <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.check}</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Attempt unauthorized access to developer data or backend infrastructure.</p>
          </li>
        </ul>
      </LegalSection>

      {/* 6. Disclaimer of Warranties */}
      <LegalSection id="disclaimer" number="Section 06" icon={icons.alert} title="Disclaimer of Warranties" delay={300} collapsible>
        <p className="text-xs uppercase font-mono tracking-wide text-slate-500 dark:text-slate-400 leading-relaxed">
          THE PLATFORM IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </p>
      </LegalSection>

      {/* 7. Limitation of Liability */}
      <LegalSection id="limitation" number="Section 07" icon={icons.shield} title="Limitation of Liability" delay={350} collapsible>
        <div className="flex gap-4 rounded-2xl border border-[#006655]/15 dark:border-[#00a88a]/25 bg-[#006655]/4 dark:bg-[#00a88a]/8 p-5">
          <span className="text-[#006655] dark:text-emerald-400 shrink-0 mt-0.5">{icons.shield}</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            In no event shall Guild Code, its founders, or contributors be liable for indirect, incidental, special, consequential, or punitive damages resulting from your platform usage or code contributions.
          </p>
        </div>
      </LegalSection>

      {/* 8. Termination & Governing Law */}
      <LegalSection id="governing" number="Section 08" icon={icons.scale} title="Termination & Governing Law" delay={400} collapsible>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          We reserve the right to suspend or terminate accounts violating these Terms or engaging in disruptive behavior. These Terms shall be governed by and construed in accordance with applicable laws without regard to conflict of law principles.
        </p>
      </LegalSection>

      <LegalContact
        icon={icons.mail}
        title="Questions about these Terms?"
        description="Our legal team is available to clarify platform obligations, licensing, or account-related concerns."
        actions={[
          { label: 'Contact Legal Team', href: 'mailto:legal@guildcode.dev', primary: true },
          { label: 'Community Support', href: 'mailto:guildcommunity@guild-code.com' },
        ]}
      />
    </LegalLayout>
  );
};

export default TermsOfService;
