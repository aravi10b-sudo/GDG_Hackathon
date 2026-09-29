import React from 'react';
import { Language } from '../../types';
import { t } from '../../utils/translations';
import { MessageSquareWarning, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MetricCardsProps {
  language: Language;
  totalTickets: number;
  avgMismatchPct: number;
  criticalPanchayatsCount: number;
  totalPipelineCrores: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  language,
  totalTickets,
  avgMismatchPct,
  criticalPanchayatsCount,
  totalPipelineCrores,
}) => {
  const currentT = t[language];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Citizen Tickets */}
      <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {currentT.kpi_total_tickets}
          </span>
          <MessageSquareWarning className="w-4 h-4 text-[#0F2744]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900">
            {totalTickets.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            +18% this wk
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {currentT.kpi_total_tickets_sub}
        </p>
      </div>

      {/* 2. Capex Alignment Gap */}
      <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {currentT.kpi_mismatch_rate}
          </span>
          <TrendingDown className="w-4 h-4 text-rose-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold font-mono text-rose-700">
            {avgMismatchPct}%
          </span>
          <span className="text-xs font-semibold text-rose-600">
            High Mismatch
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {currentT.kpi_mismatch_rate_sub}
        </p>
      </div>

      {/* 3. High Deficit Panchayats */}
      <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {currentT.kpi_high_deficit_panchayats}
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold font-mono text-slate-900">
            {criticalPanchayatsCount}
          </span>
          <span className="text-xs text-slate-500">
            across 4 districts
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {currentT.kpi_high_deficit_sub}
        </p>
      </div>

      {/* 4. Citizen-Aligned Capex Pipeline */}
      <div className="bg-white p-4 md:p-5 rounded-lg border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {currentT.kpi_sanctioned_capex}
          </span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-800">
            ₹{totalPipelineCrores.toFixed(1)} Cr
          </span>
          <span className="text-xs text-emerald-700 font-medium">
            5 Projects
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {currentT.kpi_sanctioned_sub}
        </p>
      </div>
    </div>
  );
};
