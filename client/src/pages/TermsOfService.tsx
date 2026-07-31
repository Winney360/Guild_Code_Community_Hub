import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const TermsOfService: React.FC = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#091e22] via-[#006655] to-[#091e22] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Terms & Community Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            These Terms govern your use of the Guild Code platform, API services, and community hub. By using Guild Code, you agree to abide by these terms and our Community Guidelines.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <span>Effective Date: July 28, 2026</span>
            <span>•</span>
            <span>Version 1.2</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider mb-4 pb-2 border-b border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20">
              Terms Navigation
            </h3>
            <nav className="space-y-1.5 text-xs">
              {[
                { id: 'acceptance', label: '1. Acceptance of Terms' },
                { id: 'account', label: '2. User Accounts & Security' },
                { id: 'ip', label: '3. Intellectual Property' },
                { id: 'collaborations', label: '4. Project & Matchmaking' },
                { id: 'conduct', label: '5. Acceptable Conduct' },
                { id: 'disclaimer', label: '6. Disclaimer & Warranties' },
                { id: 'limitation', label: '7. Limitation of Liability' },
                { id: 'governing', label: '8. Termination & Law' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-[#006655] text-white font-semibold shadow-xs'
                      : 'text-[#5c7075] hover:bg-slate-50 dark:hover:bg-[#1a292c] hover:text-[#091e22]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20">
              <div className="bg-slate-50 dark:bg-[#1a292c] border border-slate-200 dark:border-[#273b3e] rounded-xl p-4 text-xs">
                <p className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">Legal Inquiries</p>
                <p className="text-slate-600 dark:text-slate-400 mb-3 text-[11px] leading-relaxed">
                  Questions regarding licenses, copyright, or developer terms?
                </p>
                <a
                  href="mailto:legal@guildcode.dev"
                  className="inline-flex items-center gap-1 font-bold text-[#006655] dark:text-emerald-400 hover:underline"
                >
                  Contact Legal Team &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="lg:col-span-3 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section id="acceptance" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">1</span>
              Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing, browsing, or creating an account on Guild Code ("the Platform"), you confirm that you have read, understood, and agreed to be legally bound by these Terms of Service and our <Link to="/privacy" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              If you are accepting these terms on behalf of a company or open-source organization, you represent that you have full legal authority to bind that entity.
            </p>
          </section>

          {/* Section 2 */}
          <section id="account" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">2</span>
              User Accounts & Security
            </h2>
            <div className="space-y-3 text-xs">
              <p>
                To utilize core collaboration and project showcase features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>Provide accurate, current, and complete profile information.</li>
                <li>Maintain the confidentiality of your authentication credentials.</li>
                <li>Notify Guild Code immediately of any unauthorized account access.</li>
                <li>Be solely responsible for all activities occurring under your account.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="ip" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">3</span>
              Intellectual Property Rights
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">Your Code & Project Ownership</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  You retain full ownership and intellectual property rights to the source code, projects, and media assets you publish or submit to Guild Code. By showcasing projects, you grant Guild Code a non-exclusive license to index and display project summaries for platform discovery.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">Open Source Licensing</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Projects showcased on Guild Code remain governed by their respective open-source licenses (e.g. MIT, Apache 2.0, GPL). Maintainers are responsible for attaching clear license files to their repositories.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="collaborations" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">4</span>
              Project & Matchmaking Marketplace
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Guild Code facilitates developer introductions, mentorship connections, and open-source project recruitment. Guild Code does not act as an employer, agent, or contractor party to individual member agreements, and makes no representations regarding project outcomes.
            </p>
          </section>

          {/* Section 5 */}
          <section id="conduct" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">5</span>
              Acceptable Conduct & Prohibited Uses
            </h2>
            <p className="mb-3 text-xs">Users must comply with our <Link to="/guidelines" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">Community Guidelines</Link>. You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>Distribute malicious software, viruses, or unauthorized scripts.</li>
              <li>Harass, stalk, threaten, or discriminate against community members.</li>
              <li>Post fraudulent project listings or deceptive skill credentials.</li>
              <li>Attempt unauthorized access to developer data or backend infrastructure.</li>
            </ul>
          </section>

          {/* Section 6 & 7 */}
          <section id="disclaimer" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">6</span>
              Disclaimer of Warranties
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed uppercase font-mono">
              THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          <section id="limitation" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">7</span>
              Limitation of Liability
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In no event shall Guild Code, its founders, or contributors be liable for indirect, incidental, special, consequential, or punitive damages resulting from your platform usage or code contributions.
            </p>
          </section>

          {/* Section 8 */}
          <section id="governing" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">8</span>
              Termination & Governing Law
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We reserve the right to suspend or terminate accounts violating these Terms or engaging in disruptive behavior. These Terms shall be governed by and construed in accordance with applicable laws without regard to conflict of law principles.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
