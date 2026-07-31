import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('collection');

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
      <div className="bg-gradient-to-r from-[#006655] to-[#00897b] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Legal & Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            At Guild Code, we respect your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information when using our developer hub.
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
              On This Page
            </h3>
            <nav className="space-y-1.5 text-xs">
              {[
                { id: 'collection', label: '1. Information We Collect' },
                { id: 'usage', label: '2. How We Use Your Data' },
                { id: 'sharing', label: '3. Data Sharing & Disclosure' },
                { id: 'security', label: '4. Security & Storage' },
                { id: 'rights', label: '5. Your Data Rights' },
                { id: 'cookies', label: '6. Cookies & Tracking' },
                { id: 'thirdparty', label: '7. Third-Party Services' },
                { id: 'contact', label: '8. Contact Information' },
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
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl p-4 text-xs">
                <p className="font-bold text-[#006655] dark:text-emerald-400 mb-1">Need Clarification?</p>
                <p className="text-slate-600 dark:text-slate-400 mb-3 text-[11px] leading-relaxed">
                  Our privacy compliance team is ready to answer questions regarding data requests.
                </p>
                <a
                  href="mailto:privacy@guildcode.dev"
                  className="inline-flex items-center gap-1 font-bold text-[#006655] dark:text-emerald-400 hover:underline"
                >
                  Email Privacy Team &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="lg:col-span-3 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Section 1 */}
          <section id="collection" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">1</span>
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information to provide a seamless collaborative platform for developers, project maintainers, and community members.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e]">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] text-xs uppercase mb-1">Account & Profile Information</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  When you register, we collect your full name, email address, username, password hash, avatar URL, bio, tech stack skills, and social links (GitHub, LinkedIn, Portfolio).
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e]">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] text-xs uppercase mb-1">Community & Project Submissions</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Projects created or submitted, collaboration listings, event RSVPs, comments, feedback ratings, and collaboration application forms.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e]">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] text-xs uppercase mb-1">Technical & Usage Logs</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  IP addresses, browser type, operating system details, device type, referring URLs, pages visited, and interaction timestamps.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="usage" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">2</span>
              How We Use Your Data
            </h2>
            <p className="mb-4">We process your personal information for specific, legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><strong className="text-[#091e22] dark:text-[#f1f5f9]">Platform Services:</strong> To display developer profiles, index public projects, match collaborators, and process event registrations.</li>
              <li><strong className="text-[#091e22] dark:text-[#f1f5f9]">Communication:</strong> Sending transactional notifications, collaboration request alerts, security notices, and community news.</li>
              <li><strong className="text-[#091e22] dark:text-[#f1f5f9]">Safety & Moderation:</strong> Moderating public content, detecting abuse or spam, enforcing community guidelines, and securing developer accounts.</li>
              <li><strong className="text-[#091e22] dark:text-[#f1f5f9]">Platform Optimization:</strong> Analyzing user engagement trends to improve user experience and introduce new community features.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sharing" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">3</span>
              Data Sharing & Disclosure
            </h2>
            <p className="mb-4">
              <strong className="text-[#006655] dark:text-emerald-400">We do not sell, rent, or trade your personal data to third parties.</strong> Data is shared only under the following limited conditions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">Public Profiles & Projects</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Your public profile details, listed projects, and public collaboration requests are visible to other members of the Guild Code ecosystem.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <h4 className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">Service Providers</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Trusted infrastructure vendors (e.g., cloud hosting, email delivery) bound by strict confidentiality obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="security" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">4</span>
              Security & Data Storage
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We employ industry-standard administrative, physical, and technical safeguards (TLS/SSL encryption in transit, bcrypt password hashing, automated security audits) to protect your information.
            </p>
          </section>

          {/* Section 5 */}
          <section id="rights" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">5</span>
              Your Data Rights
            </h2>
            <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
              Regardless of your jurisdiction, Guild Code affords all users comprehensive privacy controls:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <span className="font-bold block text-[#091e22] dark:text-[#f1f5f9] mb-1">Access & Export</span>
                <span className="text-slate-600 dark:text-slate-400">Request a copy of your personal data archive anytime via dashboard settings.</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <span className="font-bold block text-[#091e22] dark:text-[#f1f5f9] mb-1">Rectification</span>
                <span className="text-slate-600 dark:text-slate-400">Edit or correct inaccurate profile info instantly in your account settings.</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#1a292c] rounded-xl">
                <span className="font-bold block text-[#091e22] dark:text-[#f1f5f9] mb-1">Erasure</span>
                <span className="text-slate-600 dark:text-slate-400">Delete your account and permanently remove your personal profile from our servers.</span>
              </div>
            </div>
          </section>

          {/* Section 6 & 7 */}
          <section id="cookies" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">6</span>
              Cookies & Tracking
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We use essential HTTP cookies and local storage tokens to keep you logged in securely and remember your theme preferences (Dark/Light mode). For full details, please view our <Link to="/cookies" className="text-[#006655] dark:text-emerald-400 font-bold hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section id="thirdparty" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">7</span>
              Third-Party Services
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our platform allows authentication or repository sync with GitHub, Discord, and external developer tools. These third-party services operate under their own privacy policies.
            </p>
          </section>

          {/* Section 8 */}
          <section id="contact" className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[#006655] dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">8</span>
              Contact Information
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data:
            </p>
            <div className="bg-slate-50 dark:bg-[#1a292c] p-4 rounded-xl text-xs space-y-1">
              <p className="font-bold text-[#091e22] dark:text-[#f1f5f9]">Guild Code Data Governance</p>
              <p className="text-slate-600 dark:text-slate-400">Email: <a href="mailto:privacy@guildcode.dev" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">privacy@guildcode.dev</a></p>
              <p className="text-slate-600 dark:text-slate-400">Community Support: <a href="mailto:support@guildcode.dev" className="text-[#006655] dark:text-emerald-400 font-semibold hover:underline">support@guildcode.dev</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
