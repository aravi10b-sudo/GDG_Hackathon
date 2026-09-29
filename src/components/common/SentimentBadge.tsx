import React from 'react';
import { SentimentScore, Language } from '../../types';
import { AlertCircle, AlertTriangle, ShieldCheck, Flame, Gauge } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment?: SentimentScore;
  language: Language;
  showDetails?: boolean;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  sentiment,
  language,
  showDetails = false,
}) => {
  if (!sentiment) return null;

  const { score, tone, label_en, label_ta, frustration_index, urgency_index, triggers } = sentiment;

  // Institutional color scheme respecting zero-pill discipline (structured box with borders, no generic pill slop)
  let badgeStyles = 'border-slate-300 bg-slate-50 text-slate-700';
  let scoreColor = 'text-slate-900';
  let icon = <Gauge className="w-3.5 h-3.5 text-slate-500" />;

  if (tone === 'critical') {
    badgeStyles = 'border-rose-300 bg-rose-50/70 text-rose-900';
    scoreColor = 'text-rose-700 font-bold';
    icon = <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />;
  } else if (tone === 'high') {
    badgeStyles = 'border-amber-300 bg-amber-50/70 text-amber-900';
    scoreColor = 'text-amber-700 font-bold';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
  } else if (tone === 'moderate') {
    badgeStyles = 'border-yellow-300 bg-yellow-50/60 text-yellow-900';
    scoreColor = 'text-yellow-800 font-semibold';
    icon = <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />;
  } else {
    badgeStyles = 'border-emerald-200 bg-emerald-50/60 text-emerald-900';
    scoreColor = 'text-emerald-800 font-medium';
    icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
  }

  const label = language === 'ta' ? label_ta : label_en;

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium shadow-2xs ${badgeStyles}`}
        title={`Sentiment Score: ${score}/100 (Frustration: ${frustration_index}%, Urgency: ${urgency_index}%)`}
      >
        {icon}
        <span className="font-mono text-[11px] font-bold">{score}/100</span>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <span className="tracking-tight text-[11px] font-semibold">{label}</span>
      </div>

      {showDetails && triggers && triggers.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-500 font-mono mt-0.5">
          <span className="text-slate-400">Triggers:</span>
          {triggers.map((trig, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
              {trig}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
