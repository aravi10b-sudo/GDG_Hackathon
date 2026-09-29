import React, { useState } from 'react';
import { CandidateProject, DistrictData, HotspotCluster, Language } from '../../types';
import { t } from '../../utils/translations';
import { Sparkles, FileText, ArrowRight, ShieldCheck, Check, TrendingUp } from 'lucide-react';
import { prioritizeProjectsAI } from '../../services/apiService';

interface ProjectPrioritizerProps {
  projects: CandidateProject[];
  districts: DistrictData[];
  hotspots: HotspotCluster[];
  language: Language;
  onSelectProjectForDPR: (project: CandidateProject) => void;
  onUpdateProjects: (updated: CandidateProject[]) => void;
}

export const ProjectPrioritizer: React.FC<ProjectPrioritizerProps> = ({
  projects,
  districts,
  hotspots,
  language,
  onSelectProjectForDPR,
  onUpdateProjects,
}) => {
  const currentT = t[language];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [districtFilter, setDistrictFilter] = useState('all');

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const selectedDistrictObj = districts.find((d) => d.name === districtFilter);
      const res = await prioritizeProjectsAI(
        selectedDistrictObj ? selectedDistrictObj.name : 'National Infrastructure Pipeline',
        hotspots,
        projects
      );

      if (res && res.projects) {
        const updatedProjects = projects.map((orig) => {
          const match = res.projects.find((p: any) => p.id === orig.id);
          if (match) {
            return {
              ...orig,
              impact_score: match.impact_score,
              citizen_alignment_index: match.citizen_alignment_index,
              deficit_urgency_score: match.deficit_urgency_score,
              recommended_tier: match.recommended_tier,
              rationale_en: match.rationale_en,
              rationale_ta: match.rationale_ta,
              estimated_beneficiaries: match.estimated_beneficiaries || orig.estimated_beneficiaries,
            };
          }
          return orig;
        });

        // Sort descending by impact score
        updatedProjects.sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0));
        onUpdateProjects(updatedProjects);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    return districtFilter === 'all' || p.district_name === districtFilter;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs">
      {/* Header and Run AI Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {currentT.matrix_title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {currentT.matrix_desc}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="all">{language === 'ta' ? 'அனைத்து மாவட்டங்களும்' : language === 'hi' ? 'सभी ज़िले' : 'All Districts'}</option>
            <option value="Ramanathapuram">Ramanathapuram</option>
            <option value="Dharmapuri">Dharmapuri</option>
            <option value="Madurai">Madurai</option>
            <option value="Salem">Salem</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>

          <button
            onClick={handleRunAIAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#0F2744] hover:bg-[#0A192F] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? currentT.analyzing_pipeline : currentT.btn_run_prioritization}</span>
          </button>
        </div>
      </div>

      {/* Prioritization Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
              <th className="py-2.5 px-3">{currentT.col_project}</th>
              <th className="py-2.5 px-3">{currentT.col_district}</th>
              <th className="py-2.5 px-3">{currentT.col_budget}</th>
              <th className="py-2.5 px-3">Citizen Need Index</th>
              <th className="py-2.5 px-3">{currentT.col_score}</th>
              <th className="py-2.5 px-3">{currentT.col_tier}</th>
              <th className="py-2.5 px-3 text-right">{currentT.col_action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.map((p, idx) => {
              const score = p.impact_score || 80;
              const isFastTrack = score >= 90;

              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Project Title & Sector */}
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-semibold text-slate-900 text-xs leading-snug">
                      {language === 'ta' ? p.title_ta : p.title_en}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="capitalize">{p.sector}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{p.citizen_tickets_linked} citizen complaints verified</span>
                    </div>
                  </td>

                  {/* District */}
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {p.district_name}
                  </td>

                  {/* Budget */}
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                    ₹{p.budget_inr_crores} Cr
                  </td>

                  {/* Citizen Alignment Progress */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">
                        {p.citizen_alignment_index || 88}%
                      </span>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${p.citizen_alignment_index || 88}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Overall Impact Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-mono text-sm font-bold ${
                        isFastTrack ? 'text-emerald-700' : 'text-slate-800'
                      }`}>
                        {score}
                      </span>
                      <span className="text-slate-400 text-[10px]">/ 100</span>
                    </div>
                  </td>

                  {/* Recommended Tier */}
                  <td className="py-3 px-3 font-medium text-[11px]">
                    <span className={isFastTrack ? 'text-emerald-800 font-semibold' : 'text-slate-600'}>
                      {p.recommended_tier || (isFastTrack ? 'Immediate (Fast-Track)' : 'Q1 FY27')}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectProjectForDPR(p)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-[#0F2744] text-slate-800 hover:text-white rounded border border-slate-300 hover:border-[#0F2744] text-xs font-medium transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{currentT.btn_generate_dpr}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
