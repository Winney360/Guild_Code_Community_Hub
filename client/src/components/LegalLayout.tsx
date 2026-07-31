import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LegalSectionRegistryContext } from './LegalSectionRegistryContext.js';
import ScrollReveal from './ScrollReveal.js';

export interface TocItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface LegalLayoutProps {
  eyebrow: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  description: string;
  lastUpdated?: string;
  effectiveDate?: string;
  version?: string;
  toc: TocItem[];
  sidebarNote?: React.ReactNode;
  contact?: React.ReactNode;
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  lastUpdated,
  effectiveDate,
  version,
  toc,
  sidebarNote,
  contact,
  children,
}) => {
  const [active, setActive] = useState<string>(toc[0]?.id ?? '');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const registerSection = useCallback((el: HTMLElement | null, id: string) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    const sections = toc
      .map((item) => sectionRefs.current.get(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -75% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [toc]);

  const scrollToSection = (id: string) => {
    setActive(id);
    setMobileTocOpen(false);
    const element = sectionRefs.current.get(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const metaItems: { label: string; value: string; icon: React.ReactNode }[] = [];
  if (lastUpdated) {
    metaItems.push({
      label: 'Last updated',
      value: lastUpdated,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    });
  }
  if (effectiveDate) {
    metaItems.push({
      label: 'Effective',
      value: effectiveDate,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    });
  }
  if (version) {
    metaItems.push({
      label: 'Version',
      value: version,
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    });
  }

  return (
    <LegalSectionRegistryContext.Provider value={registerSection}>
    <div className="bg-slate-50/50 dark:bg-[#0b1315] font-sans antialiased text-[#091e22] dark:text-[#f1f5f9]">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-[#006655]/10 dark:border-[#00a88a]/20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#006655]/6 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-[#006655]/6 blur-3xl pointer-events-none" />

        <ScrollReveal>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 text-[#006655] dark:text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-6 shadow-xs">
              {eyebrowIcon}
              <span>{eyebrow}</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#091e22] dark:text-[#f1f5f9] mb-4">
                  {title}
                </h1>
                <p className="text-base sm:text-lg text-[#5c7075] dark:text-slate-400 leading-relaxed">{description}</p>
              </div>

              {metaItems.length > 0 && (
                <div className="shrink-0 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {metaItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-[#5c7075] dark:text-slate-400">
                      <span className="text-[#006655] dark:text-emerald-400">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold text-[#091e22] dark:text-[#f1f5f9]">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5c7075] dark:text-slate-500 mb-4">
                On this page
              </p>
              <nav aria-label="Section navigation" className="space-y-1">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-[13px] transition-all cursor-pointer ${
                      active === item.id
                        ? 'bg-[#006655]/8 dark:bg-[#00a88a]/12 text-[#006655] dark:text-emerald-400 font-semibold'
                        : 'text-[#5c7075] dark:text-slate-400 hover:text-[#091e22] dark:hover:text-[#f1f5f9] hover:bg-slate-50 dark:hover:bg-[#1a292c]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                        active === item.id
                          ? 'bg-[#006655] dark:bg-emerald-400'
                          : 'bg-transparent group-hover:bg-[#006655]/40'
                      }`}
                    />
                    {item.icon && <span className="shrink-0 opacity-70">{item.icon}</span>}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>

              {sidebarNote && (
                <div className="mt-8 pt-6 border-t border-[#006655]/10 dark:border-[#00a88a]/20">{sidebarNote}</div>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            {/* Mobile TOC */}
            <div className="lg:hidden mb-10">
              <button
                onClick={() => setMobileTocOpen((v) => !v)}
                aria-expanded={mobileTocOpen}
                aria-controls="mobile-toc"
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 shadow-xs text-sm font-bold text-[#091e22] dark:text-[#f1f5f9] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#006655] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  On this page
                </span>
                <svg className={`w-4 h-4 text-[#5c7075] transition-transform duration-300 ${mobileTocOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {mobileTocOpen && (
                <div id="mobile-toc" className="mt-2 rounded-2xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 shadow-sm overflow-hidden">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] font-medium transition-colors cursor-pointer ${
                        active === item.id
                          ? 'bg-[#006655]/8 dark:bg-[#00a88a]/12 text-[#006655] dark:text-emerald-400'
                          : 'text-[#5c7075] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a292c]'
                      } ${toc[toc.length - 1].id === item.id ? '' : 'border-b border-[#006655]/10 dark:border-[#00a88a]/20'}`}
                    >
                      {item.icon && <span className="shrink-0 opacity-70">{item.icon}</span>}
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <main className="divide-y divide-[#006655]/10 dark:divide-[#00a88a]/20">{children}</main>

            {contact && <div className="mt-14">{contact}</div>}
          </div>
        </div>
      </div>
    </div>
    </LegalSectionRegistryContext.Provider>
  );
};

export default LegalLayout;
