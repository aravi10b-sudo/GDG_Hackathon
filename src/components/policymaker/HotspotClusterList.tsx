import React from 'react';
import { HotspotCluster, Language } from '../../types';
import { t } from '../../utils/translations';
import { Flame, Users, MapPin, Building, ArrowUpRight } from 'lucide-react';

interface HotspotClusterListProps {
  hotspots: HotspotCluster[];
  language: Language;
  onSelectCluster?: (cluster: HotspotCluster) => void;
}

export const HotspotClusterList: React.FC<HotspotClusterListProps> = ({
  hotspots,
  language,
  onSelectCluster,
}) => {
  const currentT = t[language];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            {currentT.hotspots_title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentT.hotspots_desc}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 self-start">
          {hotspots.length} Systemic Clusters Identified
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotspots.map((hs) => {
          const isCritical = hs.urgency === 'critical';

          return (
            <div
              key={hs.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Unboxed Metadata Row */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {hs.district_name}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600 capitalize">{hs.sector}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span
                    className={`font-semibold uppercase text-[10px] ${
                      isCritical ? 'text-rose-700' : 'text-amber-700'
                    }`}
                  >
                    {hs.urgency}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-sm md:text-base text-slate-900 mb-1.5 leading-snug">
                  {language === 'ta' ? hs.title_ta : hs.title_en}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {language === 'ta' ? hs.key_complaint_summary_ta : hs.key_complaint_summary_en}
                </p>
              </div>

              {/* Cluster Stats Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    Demand: <strong className="text-slate-900 font-mono">{hs.ticket_count}</strong> voice notes
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>
                    Spread: <strong className="text-slate-900 font-mono">{hs.affected_villages_count}</strong> villages
                  </span>
                </div>
                <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {hs.estimated_beneficiaries.toLocaleString('en-IN')} beneficiaries
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
