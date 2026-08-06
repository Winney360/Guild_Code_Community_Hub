import React from 'react';
import { Link } from 'react-router-dom';
import heroLogo from '../assets/hero.png';
import heroDarkLogo from '../assets/hero-dark.png';

const SocialLinks: React.FC = () => (
  <div className="flex items-center gap-5 md:gap-4 text-[#5c7075] dark:text-slate-400">
    <a
      href="https://www.linkedin.com/company/guild-code-community/"
      target="_blank"
      rel="noreferrer"
      aria-label="LinkedIn"
      className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-xl bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] hover:text-[#091e22] dark:hover:text-[#f1f5f9] transition-all hover:scale-105 active:scale-90"
    >
      <svg className="w-4 h-4 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    </a>
    <a
      href="https://x.com/GCodeCommunity"
      target="_blank"
      rel="noreferrer"
      aria-label="Twitter / X"
      className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-xl bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] hover:text-[#091e22] dark:hover:text-[#f1f5f9] transition-all hover:scale-105 active:scale-90"
    >
      <svg className="w-4 h-4 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
    <a
      href="https://wa.me/254700885748"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="flex items-center justify-center w-8 h-8 md:w-auto md:h-auto md:p-2 rounded-full md:rounded-xl bg-slate-50 dark:bg-[#1a292c] hover:bg-slate-100 dark:hover:bg-[#273b3e] hover:text-[#091e22] dark:hover:text-[#f1f5f9] transition-all hover:scale-105 active:scale-90"
    >
      <svg className="w-4 h-4 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
          <div className="lg:col-span-2 space-y-4 pb-8 md:pb-0">
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
