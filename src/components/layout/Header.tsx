import React from 'react';
import { Language, PortalMode } from '../../types';
import { t } from '../../utils/translations';
import { Globe, ShieldCheck, Activity, Users, BarChart3, Bot } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  portalMode: PortalMode;
  onSelectPortalMode: (mode: PortalMode) => void;
  ticketsCount: number;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  portalMode,
  onSelectPortalMode,
  ticketsCount,
  onOpenChat,
}) => {
  const currentT = t[language];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top micro bar for institutional identity */}
      <div className="bg-[#0A192F] text-slate-300 text-xs py-1.5 px-4 md:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-100">{currentT.emblem_text}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-amber-300/90">{currentT.state_subtitle}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">PM GatiShakti & JJM Integrated</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>{ticketsCount.toLocaleString('en-IN')} Active Grievance Demands</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 text-amber-300 hover:text-white font-medium transition-colors px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
              title="Switch language / மொழி மாற்றம்"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentT.lang_toggle}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Crest */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#0F2744] text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm border border-slate-700 select-none">
            {/* Ashoka Chakra inspired emblem */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current stroke-current stroke-0.5">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="12"
                  y1="12"
                  x2={12 + 8 * Math.cos((deg * Math.PI) / 180)}
                  y2={12 + 8 * Math.sin((deg * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.85"
                />
              ))}
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                {currentT.app_title}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                DPG 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {currentT.app_subtitle}
            </p>
          </div>
        </div>

        {/* Dual Portal Segmented Switch & Gemini Copilot Trigger */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onSelectPortalMode('citizen')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                portalMode === 'citizen'
                  ? 'bg-[#0F2744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{currentT.portal_citizen}</span>
            </button>
            <button
              onClick={() => onSelectPortalMode('policymaker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                portalMode === 'policymaker'
                  ? 'bg-[#0F2744] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{currentT.portal_policymaker}</span>
            </button>
          </div>

          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-2xs border border-emerald-600 transition-all cursor-pointer"
              title="Open Gemini Context-Aware Copilot"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>{language === 'ta' ? 'Gemini ஆலோசகர்' : language === 'hi' ? 'जेमिनी सलाहकार' : 'Gemini Copilot'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
