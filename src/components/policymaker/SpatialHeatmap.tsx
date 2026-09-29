import React, { useState } from 'react';
import { CitizenTicket, DistrictData, InfrastructureCategory, Language } from '../../types';
import { t } from '../../utils/translations';
import { MapPin, Layers, X, TrendingUp, AlertCircle, DollarSign, Users, HeartCrack } from 'lucide-react';
import { SentimentBadge } from '../common/SentimentBadge';
import { attachSentimentToTicket } from '../../utils/sentimentAnalyzer';

interface SpatialHeatmapProps {
  districts: DistrictData[];
  language: Language;
  selectedDistrict: DistrictData | null;
  onSelectDistrict: (district: DistrictData) => void;
  activeSector: string;
  onSelectSector: (sector: string) => void;
  tickets?: CitizenTicket[];
}

export const SpatialHeatmap: React.FC<SpatialHeatmapProps> = ({
  districts,
  language,
  selectedDistrict,
  onSelectDistrict,
  activeSector,
  onSelectSector,
  tickets = [],
}) => {
  const currentT = t[language];
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);

  // Toggle between Citizen Demand Intensity and Infrastructure Deficit Index
  const [mapMetric, setMapMetric] = useState<'demand_intensity' | 'deficit_index'>('demand_intensity');

  // Helper to get score based on active sector filter
  const getSectorScore = (district: DistrictData) => {
    switch (activeSector) {
      case 'water':
        return district.water_deficit_score;
      case 'roads':
        return district.road_deficit_score;
      case 'power':
        return district.power_deficit_score;
      case 'health':
        return district.health_deficit_score;
      default:
        return district.overall_deficit_index;
    }
  };

  const getDeficitColor = (score: number) => {
    if (score >= 75) return '#991B1B'; // Critical dark red
    if (score >= 60) return '#DC2626'; // High red
    if (score >= 45) return '#D97706'; // Moderate amber
    return '#059669'; // Low emerald
  };

  // Direct Demand Intensity Color Mapping from citizen_tickets_count
  const getDemandColor = (ticketsCount: number) => {
    if (ticketsCount >= 400) return '#991B1B'; // Critical Crimson (400+ complaints)
    if (ticketsCount >= 300) return '#DC2626'; // High Demand Red (300-399)
    if (ticketsCount >= 250) return '#EA580C'; // Elevated Orange-Red (250-299)
    if (ticketsCount >= 200) return '#D97706'; // Moderate Amber (200-249)
    return '#059669'; // Stable Emerald (<200)
  };

  const getDistrictNodeColor = (district: DistrictData) => {
    if (mapMetric === 'demand_intensity') {
      return getDemandColor(district.citizen_tickets_count);
    }
    return getDeficitColor(getSectorScore(district));
  };

  const getNodeRadius = (district: DistrictData, baseR: number) => {
    if (mapMetric === 'demand_intensity') {
      // Scale radius proportionally between 35 and 52 based on citizen demand volume
      return Math.max(34, Math.min(52, 32 + (district.citizen_tickets_count / 520) * 18));
    }
    return baseR;
  };

  // Deterministic string hash used only to jitter overlapping same-state district nodes.
  const hashOffset = (seed: string, range: number): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return (hash % (range * 2 + 1)) - range;
  };

  // Projects a district's approximate lat/lng onto the 540x500 SVG viewBox (India bounding box).
  const getDistrictLayout = (district: DistrictData): { x: number; y: number; r: number } => {
    const minLat = 6.5;
    const maxLat = 37.6;
    const minLng = 68.0;
    const maxLng = 97.5;
    const padding = 40;
    const width = 540;
    const height = 500;

    const { lat, lng } = district.center_coords;
    const xRatio = (lng - minLng) / (maxLng - minLng);
    const yRatio = (maxLat - lat) / (maxLat - minLat);

    const baseX = padding + xRatio * (width - padding * 2);
    const baseY = padding + yRatio * (height - padding * 2);

    const x = Math.min(510, Math.max(30, baseX + hashOffset(`${district.id}-x`, 14)));
    const y = Math.min(470, Math.max(30, baseY + hashOffset(`${district.id}-y`, 14)));

    return { x, y, r: 30 };
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs">
      {/* Header and Mode / Sector Toggle Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base md:text-lg font-bold text-slate-900">
              {mapMetric === 'demand_intensity'
                ? (language === 'ta' ? 'மாவட்ட மக்கள் தேவை தீவிரம் (Demand Intensity Heatmap)' : language === 'hi' ? 'जिला नागरिक मांग तीव्रता हीटमैप' : 'District Citizen Demand Intensity Heatmap')
                : currentT.map_section_title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {mapMetric === 'demand_intensity'
              ? (language === 'ta'
                  ? 'ஒவ்வொரு மாவட்டத்தின் மக்கள் குறை எண்ணிக்கை (Citizen Tickets) அடிப்படையில் தானாக வண்ணமிடப்பட்ட வெப்ப வரைபடம்.'
                  : language === 'hi'
                  ? 'प्रत्येक जिले की सत्यापित नागरिक शिकायतों की संख्या के आधार पर स्वतः रंगीन SVG स्थानिक हीटमैप।'
                  : 'SVG spatial heatmap directly color-coding district demand intensity from verified citizen tickets.')
              : (language === 'ta'
                  ? 'மாவட்டங்களின் உண்மையான மக்கள் குறை மற்றும் உள்கட்டமைப்பு பற்றாக்குறை ஒப்பீடு.'
                  : language === 'hi'
                  ? 'जिलों की वास्तविक नागरिक मांग और अवसंरचना कमी की तुलना, NFHS एवं पीएम गतिशक्ति सूचकांकों के साथ।'
                  : 'Interactive district-level spatial index combining citizen demand with NFHS & PM GatiShakti indices.')}
          </p>
        </div>

        {/* Heatmap View Switcher & Sector Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Mode Switcher: Demand Intensity vs Deficit Index */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-300 text-xs">
            <button
              onClick={() => setMapMetric('demand_intensity')}
              className={`px-3 py-1.5 rounded-sm font-semibold transition-all cursor-pointer ${
                mapMetric === 'demand_intensity'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {language === 'ta' ? 'மக்கள் தேவை' : language === 'hi' ? 'मांग तीव्रता' : 'Demand Intensity'}
            </button>
            <button
              onClick={() => setMapMetric('deficit_index')}
              className={`px-3 py-1.5 rounded-sm font-semibold transition-all cursor-pointer ${
                mapMetric === 'deficit_index'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {language === 'ta' ? 'பற்றாக்குறை குறியீடு' : language === 'hi' ? 'कमी सूचकांक' : 'Deficit Index'}
            </button>
          </div>

          {/* Sector Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-300 text-xs">
            {['all', 'water', 'roads', 'power', 'health'].map((sector) => (
              <button
                key={sector}
                onClick={() => onSelectSector(sector)}
                className={`px-3 py-1.5 rounded-sm font-semibold capitalize transition-all cursor-pointer ${
                  activeSector === sector
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {sector === 'all'
                  ? (language === 'ta' ? 'அனைத்தும்' : language === 'hi' ? 'सभी' : 'All')
                  : (currentT as Record<string, string>)[`cat_${sector}`] || sector}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#0F172A] rounded-lg p-4 space-y-2.5">
          {/* SVG Map Canvas */}
          <div className="relative w-full h-[380px] my-auto">
            <svg viewBox="0 0 540 500" className="w-full h-full select-none">
              {/* District Node Polygons / Nodes with Direct Color-Coding */}
              {districts.map((d) => {
                const layout = getDistrictLayout(d);
                const nodeColor = getDistrictNodeColor(d);
                const nodeRadius = getNodeRadius(d, layout.r);
                const isSelected = selectedDistrict?.id === d.id;
                const isHighIntensity = mapMetric === 'demand_intensity' ? d.citizen_tickets_count >= 300 : d.overall_deficit_index >= 70;

                return (
                  <g
                    key={d.id}
                    onClick={() => onSelectDistrict(d)}
                    onMouseEnter={() => setHoveredDistrict(d)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="cursor-pointer transition-transform duration-200"
                    transform={`translate(${layout.x}, ${layout.y})`}
                  >
                    {/* Pulsing halo for high intensity hotspots */}
                    {(isHighIntensity || isSelected) && (
                      <circle
                        r={nodeRadius + 8}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="2.5"
                        strokeOpacity="0.45"
                        className="animate-pulse"
                      />
                    )}

                    {/* Outer ring */}
                    <circle
                      r={nodeRadius}
                      fill={nodeColor}
                      fillOpacity={isSelected ? 0.95 : 0.8}
                      stroke={isSelected ? '#F8FAFC' : '#0F172A'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all hover:scale-105"
                    />

                    {/* District Name Label */}
                    <text
                      y={-8}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={11.5}
                      fontWeight="700"
                      className="pointer-events-none drop-shadow-sm"
                    >
                      {language === 'ta' ? d.name_ta : d.name}
                    </text>

                    {/* Prominent Demand Count or Deficit Score */}
                    {mapMetric === 'demand_intensity' ? (
                      <>
                        <text
                          y={8}
                          textAnchor="middle"
                          fill="#FEF08A"
                          fontSize={11}
                          fontWeight="700"
                          fontFamily="monospace"
                          className="pointer-events-none"
                        >
                          {d.citizen_tickets_count} Demands
                        </text>
                        <text
                          y={21}
                          textAnchor="middle"
                          fill="#E2E8F0"
                          fontSize={8.5}
                          className="pointer-events-none"
                        >
                          Gap: {d.alignment_mismatch_pct}%
                        </text>
                      </>
                    ) : (
                      <>
                        <text
                          y={8}
                          textAnchor="middle"
                          fill="#E2E8F0"
                          fontSize={10}
                          fontFamily="monospace"
                          className="pointer-events-none"
                        >
                          Deficit: {getSectorScore(d)}
                        </text>
                        <text
                          y={20}
                          textAnchor="middle"
                          fill="#FDE68A"
                          fontSize={8.5}
                          className="pointer-events-none"
                        >
                          {d.citizen_tickets_count} tickets
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dynamic Map Color Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 pt-2.5 border-t border-slate-800">
            <span className="font-semibold text-slate-400">
              {mapMetric === 'demand_intensity' ? 'Citizen Demand Intensity Scale:' : 'Infrastructure Deficit Scale:'}
            </span>
            {mapMetric === 'demand_intensity' ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#991B1B]" />
                  <span>Critical Hotspot (400+)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span>High Demand (300-399)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                  <span>Elevated (250-299)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  <span>Moderate (&lt;250)</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                  <span>{currentT.map_legend_low}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <span>{currentT.map_legend_mid}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span>{currentT.map_legend_high}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* District Dossier Drawer / Card */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-5">
          {selectedDistrict ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                    {currentT.district_drawer_title}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900">
                    {language === 'ta' ? selectedDistrict.name_ta : selectedDistrict.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Pop: {selectedDistrict.population.toLocaleString('en-IN')} residents
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Overall Deficit</span>
                  <span
                    className="text-xl font-bold font-mono"
                    style={{ color: getDeficitColor(selectedDistrict.overall_deficit_index) }}
                  >
                    {selectedDistrict.overall_deficit_index} / 100
                  </span>
                </div>
              </div>

              {/* Sector-by-Sector Progress Breakdown */}
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Infrastructure Gaps by Domain:
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Water Deficit (JJM Coverage Gap)</span>
                      <span className="font-mono font-medium">{selectedDistrict.water_deficit_score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full"
                        style={{ width: `${selectedDistrict.water_deficit_score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Road Deficit (PMGSY Unpaved Corridors)</span>
                      <span className="font-mono font-medium">{selectedDistrict.road_deficit_score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full"
                        style={{ width: `${selectedDistrict.road_deficit_score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Health Infrastructure Deficit</span>
                      <span className="font-mono font-medium">{selectedDistrict.health_deficit_score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full rounded-full"
                        style={{ width: `${selectedDistrict.health_deficit_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Planned vs Required Capex Comparison */}
              <div className="p-3 bg-white border border-slate-200 rounded-md">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Public Investment Alignment:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Current Planned Capex</span>
                    <span className="font-mono font-bold text-slate-800">
                      ₹{selectedDistrict.planned_capex_crores} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Citizen Demand Required</span>
                    <span className="font-mono font-bold text-rose-700">
                      ₹{selectedDistrict.required_capex_crores} Cr
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Unfunded Demand Gap:</span>
                  <span className="font-mono font-semibold text-rose-600">
                    +{selectedDistrict.alignment_mismatch_pct}% Capex Deficit
                  </span>
                </div>
              </div>

              {/* Top Unaddressed Demand */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-md text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-semibold mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>AI Hotspot Summary:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {language === 'ta'
                    ? selectedDistrict.top_unaddressed_demand_ta
                    : selectedDistrict.top_unaddressed_demand}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 font-mono">
                  {selectedDistrict.citizen_tickets_count} citizen complaints logged in this taluk cluster.
                </div>
              </div>

              {/* District Specific Citizen Grievances & Sentiment Scores */}
              {(() => {
                const districtTickets = tickets
                  .filter((t) => t.district.toLowerCase() === selectedDistrict.name.toLowerCase())
                  .map((t) => attachSentimentToTicket(t));

                if (districtTickets.length === 0) return null;

                return (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-xs font-semibold text-slate-800 flex items-center justify-between mb-2">
                      <span>{language === 'ta' ? 'இம்மாவட்ட உணர்வு மதிப்பீடு (Sentiment Scores):' : language === 'hi' ? 'जिला शिकायत भावना स्कोर:' : 'District Grievance Sentiment Scores:'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{districtTickets.length} Analyzed</span>
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {districtTickets.map((tkt) => (
                        <div key={tkt.id} className="p-2 bg-white rounded border border-slate-200 text-xs">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-semibold text-slate-800 text-[11px] truncate flex-1">
                              {language === 'ta' ? tkt.title_ta : tkt.title_en}
                            </span>
                            <SentimentBadge sentiment={tkt.sentiment} language={language} />
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                            "{tkt.raw_submission || tkt.description_en}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a district node on the spatial grid to inspect infrastructure deficit indicators.
            </div>
          )}
        </div>
      </div>

      {/* Visual District Demand Intensity Comparative Grid */}
      <div className="mt-5 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>{language === 'ta' ? 'அனைத்து மாவட்டங்களின் தேவை ஒப்பீட்டு வெப்பப் பட்டை' : language === 'hi' ? 'सभी जिलों की मांग तीव्रता रैंकिंग एवं हीट बार' : 'All Districts Demand Intensity Ranking & Heat Bars'}</span>
              <span className="text-slate-400 font-normal">({districts.length} Districts Analyzed)</span>
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Sorted by total verified citizen grievances
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...districts]
            .sort((a, b) => b.citizen_tickets_count - a.citizen_tickets_count)
            .map((dist) => {
              const maxTickets = 550;
              const pct = Math.min(100, Math.round((dist.citizen_tickets_count / maxTickets) * 100));
              const color = getDemandColor(dist.citizen_tickets_count);
              const isSelected = selectedDistrict?.id === dist.id;

              return (
                <div
                  key={dist.id}
                  onClick={() => onSelectDistrict(dist)}
                  className={`p-3 rounded-md border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#0F2744] ring-1 ring-[#0F2744] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">
                      {language === 'ta' ? dist.name_ta : dist.name}
                    </span>
                    <span
                      className="font-mono font-bold text-xs px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: color }}
                    >
                      {dist.citizen_tickets_count}
                    </span>
                  </div>

                  {/* Progress Heat Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{dist.overall_deficit_index}% deficit</span>
                    <span>₹{dist.required_capex_crores} Cr required</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
