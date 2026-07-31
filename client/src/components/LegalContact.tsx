import React from 'react';

interface LegalContactAction {
  label: string;
  href: string;
  primary?: boolean;
  external?: boolean;
}

interface LegalContactProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actions: LegalContactAction[];
}

export const LegalContact: React.FC<LegalContactProps> = ({ icon, title, description, actions }) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/25 shadow-sm p-8 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {icon && (
          <div className="w-14 h-14 rounded-2xl bg-[#006655]/10 dark:bg-[#00a88a]/15 text-[#006655] dark:text-emerald-400 flex items-center justify-center shrink-0 ring-1 ring-[#006655]/15 dark:ring-[#00a88a]/25">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1.5">{title}</h2>
          <p className="text-sm text-[#5c7075] dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {actions.map((action) =>
            action.external ? (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  action.primary
                    ? 'bg-[#006655] hover:bg-[#004d40] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1a292c] hover:bg-slate-200 text-[#091e22] dark:text-[#f1f5f9]'
                }`}
              >
                {action.label}
              </a>
            ) : (
              <a
                key={action.label}
                href={action.href}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  action.primary
                    ? 'bg-[#006655] hover:bg-[#004d40] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1a292c] hover:bg-slate-200 text-[#091e22] dark:text-[#f1f5f9]'
                }`}
              >
                {action.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalContact;
