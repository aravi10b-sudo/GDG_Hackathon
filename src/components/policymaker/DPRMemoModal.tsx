import React, { useState, useEffect } from 'react';
import { CandidateProject, DistrictData, DPRMemo, Language } from '../../types';
import { t } from '../../utils/translations';
import { generateDPRMemoAI } from '../../services/apiService';
import { X, Printer, Copy, Check, Sparkles, Building, Landmark, FileCheck } from 'lucide-react';

interface DPRMemoModalProps {
  project: CandidateProject | null;
  district: DistrictData | undefined;
  language: Language;
  onClose: () => void;
}

export const DPRMemoModal: React.FC<DPRMemoModalProps> = ({
  project,
  district,
  language,
  onClose,
}) => {
  if (!project) return null;
  const currentT = t[language];

  const [dprData, setDprData] = useState<DPRMemo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchDPR() {
      if (!project) return;
      setLoading(true);
      try {
        const result = await generateDPRMemoAI(
          project,
          district,
          project.citizen_tickets_linked || 140,
          [
            'Pipeline leaks are contaminating local wells for 3 consecutive weeks.',
            'Ambulances cannot enter village during rainfall due to mud cratering.',
            'Frequent transformer burnouts destroying drip irrigation pumps.',
          ]
        );
        if (isMounted) {
          setDprData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDPR();
    return () => {
      isMounted = false;
    };
  }, [project, district]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (!dprData) return;
    const text = `
CABINET MEMORANDUM (GOVERNMENT OF TAMIL NADU)
Reference No: ${dprData.memo_reference_no}
Title: ${dprData.executive_title_en}
District: ${district?.name || project.district_name}
Estimated Outlay: ₹${project.budget_inr_crores} Crores

STRATEGIC CONTEXT:
${dprData.strategic_context_en}

CITIZEN EVIDENCE:
${dprData.citizen_demand_evidence.map((e) => `- ${e}`).join('\n')}

BUDGET BREAKDOWN:
${dprData.budget_breakdown.map((b) => `- ${b.component}: ₹${b.cost_crores} Cr (${b.percentage}%)`).join('\n')}

RECOMMENDED CABINET APPROVAL:
${dprData.recommended_approval}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg border border-slate-300 max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        {/* Official Letterhead Header */}
        <div className="bg-[#0A192F] text-white p-5 border-b-2 border-amber-500 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-[#0F2744] border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold block">
                CABINET SECRETARIAT · INFRASTRUCTURE EMPOWERED COMMITTEE
              </span>
              <h3 className="text-base md:text-lg font-bold text-white leading-tight">
                {currentT.dpr_modal_title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentT.dpr_modal_sub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-slate-700">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="font-semibold text-slate-800 text-sm">{currentT.dpr_generating}</p>
              <p className="text-slate-400 text-xs">
                Synthesizing PM GatiShakti spatial data with grassroots Tamil Nadu voice complaints...
              </p>
            </div>
          ) : dprData ? (
            <>
              {/* Reference & Metadata Header Banner */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Official Memo Ref</span>
                  <span className="font-mono text-sm font-bold text-[#0F2744]">
                    {dprData.memo_reference_no}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Proposed Capex</span>
                  <span className="font-mono text-sm font-bold text-emerald-800">
                    ₹{project.budget_inr_crores} Crores
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Target District</span>
                  <span className="font-semibold text-slate-800">
                    {project.district_name}, Tamil Nadu
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Verified Citizen Demand</span>
                  <span className="font-mono font-bold text-slate-900">
                    {project.citizen_tickets_linked} Grievances
                  </span>
                </div>
              </div>

              {/* Title Section */}
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  {language === 'ta' ? dprData.executive_title_ta : dprData.executive_title_en}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'ta' ? dprData.executive_title_en : dprData.executive_title_ta}
                </p>
              </div>

              {/* Strategic Background */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  1. Strategic Justification & Spatial Need
                </h5>
                <p className="leading-relaxed bg-white p-3 rounded border border-slate-200 text-slate-800">
                  {language === 'ta' ? dprData.strategic_context_ta : dprData.strategic_context_en}
                </p>
              </div>

              {/* Citizen Demand Evidence */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  2. Ground Evidence from JanVikas Setu Citizen Voice Intake
                </h5>
                <ul className="space-y-1.5">
                  {dprData.citizen_demand_evidence.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-emerald-50/50 border border-emerald-100 rounded text-slate-800">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Financial & Component Outlay */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  3. Proposed Capex Component Outlay
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {dprData.budget_breakdown.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <span className="text-[11px] text-slate-500 block truncate">{item.component}</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-mono text-base font-bold text-slate-900">
                          ₹{item.cost_crores} Cr
                        </span>
                        <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Socio-economic ROI */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  4. Projected Socio-Economic & Health Returns
                </h5>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed">
                  {language === 'ta' ? dprData.socio_economic_impact_ta : dprData.socio_economic_impact_en}
                </p>
              </div>

              {/* Milestones */}
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                  5. Implementation Milestones
                </h5>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded">
                  {dprData.implementation_milestones.map((m, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-xs bg-white">
                      <span className="font-medium text-slate-800">{m.phase}</span>
                      <span className="font-mono text-slate-500">{m.timeline}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Cabinet Order */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-md">
                <span className="text-amber-900 font-bold block mb-1">
                  Recommended Order of the Cabinet Committee:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed italic">
                  "{dprData.recommended_approval}"
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={loading || !dprData}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentT.dpr_print_btn}</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={loading || !dprData}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : currentT.dpr_copy_btn}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F2744] hover:bg-[#0A192F] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            {currentT.dpr_close_btn}
          </button>
        </div>
      </div>
    </div>
  );
};
