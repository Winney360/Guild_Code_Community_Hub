import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

interface ServiceStatus {
  name: string;
  category: string;
  status: 'Operational' | 'Degraded' | 'Outage';
  latency: string;
  uptime: string;
}

export const SystemStatus: React.FC = () => {
  const services: ServiceStatus[] = [
    { name: 'Core Web Application', category: 'Frontend Infrastructure', status: 'Operational', latency: '24ms', uptime: '99.99%' },
    { name: 'API Gateway & REST Endpoints', category: 'Backend Services', status: 'Operational', latency: '35ms', uptime: '99.98%' },
    { name: 'Database Cluster & Auth Service', category: 'Data & Security', status: 'Operational', latency: '12ms', uptime: '100%' },
    { name: 'Realtime Activity & Notifications', category: 'WebSocket Services', status: 'Operational', latency: '40ms', uptime: '99.95%' },
    { name: 'Project & Skill Indexing Engine', category: 'Search & Matchmaking', status: 'Operational', latency: '55ms', uptime: '99.97%' },
    { name: 'CDN & Asset Storage Host', category: 'Content Delivery', status: 'Operational', latency: '15ms', uptime: '100%' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Overall Status Banner */}
      <ScrollReveal>
      <div className="bg-emerald-600 dark:bg-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-white"></span>
            </span>
          </div>
          <div>
            <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider block mb-1">Guild Code Infrastructure</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">All Systems Operational</h1>
            <p className="text-emerald-100 text-xs mt-1">All core services, APIs, and databases are running smoothly.</p>
          </div>
        </div>
        <div className="text-right shrink-0 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-xs text-emerald-100">
          Updated 1 min ago
        </div>
      </div>
      </ScrollReveal>

      {/* Metrics Row */}
      <ScrollReveal delay={100}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-5 shadow-xs text-center">
          <span className="text-xs text-[#5c7075] font-semibold block mb-1">90-Day Uptime</span>
          <span className="text-2xl font-extrabold text-[#091e22] dark:text-[#f1f5f9]">99.98%</span>
        </div>
        <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-5 shadow-xs text-center">
          <span className="text-xs text-[#5c7075] font-semibold block mb-1">Avg Response Time</span>
          <span className="text-2xl font-extrabold text-[#006655] dark:text-emerald-400">28ms</span>
        </div>
        <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-5 shadow-xs text-center">
          <span className="text-xs text-[#5c7075] font-semibold block mb-1">Active Incidents</span>
          <span className="text-2xl font-extrabold text-[#091e22] dark:text-[#f1f5f9]">0</span>
        </div>
      </div>
      </ScrollReveal>

      {/* Service List */}
      <ScrollReveal delay={200}>
      <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
        <h2 className="text-lg font-bold text-[#091e22] dark:text-[#f1f5f9] mb-4 pb-3 border-b border-[#006655]/30 dark:border-[#00a88a]/40 dark:border-[#00a88a]/20">
          Service Status Breakdown
        </h2>
        <div className="divide-y divide-[#006655]/30 dark:divide-[#00a88a]/40 dark:divide-[#00a88a]/20">
          {services.map((service, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-[#091e22] dark:text-[#f1f5f9]">{service.name}</h4>
                <span className="text-xs text-[#5c7075]">{service.category}</span>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="hidden sm:block text-right text-xs">
                  <span className="block font-medium text-slate-700 dark:text-slate-300">{service.latency} latency</span>
                  <span className="text-[11px] text-[#5c7075]">{service.uptime} uptime</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[#006655] dark:text-emerald-400 rounded-full text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#006655] dark:bg-emerald-400" />
                  {service.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Incident History */}
      <ScrollReveal delay={300}>
      <div className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-[#091e22] dark:text-[#f1f5f9] mb-3">Past Incident Log</h2>
        <div className="p-4 bg-slate-50 dark:bg-[#1a292c] rounded-xl border border-slate-150 dark:border-[#273b3e] text-xs text-slate-600 dark:text-slate-400">
          <p className="font-bold text-[#091e22] dark:text-[#f1f5f9] mb-1">No incidents reported today</p>
          <p>All core infrastructure services experienced 100% uptime over the past 30 consecutive days.</p>
        </div>
      </div>
      </ScrollReveal>

      <ScrollReveal delay={400}>
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#006655] dark:text-emerald-400 hover:underline"
        >
          &larr; Return to Ecosystem Home
        </Link>
      </div>
      </ScrollReveal>
    </div>
  );
};
