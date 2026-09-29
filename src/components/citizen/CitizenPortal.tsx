import React, { useState } from 'react';
import { CitizenIntakeMode, CitizenTicket, DistrictData, Language } from '../../types';
import { t } from '../../utils/translations';
import { VoiceRecorder } from './VoiceRecorder';
import { WhatsAppSimulator } from './WhatsAppSimulator';
import { GrievanceForm } from './GrievanceForm';
import { CommunityFeed } from './CommunityFeed';
import { Mic, MessageSquare, FileText, CheckCircle2 } from 'lucide-react';

interface CitizenPortalProps {
  language: Language;
  tickets: CitizenTicket[];
  onTicketGenerated: (ticket: CitizenTicket) => void;
  onUpvoteTicket: (ticketId: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  districts: DistrictData[];
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  language,
  tickets,
  onTicketGenerated,
  onUpvoteTicket,
  selectedDistrict,
  onSelectDistrict,
  districts,
}) => {
  const currentT = t[language];
  const [intakeMode, setIntakeMode] = useState<CitizenIntakeMode>('voice');

  return (
    <div className="space-y-6">
      {/* Citizen Hero Banner */}
      <div className="bg-[#0F2744] text-white rounded-lg p-5 md:p-7 shadow-sm border border-slate-800">
        <div className="max-w-3xl">
          <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1 block">
            {language === 'ta' ? 'அனைவருக்கும் எளிய குறைதீர்ப்பு தளம்' : language === 'hi' ? 'सभी के लिए समावेशी बहुभाषी सुविधा' : 'Inclusive Multilingual Intake'}
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
            {currentT.citizen_hero_title}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {currentT.citizen_hero_desc}
          </p>
        </div>

        {/* Channel Selector Segmented Controls */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap gap-2">
          <button
            onClick={() => setIntakeMode('voice')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              intakeMode === 'voice'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-300" />
            <span>{currentT.tab_voice}</span>
          </button>
          <button
            onClick={() => setIntakeMode('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              intakeMode === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <span>{currentT.tab_whatsapp}</span>
          </button>
          <button
            onClick={() => setIntakeMode('web')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              intakeMode === 'web'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>{currentT.tab_webform}</span>
            <span className="px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 text-[10px] rounded font-medium border border-emerald-400/30 flex items-center gap-0.5">
              <Mic className="w-2.5 h-2.5" />
              Voice
            </span>
          </button>
        </div>
      </div>

      {/* Active Intake Component */}
      <div>
        {intakeMode === 'voice' && (
          <VoiceRecorder
            language={language}
            onTicketGenerated={onTicketGenerated}
            selectedDistrict={selectedDistrict}
          />
        )}
        {intakeMode === 'whatsapp' && (
          <WhatsAppSimulator
            language={language}
            onTicketGenerated={onTicketGenerated}
            selectedDistrict={selectedDistrict}
          />
        )}
        {intakeMode === 'web' && (
          <GrievanceForm
            language={language}
            districts={districts}
            onTicketGenerated={onTicketGenerated}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={onSelectDistrict}
          />
        )}
      </div>

      {/* Community Verified Grievance Feed */}
      <CommunityFeed
        tickets={tickets}
        language={language}
        onUpvoteTicket={onUpvoteTicket}
        selectedDistrict={selectedDistrict}
      />
    </div>
  );
};