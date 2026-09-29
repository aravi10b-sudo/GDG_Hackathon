import React, { useState } from 'react';
import { Language, WhatsAppMessage } from '../../types';
import { t } from '../../utils/translations';
import { Send, MessageSquare, Mic, CheckCheck, Bot, Sparkles } from 'lucide-react';
import { parseGrievanceAI } from '../../services/apiService';

interface WhatsAppSimulatorProps {
  language: Language;
  onTicketGenerated: (ticketData: any) => void;
  selectedDistrict: string;
}

export const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  language,
  onTicketGenerated,
  selectedDistrict,
}) => {
  const currentT = t[language];
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: language === 'ta' 
        ? 'வணக்கம்! நான் ஜன்விகாஸ் சேது அதிகாரப்பூர்வ சேவை பாட். உங்கள் ஊரில் உள்ள சாலை, குடிநீர் அல்லது மின்சார பிரச்சனையை குரல் அல்லது குறுஞ்செய்தியாக அனுப்பவும்.' 
        : language === 'hi'
        ? 'नमस्ते! मैं जनविकास सेतु नागरिक बॉट हूं। अपने गांव या वार्ड की सड़क, पानी, बिजली या स्वास्थ्य संबंधी समस्या टेक्स्ट या वॉइस नोट के माध्यम से भेजें।'
        : 'Namaste! I am the JanVikas Setu Citizen Bot. Send your village or ward infrastructure deficit (water, roads, health, power) via text or voice note.',
      timestamp: '10:00 AM',
    },
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isProcessing) return;

    const userMsg: WhatsAppMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const aiResult = await parseGrievanceAI(
        textToSend,
        language,
        selectedDistrict,
        textToSend
      );

      const trackingCode = `JVS-IN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket = {
        id: `tkt-${Date.now()}`,
        tracking_code: trackingCode,
        title_en: aiResult.title_en,
        title_ta: aiResult.title_ta,
        description_en: aiResult.description_en,
        description_ta: aiResult.description_ta,
        raw_submission: textToSend,
        language: language,
        category: aiResult.category,
        severity: aiResult.severity,
        district: aiResult.detected_district || selectedDistrict || 'Madurai',
        taluk: aiResult.detected_location || 'Gram Panchayat',
        affected_population_estimate: aiResult.affected_population_estimate || 2000,
        upvotes: 1,
        status: 'submitted',
        channel: 'whatsapp',
        government_scheme: aiResult.government_scheme,
        estimated_budget_inr_lakhs: aiResult.estimated_budget_inr_lakhs,
        created_at: new Date().toISOString(),
      };

      onTicketGenerated(newTicket);

      // Bot confirmation response
      setTimeout(() => {
        const botReply: WhatsAppMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'ta'
            ? `✅ உங்கள் கோரிக்கை பதிவு செய்யப்பட்டது!\n\n📌 தலைப்பு: ${aiResult.title_ta}\n🏷️ கண்காணிப்பு எண்: ${trackingCode}\n🏛️ ஒதுக்கப்பட்ட திட்டம்: ${aiResult.government_scheme}\n⏱️ தீர்வு காலக்கெடு: 14 நாட்கள் (மாவட்ட ஆட்சியர் அலுவலகம்).`
            : language === 'hi'
            ? `✅ आपकी शिकायत सफलतापूर्वक पंजीकृत हो गई!\n\n📌 शीर्षक: ${aiResult.title_en}\n🏷️ राष्ट्रीय ट्रैकिंग आईडी: ${trackingCode}\n🏛️ योजना: ${aiResult.government_scheme}\n⏱️ सांविधिक एसएलए: 14 कार्य दिवस।`
            : `✅ Grievance Registered Successfully!\n\n📌 Title: ${aiResult.title_en}\n🏷️ National Tracking ID: ${trackingCode}\n🏛️ Scheme: ${aiResult.government_scheme}\n⏱️ Statutory SLA: 14 Working Days.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketRef: trackingCode,
        };
        setMessages((prev) => [...prev, botReply]);
        setIsProcessing(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[520px]">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs border border-emerald-600">
            <Bot className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-semibold leading-tight">
              {currentT.wa_header_title}
            </h4>
            <p className="text-[10px] text-emerald-200">
              {currentT.wa_header_status}
            </p>
          </div>
        </div>
        <div className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200 border border-emerald-700">
          WhatsApp API Sim
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#E5DDD5]/40 font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
              }`}
            >
              <p>{msg.text}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'user' && (
                  <CheckCheck className="w-3 h-3 text-emerald-600" />
                )}
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-2.5 text-xs text-slate-500 rounded-tl-none border border-slate-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>{language === 'ta' ? 'AI சரிபார்க்கிறது...' : language === 'hi' ? 'एआई प्रोसेस कर रहा है...' : 'AI processing intake...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Preset Buttons */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 shrink-0 font-medium px-1">
          {language === 'ta' ? 'விரைவு தேர்வு:' : language === 'hi' ? 'त्वरित:' : 'Quick:'}
        </span>
        <button
          onClick={() => handleSendMessage(currentT.wa_preset_1)}
          className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-300 transition-colors cursor-pointer"
        >
          {currentT.wa_preset_1}
        </button>
        <button
          onClick={() => handleSendMessage(currentT.wa_preset_2)}
          className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-300 transition-colors cursor-pointer"
        >
          {currentT.wa_preset_2}
        </button>
        <button
          onClick={() => handleSendMessage(currentT.wa_preset_3)}
          className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-300 transition-colors cursor-pointer"
        >
          {currentT.wa_preset_3}
        </button>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={currentT.wa_type_placeholder}
          className="flex-1 text-xs md:text-sm p-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
        />
        <button
          type="button"
          onClick={() => {
            const voiceNoteText = language === 'ta'
              ? '🎙️ [குரல் பதிவு - 0:14 வினாடிகள்]: கீழக்கரை கடலோரப் பகுதியில் போர்வெல் தண்ணீர் உப்புநீராக மாறியுள்ளது. ஜல் ஜீவன் திட்டத்தில் உடனடியாக புதிய நல்ல தண்ணீர் பைப்லைன் அமைக்க வேண்டும்.'
              : language === 'hi'
              ? '🎙️ [वॉइस नोट - 0:14 सेकंड]: हमारे गांव में बोरवेल का पानी खारा हो गया है। कृपया जल जीवन मिशन के तहत नई पाइपलाइन बिछाएं।'
              : '🎙️ [Voice Note - 0:14s]: In our Kilakarai coastal area, borewell water has turned saline. Please lay a new potable pipeline under Jal Jeevan Mission.';
            handleSendMessage(voiceNoteText);
          }}
          disabled={isProcessing}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer disabled:opacity-50"
          title={language === 'ta' ? 'குரல் குறிப்பு அனுப்பவும் (Voice Note)' : language === 'hi' ? 'वॉइस नोट भेजें' : 'Send Voice Note'}
        >
          <Mic className="w-4 h-4 text-emerald-700" />
        </button>
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isProcessing}
          className="p-2 bg-[#075E54] hover:bg-[#064e46] text-white rounded-md transition-colors cursor-pointer disabled:opacity-50"
          title={currentT.wa_send}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
