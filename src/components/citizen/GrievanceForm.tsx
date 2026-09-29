import React, { useState, useEffect, useRef } from 'react';
import { Language, InfrastructureCategory, SeverityLevel, DistrictData } from '../../types';
import { t } from '../../utils/translations';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Mic,
  MicOff,
  Globe,
  AlertCircle,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { parseGrievanceAI } from '../../services/apiService';

interface GrievanceFormProps {
  language: Language;
  onTicketGenerated: (ticketData: any) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  districts: DistrictData[];
}

const CATEGORY_OPTIONS: InfrastructureCategory[] = [
  'water',
  'roads',
  'power',
  'health',
  'education',
  'sanitation',
  'transport',
  'other',
];

const SEVERITY_OPTIONS: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];

export const GrievanceForm: React.FC<GrievanceFormProps> = ({
  districts,
  language,
  onTicketGenerated,
  selectedDistrict,
  onSelectDistrict,
}) => {
  const currentT = t[language];
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState<InfrastructureCategory>('water');
  const [severity, setSeverity] = useState<SeverityLevel>('high');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Web Speech API Voice-to-Text State
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'ta-IN' | 'en-IN' | 'hi-IN'>(
    language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
  );
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number[]>([20, 35, 60, 45, 75, 30, 65, 40, 25]);

  const recognitionRef = useRef<any>(null);
  const pulseIntervalRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync default speech language when app language changes if not currently listening
  useEffect(() => {
    if (!isListening) {
      setSpeechLanguage(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN');
    }
  }, [language, isListening]);

  // Initialize Web Speech API recognition for in-field dictation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguage;

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += chunk + ' ';
        } else {
          interimText += chunk;
        }
      }
      if (finalText) {
        setDescription((prev) => (prev ? `${prev} ${finalText.trim()}` : finalText.trim()));
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimText);
      }
    };

    recognition.onerror = (event: any) => {
      setSpeechError(
        language === 'ta'
          ? 'குரல் அங்கீகாரம் தோல்வியடைந்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : language === 'hi'
          ? 'आवाज़ पहचान विफल रही। कृपया पुनः प्रयास करें।'
          : 'Voice recognition failed. Please try again.'
      );
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {
        // recognition may already be stopped
      }
    };
  }, [speechLanguage, language]);

  // Animate a lightweight waveform indicator while listening
  useEffect(() => {
    if (isListening) {
      pulseIntervalRef.current = setInterval(() => {
        setAudioLevel(Array.from({ length: 9 }, () => Math.floor(Math.random() * 60) + 15));
      }, 150);
    } else if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
    }
    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    setSpeechError(null);

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = speechLanguage;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setSpeechError(
          language === 'ta'
            ? 'மைக்ரோவோசேிફோன் அணுகல் தோல்வியடைந்தது.'
            : language === 'hi'
            ? 'माइक्रोफ़ोन एक्सेस विफल रहा।'
            : 'Microphone access failed.'
        );
      }
    }
  };

  const resetForm = () => {
    setTaluk('');
    setVillage('');
    setCategory('water');
    setSeverity('high');
    setDescription('');
    setContactPhone('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const aiResult = await parseGrievanceAI(description, language, selectedDistrict);

      const trackingCode = `JVS-IN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: `tkt-${Date.now()}`,
        tracking_code: trackingCode,
        title_en: aiResult.title_en,
        title_ta: aiResult.title_ta,
        description_en: aiResult.description_en,
        description_ta: aiResult.description_ta,
        raw_submission: description,
        language,
        category,
        severity,
        district: selectedDistrict,
        taluk: taluk || aiResult.detected_location || 'Gram Panchayat',
        village: village || undefined,
        affected_population_estimate: aiResult.affected_population_estimate || 2500,
        upvotes: 1,
        status: 'submitted',
        channel: 'web',
        government_scheme: aiResult.government_scheme,
        estimated_budget_inr_lakhs: aiResult.estimated_budget_inr_lakhs,
        created_at: new Date().toISOString(),
      };

      onTicketGenerated(newTicket);
      resetForm();
    } catch (err) {
      console.error('Error submitting grievance:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            {currentT.form_heading}
          </h3>
        </div>
        <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>gemini-3.8-flash</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
        <Mic className="w-3.5 h-3.5 text-emerald-600" />
        <span>{language === 'ta' ? 'குரல்-வழி டட்டச்சு வசதி' : language === 'hi' ? 'आवाज़-आधारित टंकण सुविधा' : 'Voice-to-Text Enabled (Web Speech)'}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* District & Taluk row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {currentT.field_district} <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => onSelectDistrict(e.target.value)}
              className="w-full text-xs md:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {language === 'ta' ? `${d.name_ta} (${d.name})` : d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {currentT.field_taluk} / {language === 'ta' ? 'கிராமம்' : language === 'hi' ? 'गांव' : 'Village'}
            </label>
            <input
              type="text"
              value={taluk}
              onChange={(e) => setTaluk(e.target.value)}
              className="w-full text-xs md:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
              placeholder={language === 'ta' ? 'வட்டம் அல்லது கிராமத்தின் பெயர்' : language === 'hi' ? 'तालुक या गांव का नाम' : 'Taluk or village name'}
            />
          </div>
        </div>

        {/* Category & Severity row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {currentT.field_category} <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as InfrastructureCategory)}
              className="w-full text-xs md:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {(currentT as any)[`cat_${cat}`]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {currentT.field_urgency} <span className="text-rose-500">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full text-xs md:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
            >
              {SEVERITY_OPTIONS.map((sev) => (
                <option key={sev} value={sev}>
                  {(currentT as any)[`sev_${sev}`]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description with inline voice dictation */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {currentT.field_description} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={isListening && interimTranscript ? `${description} ${interimTranscript}` : description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={currentT.field_description_placeholder}
              className="w-full text-xs md:text-sm p-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
            />
            {isSpeechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
                title={isListening ? currentT.mic_stop : currentT.mic_start}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          {isListening && (
            <div className="flex items-center gap-1 mt-1.5 h-4">
              {audioLevel.map((level, idx) => (
                <span
                  key={idx}
                  className="w-0.5 bg-emerald-500 rounded-full transition-all"
                  style={{ height: `${level}%` }}
                />
              ))}
            </div>
          )}
          {speechError && (
            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {speechError}
            </p>
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            {currentT.field_contact}
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full text-xs md:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
            placeholder="+91 9XXXXXXXXX"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !description.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs md:text-sm font-semibold rounded-md transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>{currentT.submitting}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{currentT.btn_submit_grievance}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
