import React from 'react';
import { Link } from 'react-router-dom';
import heroLogo from '../assets/hero.png';
import heroDarkLogo from '../assets/hero-dark.png';

const SocialLinks: React.FC = () => (
  <div className="flex items-center gap-5 md:gap-4 text-[#5c7075] dark:text-slate-400">
    <a
      href="https://github.com"
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub"
      className="p-2.5 md:p-2 rounded-xl bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] hover:text-[#091e22] dark:hover:text-[#f1f5f9] transition-all hover:scale-105 active:scale-90"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    </a>
    <a
      href="https://www.linkedin.com/company/guild-code-community/"
      target="_blank"
      rel="noreferrer"
      aria-label="LinkedIn"
      className="p-2.5 md:p-2 rounded-xl bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] hover:text-[#091e22] dark:hover:text-[#f1f5f9] transition-all hover:scale-105 active:scale-90"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    </a>
    <a
      href="https://x.com/GCodeCommunity"
      target="_blank"
      rel="noreferrer"
      aria-label="Twitter / X"
      className="p-2.5 md:p-2 rounded-xl bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] hover:text-[#091e22] dark:hover:text-[#f1f5f9] transition-all hover:scale-105 active:scale-90"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
  </div>
);

const BackToTopButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c7075] dark:text-slate-400 hover:text-[#006655] dark:hover:text-emerald-400 transition-all cursor-pointer px-5 py-2.5 rounded-full bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] active:scale-95 md:bg-transparent md:dark:bg-transparent md:px-0 md:py-0 md:hover:bg-transparent md:dark:hover:bg-transparent"
  >
    <span>Back to top</span>
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
  </button>
);

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#0e1719] border-t border-[#006655]/30 dark:border-[#00a88a]/40 dark:border-[#00a88a]/20 pt-12 pb-8 mt-auto select-none transition-colors sm:pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 md:gap-10 pb-10 md:pb-12 border-b border-[#006655]/30 dark:border-[#00a88a]/40 dark:border-[#00a88a]/20">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4 pb-8 md:pb-0 border-b border-[#006655]/15 dark:border-[#00a88a]/20 md:border-b-0">
            <div className="flex items-center gap-3">
              <Link to="/" onClick={scrollToTop} className="flex items-center gap-3">
                <img src={heroLogo} alt="Logo" className="w-10 h-10 object-contain shrink-0 dark:hidden" />
                <img src={heroDarkLogo} alt="Logo" className="w-10 h-10 object-contain shrink-0 hidden dark:block" />
                <span className="font-extrabold text-lg text-[#091e22] dark:text-[#f1f5f9] tracking-tight">
                  Guild <span className="text-[#006655] dark:text-emerald-400">Code</span>
                </span>
              </Link>
            </div>
            <p className="text-xs text-[#5c7075] dark:text-slate-400 leading-relaxed max-w-sm">
              Empowering developers to build, collaborate, and grow together. Discover open-source projects, find skilled collaborators, and attend live tech events.
            </p>
          </div>

          {/* 2x2 grid on mobile (Ecosystem | Legal / Resources | Social), 3-col link row on md+ */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 md:gap-10 md:gap-y-0">
            {/* Col 2: Platform Links */}
            <div className="space-y-3 order-1 md:order-none">
              <h4 className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider">
                Ecosystem
              </h4>
              <ul className="space-y-2.5 md:space-y-2 text-xs text-[#5c7075] dark:text-slate-400">
                <li>
                  <Link to="/projects" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Project Showcase
                  </Link>
                </li>
                <li>
                  <Link to="/collaborate" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Collaboration Hub
                  </Link>
                </li>
                <li>
                  <Link to="/members" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Member Directory
                  </Link>
                </li>
                <li>
                  <Link to="/events" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Community Events
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Policies (2nd cell on mobile) */}
            <div className="space-y-3 order-2 md:order-none">
              <h4 className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider">
                Legal & Privacy
              </h4>
              <ul className="space-y-2.5 md:space-y-2 text-xs text-[#5c7075] dark:text-slate-400">
                <li>
                  <Link to="/privacy" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/guidelines" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Code of Conduct
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources & System (3rd cell on mobile) */}
            <div className="space-y-3 order-3 md:order-none">
              <h4 className="text-xs font-bold text-[#091e22] dark:text-[#f1f5f9] uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2.5 md:space-y-2 text-xs text-[#5c7075] dark:text-slate-400">
                <li>
                  <Link to="/guidelines" onClick={scrollToTop} className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <a href="mailto:guildcommunity@guild-code.com" className="inline-block py-1 md:py-0 hover:text-[#006655] dark:hover:text-emerald-400 transition-colors">
                    Support & Help
                  </a>
                </li>
              </ul>
            </div>

            {/* Social + Back to Top (4th cell on mobile, hidden md+) */}
            <div className="order-4 flex flex-col items-center gap-6 md:hidden">
              <SocialLinks />
              <BackToTopButton onClick={scrollToTop} />
            </div>
          </div>
        </div>

        {/* md+ Social row */}
        <div className="hidden md:flex md:items-center md:justify-between md:gap-4 md:pt-8">
          <SocialLinks />
          <BackToTopButton onClick={scrollToTop} />
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 md:pt-4 text-center text-xs text-[#5c7075] dark:text-slate-400">
          &copy; {new Date().getFullYear()} Guild Code Ecosystem. Built for developers with passion.
        </div>
      </div>
    </footer>
  );
};
