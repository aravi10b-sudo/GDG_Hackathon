import React, { useState } from 'react';
import { CandidateProject, CitizenTicket, DistrictData, HotspotCluster, Language } from '../../types';
import { t } from '../../utils/translations';
import { MetricCards } from './MetricCards';
import { DemandTrendChart } from './DemandTrendChart';
import { SpatialHeatmap } from './SpatialHeatmap';
import { HotspotClusterList } from './HotspotClusterList';
import { CitizenSentimentTracker } from './CitizenSentimentTracker';
import { ProjectPrioritizer } from './ProjectPrioritizer';
import { DPRMemoModal } from './DPRMemoModal';
import { BarChart3, Download, RefreshCw } from 'lucide-react';

interface PolicymakerPortalProps {
  language: Language;
  districts: DistrictData[];
  hotspots: HotspotCluster[];
  projects: CandidateProject[];
  tickets: CitizenTicket[];
  onUpdateProjects: (updated: CandidateProject[]) => void;
}

export const PolicymakerPortal: React.FC<PolicymakerPortalProps> = ({
  language,
  districts,
  hotspots,
  projects,
  tickets,
  onUpdateProjects,
}) => {
  const currentT = t[language];

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(
    districts.find((d) => d.id === 'ramanathapuram') || districts[0]
  );
  const [activeSector, setActiveSector] = useState<string>('all');
  const [selectedProjectForDPR, setSelectedProjectForDPR] = useState<CandidateProject | null>(null);

  // Compute metrics
  const totalTickets = tickets.reduce((acc, tkt) => acc + (tkt.upvotes || 1), 0);
  const avgMismatch = Math.round(
    districts.reduce((acc, d) => acc + d.alignment_mismatch_pct, 0) / districts.length
  );
  const criticalPanchayats = districts.filter((d) => d.overall_deficit_index >= 70).length * 4;
  const totalPipeline = projects.reduce((acc, p) => acc + p.budget_inr_crores, 0);

  const matchedDistrictObj = districts.find(
    (d) => d.name.toLowerCase() === selectedProjectForDPR?.district_name.toLowerCase()
  ) || selectedDistrict;

  const [exportSuccess, setExportSuccess] = useState(false);

  // CSV Report Generator for districts deficit & hotspots
  const handleExportCSV = () => {
    try {
      const escapeCsv = (val: string | number | undefined | null) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const headers = [
        'District ID',
        'District Name (English)',
        'District Name (Tamil)',
        'Population',
        'Overall Deficit Index (0-100)',
        'Water Deficit Score (%)',
        'Road Deficit Score (%)',
        'Health Deficit Score (%)',
        'Power Deficit Score (%)',
        'Citizen Demands / Tickets Logged',
        'Planned Capex (INR Crores)',
        'Required Capex by Citizen Need (INR Crores)',
        'Capex Alignment Mismatch (%)',
        'Top Unaddressed Infrastructure Deficit (EN)',
        'Top Unaddressed Infrastructure Deficit (TA)',
        'Associated Demand Hotspots Count',
        'Active Hotspot Summaries',
      ];

      const rows = districts.map((d) => {
        const districtHotspots = hotspots.filter(
          (h) => h.district_id === d.id || h.district_name.toLowerCase() === d.name.toLowerCase()
        );

        const hotspotSummary = districtHotspots
          .map((h) => `${h.title_en} [${h.sector.toUpperCase()} - Urgency: ${h.urgency}, Demands: ${h.ticket_count}, Est. Pop: ${h.estimated_beneficiaries}]`)
          .join('; ');

        return [
          escapeCsv(d.id),
          escapeCsv(d.name),
          escapeCsv(d.name_ta),
          escapeCsv(d.population),
          escapeCsv(d.overall_deficit_index),
          escapeCsv(d.water_deficit_score),
          escapeCsv(d.road_deficit_score),
          escapeCsv(d.health_deficit_score),
          escapeCsv(d.power_deficit_score),
          escapeCsv(d.citizen_tickets_count),
          escapeCsv(d.planned_capex_crores),
          escapeCsv(d.required_capex_crores),
          escapeCsv(`${d.alignment_mismatch_pct}%`),
          escapeCsv(d.top_unaddressed_demand),
          escapeCsv(d.top_unaddressed_demand_ta),
          escapeCsv(districtHotspots.length),
          escapeCsv(hotspotSummary || 'No critical multi-village cluster active'),
        ];
      });

      // UTF-8 BOM (\uFEFF) ensures proper Tamil & symbol rendering in Excel & Sheets
      const csvString = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.setAttribute('download', `JanVikas_Setu_District_Deficit_Report_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export CSV report:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Policymaker Hero Banner */}
      <div className="bg-[#0A192F] text-white rounded-lg p-5 md:p-7 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
              {language === 'ta' ? 'மாநில திட்டக் குழு அரங்கம்' : language === 'hi' ? 'राज्य योजना बोर्ड एवं पूंजीगत व्यय निगरानी' : 'State Planning Board & Capex Oversight'}
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-xs text-slate-400 font-mono">DPI Spatial Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
            {currentT.policy_hero_title}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {currentT.policy_hero_desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          {/* Explicit 'Export Report' Button requested by user */}
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md border transition-all cursor-pointer shadow-xs ${
              exportSuccess
                ? 'bg-emerald-700 text-white border-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
            title={currentT.export_report_sub}
          >
            <Download className="w-4 h-4" />
            <span>{exportSuccess ? (language === 'ta' ? 'பதிவிறக்கம் ஆனது!' : language === 'hi' ? 'रिपोर्ट डाउनलोड हो गई!' : 'Report Exported!') : currentT.export_report_btn}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'அச்சு / PDF' : language === 'hi' ? 'प्रिंट / पीडीएफ़' : 'Print Briefing'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Institutional KPI Metric Cards */}
      <MetricCards
        language={language}
        totalTickets={totalTickets}
        avgMismatchPct={avgMismatch}
        criticalPanchayatsCount={criticalPanchayats}
        totalPipelineCrores={totalPipeline}
      />

      {/* 30-Day Citizen Demand Trend Chart (Recharts) */}
      <DemandTrendChart
        tickets={tickets}
        language={language}
      />

      {/* Spatial Demand Heatmap & District Dossier */}
      <SpatialHeatmap
        districts={districts}
        language={language}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        activeSector={activeSector}
        onSelectSector={setActiveSector}
        tickets={tickets}
      />

      {/* Systemic AI Demand Hotspots */}
      <HotspotClusterList
        hotspots={hotspots}
        language={language}
      />

      {/* Citizen Demand & Text Sentiment Intelligence Audit with Sentiment Badges */}
      <CitizenSentimentTracker
        tickets={tickets}
        language={language}
      />

      {/* Multi-Criteria Gemini Project Prioritization Matrix */}
      <ProjectPrioritizer
        projects={projects}
        districts={districts}
        hotspots={hotspots}
        language={language}
        onSelectProjectForDPR={setSelectedProjectForDPR}
        onUpdateProjects={onUpdateProjects}
      />

      {/* Cabinet-Ready DPR Modal */}
      {selectedProjectForDPR && (
        <DPRMemoModal
          project={selectedProjectForDPR}
          district={matchedDistrictObj || undefined}
          language={language}
          onClose={() => setSelectedProjectForDPR(null)}
        />
      )}
    </div>
  );
};
