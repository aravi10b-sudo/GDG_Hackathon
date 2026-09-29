import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { t } from '../../utils/translations';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  UploadCloud, 
  FileAudio, 
  AlertCircle,
  Play,
  Pause,
  Bot
} from 'lucide-react';
import { parseGrievanceAI, transcribeAudioAI } from '../../services/apiService';

interface VoiceRecorderProps {
  language: Language;
  onTicketGenerated: (ticketData: any) => void;
  selectedDistrict: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  language,
  onTicketGenerated,
  selectedDistrict,
}) => {
  const currentT = t[language];
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcriptionEngine, setTranscriptionEngine] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 30, 45, 20, 50, 25, 40, 60, 35, 20, 10]);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [activePlayingSample, setActivePlayingSample] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup Browser Speech Recognition as fast real-time assistant
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }
          if (currentText.trim()) {
            setTranscript(currentText.trim());
            setTranscriptionEngine('Live Speech API');
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Browser SpeechRecognition error (Gemini audio fallback active):', event.error);
        };

        recognition.onend = () => {
          // Handled via mediaRecorder stop
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [language]);

  // Audio level animation when recording or playing sample
  useEffect(() => {
    if (isRecording || activePlayingSample !== null) {
      const interval = setInterval(() => {
        setAudioLevel(Array.from({ length: 14 }, () => Math.floor(Math.random() * 55) + 12));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel([10, 12, 15, 14, 12, 10, 15, 12, 10, 14, 12, 10, 8, 6]);
    }
  }, [isRecording, activePlayingSample]);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    // 1. Try starting browser speech recognition in parallel
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('SpeechRecognition start failed (will use Gemini audio transcription):', e);
      }
    }

    // 2. Request microphone stream via MediaRecorder
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mimeType = MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/wav';

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

          // If browser speech recognition did not produce text or had error, transcribe with Gemini
          if (!transcript.trim()) {
            await convertAudioBlobToTranscript(audioBlob, mimeType);
          }
        };

        mediaRecorder.start(250);
        setIsRecording(true);
      } else {
        throw new Error('navigator.mediaDevices.getUserMedia is not supported in this browser.');
      }
    } catch (err: any) {
      console.warn('Microphone access issue:', err?.message || err);
      // If mic is denied or not supported in this iframe, show friendly helper and fallback
      setMicError(
        language === 'ta'
          ? 'மைக்ரோஃபோன் அணுகல் அனுமதிக்கப்படவில்லை அல்லது ஆதரிக்கப்படவில்லை. கீழே உள்ள மாதிரி குரல் குறிப்புகளைத் தேர்ந்தெடுக்கவும் அல்லது ஆடியோவை பதிவேற்றவும்.'          : language === 'hi'
          ? 'इस ब्राउज़र फ़्रेम में माइक्रोफ़ोन एक्सेस प्रतिबंधित है। आप नीचे दिए गए वॉइस मेमो नमूनों का उपयोग कर सकते हैं या ऑडियो फ़ाइल अपलोड कर सकते हैं।'          : 'Microphone access is restricted in this browser frame. You can use the Voice Memo samples below or upload an audio file.'
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    // Stop SpeechRecognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Convert audio blob to base64 and send to Gemini Transcribe
  const convertAudioBlobToTranscript = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const res = await transcribeAudioAI(base64Audio, mimeType, language);
        if (res.transcript) {
          setTranscript(res.transcript);
          setTranscriptionEngine(res.model || 'gemini-3.5-transcribe');
        }
        setIsTranscribing(false);
      };
    } catch (err) {
      console.error('Audio transcription error:', err);
      setIsTranscribing(false);
    }
  };

  // Handle uploaded audio file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    setMicError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      const res = await transcribeAudioAI(base64Audio, file.type || 'audio/webm', language);
      if (res.transcript) {
        setTranscript(res.transcript);
        setTranscriptionEngine(res.model || 'gemini-3.5-transcribe');
      }
      setIsTranscribing(false);
    };
  };

  // Play and simulate realistic voice note conversion
  const handlePlayVoiceSample = (sampleText: string, index: number) => {
    if (activePlayingSample === index) {
      setActivePlayingSample(null);
      return;
    }

    setActivePlayingSample(index);
    setIsTranscribing(true);
    setTranscript('');

    setTimeout(() => {
      setTranscript(sampleText);
      setTranscriptionEngine('gemini-3.5-transcribe (voice note)');
      setIsTranscribing(false);
      setActivePlayingSample(null);
    }, 1200);
  };

  const handleProcessGrievance = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);
    try {
      const aiResult = await parseGrievanceAI(
        transcript,
        language,
        selectedDistrict,
        transcript
      );

      const trackingCode = `JVS-IN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: `tkt-${Date.now()}`,
        tracking_code: trackingCode,
        title_en: aiResult.title_en,
        title_ta: aiResult.title_ta,
        description_en: aiResult.description_en,
        description_ta: aiResult.description_ta,
        raw_submission: transcript,
        language: language,
        category: aiResult.category,
        severity: aiResult.severity,
        district: aiResult.detected_district || selectedDistrict || 'Madurai',
        taluk: aiResult.detected_location || 'Gram Panchayat',
        affected_population_estimate: aiResult.affected_population_estimate || 2500,
        upvotes: 1,
        status: 'submitted',
        channel: 'voice',
        government_scheme: aiResult.government_scheme,
        estimated_budget_inr_lakhs: aiResult.estimated_budget_inr_lakhs,
        created_at: new Date().toISOString(),
      };

      onTicketGenerated(newTicket);
      setTranscript('');
      setTranscriptionEngine(null);
    } catch (err) {
      console.error('Error parsing voice ticket:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleVoiceMemos = [
    {
      title_ta: 'ராமநாதபுரம் கீழக்கரை குடிநீர் உப்புத்தன்மை',
      title_en: 'Ramanathapuram Kilakarai Seawater Intrusion',
      text: language === 'ta'
        ? 'எங்கள் கீழக்கரை கிராமத்தில் 3 வாரமா போர்வெல் தண்ணி ரொம்ப உப்பா வருதுங்க. ஜல் ஜீவன் திட்டத்துல புதிய குழாய் போட்டு நல்ல குடிநீர் தரணும்.'
        : 'In our Kilakarai village, the borewell water has turned severely saline for 3 weeks. Please lay new potable pipeline under Jal Jeevan Mission.',
      district: 'Ramanathapuram',
    },
    {
      title_ta: 'தருமபுரி சித்தேரி மலைப்பாதை மண் சாலை உடைப்பு',
      title_en: 'Dharmapuri Sitteri Mountain Road Collapse',
      text: language === 'ta'
        ? 'சித்தேரி-கொல்லைமேடு 4 கி.மீ மலைப்பாதை கனமழையில அரிச்சு போச்சு. ஆம்புலன்ஸ் வர முடியல, 1800 பழங்குடி மக்கள் தவிக்கிறோம். தார் ரோடு உடனே வேணும்.'
        : 'The 4.2 km Sitteri mountain road washed away due to rain. Over 1800 tribal residents are cut off without medical transit. Urgent PMGSY tar road needed.',
      district: 'Dharmapuri',
    },
    {
      title_ta: 'மேலூர் பிரதான கூட்டுக்குடிநீர் குழாய் வெடிப்பு',
      title_en: 'Melur Main Bulk Water Pipeline Burst',
      text: language === 'ta'
        ? 'மேலூர் வார்டு 4-ல் பிரதான குடிநீர் பைப் வெடிச்சு தெருவெல்லாம் வெள்ளம் போல ஓடுது. குடிநீர் விநியோகம் சுத்தமா நின்னு போச்சு.'
        : 'Main drinking water pipeline burst in Melur Ward 4, flooding the street and cutting off drinking water supply to the entire neighborhood.',
      district: 'Madurai',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-700" />
            {currentT.voice_heading}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ta' 
              ? 'குரல் குறிப்பு மூலம் தமிழில் பேசுங்கள் — Gemini AI தானாகவே உரையாக மாற்றும்.'
              : language === 'hi'
              ? 'हिन्दी या अंग्रेज़ी में बोलें — जेमिनी एआई स्वतः आपकी आवाज़ को टेक्स्ट में बदल देगा।'
              : 'Speak in Tamil or English — Gemini AI automatically transcribes your voice to text.'}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>gemini-3.5-transcribe</span>
          </span>
        </div>
      </div>

      {/* Mic Record Interactive Control */}
      <div className="flex flex-col items-center justify-center py-6 bg-slate-50/80 rounded-md border border-dashed border-slate-300 relative">
        <div className="relative mb-3">
          {isRecording && (
            <span className="absolute -inset-3.5 rounded-full bg-rose-500/30 animate-ping" />
          )}
          <button
            type="button"
            onClick={toggleRecording}
            className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-md ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white scale-105'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
            title={isRecording ? currentT.mic_stop : currentT.mic_start}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold text-slate-800">
            {isRecording 
              ? `${currentT.mic_recording} (${String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:${String(recordingSeconds % 60).padStart(2, '0')})`
              : currentT.mic_start}
          </p>
        </div>

        {/* Live Audio Waveform Bars */}
        <div className="flex items-center gap-1.5 h-10 px-4">
          {audioLevel.map((height, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-100 ${
                isRecording || activePlayingSample !== null ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Secondary options: Upload Audio File */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>{language === 'ta' ? 'அல்லது' : language === 'hi' ? 'या' : 'or'}</span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-medium underline underline-offset-2 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'ஆடியோ கோப்பை பதிவேற்றவும் (Upload Audio)' : language === 'hi' ? 'ऑडियो फ़ाइल अपलोड करें' : 'Upload Audio File'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Mic Error Notice */}
        {micError && (
          <div className="mt-3 mx-4 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{micError}</span>
          </div>
        )}
      </div>

      {/* Voice Transcript Output Box */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5 text-xs text-slate-500">
          <label className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span>{language === 'ta' ? 'குரல் உரை (Voice-to-Text Transcript):' : language === 'hi' ? 'रिकॉर्ड किया गया वॉइस ट्रांसक्रिप्ट:' : 'Captured Voice Transcript:'}</span>
            {transcriptionEngine && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
                via {transcriptionEngine}
              </span>
            )}
          </label>
          {transcript && (
            <button
              onClick={() => {
                setTranscript('');
                setTranscriptionEngine(null);
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{language === 'ta' ? 'அழி' : language === 'hi' ? 'साफ़ करें' : 'Clear'}</span>
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={
              isTranscribing
                ? (language === 'ta' ? 'Gemini குரலை உரையாக மாற்றுகிறது... தயவுசெய்து காத்திருக்கவும்...' : language === 'hi' ? 'जेमिनी आपकी आवाज़ को टेक्स्ट में बदल रहा है... कृपया प्रतीक्षा करें...' : 'Gemini is transcribing your voice to text... please wait...')
                : isRecording
                ? (language === 'ta' ? 'பேசுகிறீர்கள்... கேட்டுக்கொண்டிருக்கிறது...' : language === 'hi' ? 'आप बोल रहे हैं... सुना जा रहा है...' : 'Listening to your voice...')
                : (language === 'ta'
                    ? 'உங்கள் குரல் இங்கே உரையாக தோன்றும். நீங்கள் நேரடியாக தட்டச்சு செய்து திருத்தவும் செய்யலாம்...'
                    : language === 'hi'
                    ? 'आपकी बोली गई बात यहां टेक्स्ट के रूप में दिखेगी। आप इसे सीधे टाइप या संपादित भी कर सकते हैं...'
                    : 'Your spoken words will appear here. You can also edit or type directly...')
            }
            className="w-full text-sm p-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900 resize-none"
          />

          {isTranscribing && (
            <div className="absolute inset-0 bg-white/80 rounded-md flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
              <span>{language === 'ta' ? 'Gemini AI ஒலி-உரை மாற்றம் செய்கிறது...' : language === 'hi' ? 'जेमिनी एआई ऑडियो ट्रांसक्राइब कर रहा है...' : 'Gemini AI is transcribing audio...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Submit Button */}
      {transcript.trim() && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleProcessGrievance}
            disabled={isAnalyzing || isTranscribing}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0F2744] hover:bg-[#0A192F] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>{currentT.mic_analyzing}</span>
              </>
            ) : (
              <>
                <span>{language === 'ta' ? 'Gemini AI மூலம் ஆராய்ந்து சமர்ப்பிக்கவும்' : language === 'hi' ? 'जेमिनी एआई से विश्लेषण करें और सबमिट करें' : 'Analyze & Submit with Gemini AI'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Interactive Spoken Voice Notes (Simulated Voice Memos) */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {language === 'ta' 
                ? 'நேரடி மாதிரி குரல் குறிப்புகள் (Play & Transcribe Sample Voice Notes):' 
                : language === 'hi'
                ? 'एक-क्लिक वॉइस मेमो (सुनने और ट्रांसक्राइब करने के लिए क्लिक करें):'
                : '1-Click Voice Memos (Click to Play & Transcribe):'}
            </span>
          </p>
          <span className="text-[10px] text-slate-500 font-mono">Instant Test</span>
        </div>

        <div className="space-y-2">
          {sampleVoiceMemos.map((sample, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded border border-slate-200 bg-slate-50/70 hover:bg-slate-100/90 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-slate-800 text-[11px]">
                    {language === 'ta' ? sample.title_ta : sample.title_en}
                  </span>
                  <span className="text-[10px] bg-white border border-slate-300 text-slate-600 px-1 rounded font-mono">
                    {sample.district}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate italic">
                  "{sample.text}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => handlePlayVoiceSample(sample.text, idx)}
                disabled={isTranscribing}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {activePlayingSample === idx ? (
                  <>
                    <Pause className="w-3 h-3 animate-pulse" />
                    <span>Transcribing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>{language === 'ta' ? 'ஒலி கேட்டு மாற்று' : 'Transcribe'}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
