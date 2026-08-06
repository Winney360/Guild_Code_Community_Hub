import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

interface HelpItem {
  title: string;
  body: string;
}

interface HelpCategory {
  label: string;
  icon: React.ReactNode;
  items: HelpItem[];
}

const iconPath = (d: string) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const categories: HelpCategory[] = [
  {
    label: 'Getting Started',
    icon: iconPath('M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5'),
    items: [
      { title: 'What is Guild Code Community?', body: 'A verified collective of high-caliber developers, designers, and creators collaborating on open-source infrastructure and community projects.' },
      { title: 'How do I create an account?', body: 'Head to the Sign Up page, fill in your details, and submit. New accounts require admin approval before you can access the dashboard.' },
      { title: 'How long does approval take?', body: 'Most applications are reviewed within 24-48 hours. You will receive an email once your account is activated.' },
    ],
  },
  {
    label: 'Projects & Collaboration',
    icon: iconPath('M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125z'),
    items: [
      { title: 'How do I publish a project?', body: 'From the dashboard, open My Projects and select New Project. Fill in your project details, cover image, and tech stack, then submit for review.' },
      { title: 'How does collaboration matchmaking work?', body: 'Create a collaboration listing with your skills and project goals. Members can apply, and you can review applicants from the Applications tab.' },
      { title: 'Can I edit or remove a project?', body: 'Yes. Your projects and collaborations can be edited or deleted anytime from their respective dashboard sections.' },
    ],
  },
  {
    label: 'Account & Security',
    icon: iconPath('M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'),
    items: [
      { title: 'How do I reset my password?', body: 'Use the Forgot Password option on the Sign In page. A reset link will be sent to your registered email address.' },
      { title: 'Why was my account rejected?', body: 'Applications are reviewed for genuine professional intent and profile completeness. Contact support to understand the specific reason and re-apply.' },
      { title: 'How is my data protected?', body: 'We follow strict security and privacy practices. Review our Privacy Policy for full details on how your data is stored and handled.' },
    ],
  },
];

export const HelpCenter: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Banner */}
      <ScrollReveal>
        <div className="bg-[#006655] dark:bg-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10">
          <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider block mb-2">
            Guild Code Community
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Help Center</h1>
          <p className="text-emerald-50 text-sm max-w-xl">
            Find answers to common questions about your account, projects, and collaboration on the platform.
          </p>
        </div>
      </ScrollReveal>

      {/* Categories */}
      {categories.map((cat, catIdx) => (
        <ScrollReveal key={cat.label} delay={catIdx * 100}>
          <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#006655]/30 dark:border-[#00a88a]/40">
              <div className="w-10 h-10 rounded-xl bg-[#e6f7f8] dark:bg-emerald-900/40 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0">
                {cat.icon}
              </div>
              <h2 className="text-lg font-bold text-[#091e22] dark:text-[#f1f5f9]">{cat.label}</h2>
            </div>
            <div className="space-y-4">
              {cat.items.map((item) => (
                <div key={item.title} className="text-sm">
                  <h3 className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">{item.title}</h3>
                  <p className="text-[#5c7075] dark:text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ))}

      {/* Contact Support Card */}
      <ScrollReveal delay={300}>
        <div className="bg-slate-50 dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-8 text-center shadow-xs">
          <h2 className="text-lg font-bold text-[#091e22] dark:text-[#f1f5f9] mb-2">Still need help?</h2>
          <p className="text-sm text-[#5c7075] dark:text-slate-400 mb-5">
            Reach out to our support team and we will get back to you as soon as possible.
          </p>
          <a
            href="mailto:guildcommunity@guild-code.com"
            className="inline-flex items-center gap-2 bg-[#006655] hover:bg-[#004d40] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>Email Support</span>
          </a>
          <p className="text-xs text-[#5c7075] dark:text-slate-400 mt-4">
            For the latest platform status, visit the{' '}
            <Link to="/status" className="text-[#006655] dark:text-emerald-400 hover:underline font-bold">
              System Status
            </Link>{' '}
            page.
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HelpCenter;
