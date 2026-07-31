import React, { useContext, useState } from 'react';
import { LegalSectionRegistryContext } from './LegalSectionRegistryContext.js';
import ScrollReveal from './ScrollReveal.js';

interface LegalSectionProps {
  id: string;
  number?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  delay?: number;
  collapsible?: boolean;
  children: React.ReactNode;
}

export const LegalSection: React.FC<LegalSectionProps> = ({
  id,
  number,
  icon,
  title,
  subtitle,
  delay = 0,
  collapsible = false,
  children,
}) => {
  const [open, setOpen] = useState(true);
  const registerSection = useContext(LegalSectionRegistryContext);

  return (
    <ScrollReveal delay={delay}>
      <section
        id={id}
        ref={(el) => registerSection(el, id)}
        className="py-10 first:pt-8 scroll-mt-24"
        aria-labelledby={`${id}-heading`}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0 ring-1 ring-[#006655]/15 dark:ring-[#00a88a]/25">
            {icon ? (
              icon
            ) : number ? (
              <span className="text-sm font-black">{number}</span>
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            {number && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#006655] dark:text-emerald-400 mb-1">
                {number}
              </p>
            )}
            <div className="flex items-center gap-3">
              <h2 id={`${id}-heading`} className="text-xl sm:text-2xl font-bold text-[#091e22] dark:text-[#f1f5f9] leading-snug">
                {title}
              </h2>
              {collapsible && (
                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls={`${id}-body`}
                  className="p-1.5 rounded-lg text-[#5c7075] dark:text-slate-400 hover:text-[#006655] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-[#1a292c] transition-colors cursor-pointer"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-[#5c7075] dark:text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>

        <div
          className={`grid transition-all duration-300 ease-out ${collapsible ? '' : ''}`}
          style={{ gridTemplateRows: collapsible ? (open ? '1fr' : '0fr') : undefined }}
        >
          <div id={`${id}-body`} className="min-h-0 overflow-hidden">
            <div className="sm:pl-[60px] space-y-5">{children}</div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default LegalSection;
