import React, { useState, useEffect, useRef } from 'react';
import { Language, DistrictData, CitizenTicket, HotspotCluster } from '../../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  X, 
  Minimize2, 
  Maximize2, 
  User, 
  Copy, 
  Check, 
  Globe, 
  ExternalLink, 
  Search, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export type ChatRole = 'policy_advisor' | 'citizen_guide' | 'data_analyst';
export type ModelSpeed = 'general' | 'fast';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  model?: string;
  engine?: string;
  sources?: GroundingSource[];
  searchQueries?: string[];
  grounded?: boolean;
}

interface GeminiChatbotProps {
  language: Language;
  districts?: DistrictData[];
  tickets?: CitizenTicket[];
  hotspots?: HotspotCluster[];
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  language,
  districts = [],
  tickets = [],
  hotspots = [],
  isOpen,
  onClose,
}) => {
  const [role, setRole] = useState<ChatRole>('policy_advisor');
  const [modelSpeed, setModelSpeed] = useState<ModelSpeed>('general');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome message per language
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      role: 'model',
      content: language === 'ta'
        ? `வணக்கம்! நான் **ஜன்விகாஸ் சேது AI ஆலோசகர்** (Gemini DPI Copilot with Google Search Grounding).\n\nதமிழ்நாட்டின் மாவட்ட உள்கட்டமைப்பு பற்றாக்குறை குறியீடுகள், மக்களின் குரல் கோரிக்கைகள், நிதி ஒதுக்கீடு (Capex) மற்றும் **Google Search நேரலைத் தரவுகள்** (JJM, PMGSY, TN GOs, வானிலை எச்சரிக்கைகள்) குறித்த ஆய்வுகளை உங்களுக்கு உடனுக்குடன் வழங்க நான் தயாராக உள்ளேன். நீங்கள் எதை அறிய விரும்புகிறீர்கள்?`
        : language === 'hi'
        ? `नमस्ते! मैं **जनविकास सेतु एआई सलाहकार** (गूगल सर्च ग्राउंडिंग के साथ जेमिनी डीपीआई कॉपायलट) हूं।\n\nमेरे पास भारत के जिलों की अवसंरचना कमी सूचकांक, नागरिक आवाज़ शिकायतें, पूंजीगत व्यय (Capex), और **लाइव गूगल सर्च डेटा** (JJM, PMGSY, सरकारी आदेश, मौसम चेतावनी) का विश्लेषण तुरंत उपलब्ध है। आप क्या जानना चाहते हैं?`
        : `Greetings! I am the **JanVikas Setu DPI Copilot** powered by **Gemini 3.5 Flash** with **Google Search Grounding**.\n\nI possess real-time context of Tamil Nadu's district deficit indices (JJM, PMGSY, RDSS), citizen sentiment grievance feeds, capital project prioritization, and **live Google Search data** for recent government orders, scheme funding, and ground reports. How can I assist your analysis today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.5-flash',
      grounded: true,
      sources: [
        { title: 'Tamil Nadu State Planning Commission - Capex Infrastructure', url: 'https://spc.tn.gov.in' },
        { title: 'Jal Jeevan Mission National Portal', url: 'https://jaljeevanmission.gov.in' },
      ],
    },
  ]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          role_persona: role,
          model_speed: modelSpeed,
          use_search_grounding: useSearchGrounding,
          language,
          context_data: {
            districts_count: districts.length,
            tickets_count: tickets.length,
            hotspots_count: hotspots.length,
          },
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            model: data.model || (useSearchGrounding ? 'gemini-3.5-flash' : (modelSpeed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash')),
            engine: data.engine,
            sources: data.sources || [],
            searchQueries: data.search_queries || [],
            grounded: Boolean(data.grounded || (data.sources && data.sources.length > 0)),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to fetch AI response');
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `model-err-${Date.now()}`,
          role: 'model',
          content: language === 'ta'
            ? 'மன்னிக்கவும், தற்காலிக நெட்வொர்க் சிக்கல் ஏற்பட்டுள்ளது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : language === 'hi'
            ? 'क्षमा करें, अस्थायी नेटवर्क समस्या आई है। कृपया पुनः प्रयास करें।'
            : 'I encountered an issue connecting to the Gemini engine. Please check your connectivity and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetConversation = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: 'model',
        content: language === 'ta'
          ? `உரையாடல் மீட்டமைக்கப்பட்டது. நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`
          : language === 'hi'
          ? `बातचीत रीसेट हो गई। मैं आपकी कैसे मदद कर सकता हूं?`
          : `Conversation reset. I am ready with fresh context across all districts. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: modelSpeed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash',
      },
    ]);
  };

  // Sample prompt chips tailored to current language with Search Grounding highlights
  const suggestedPrompts = language === 'ta'
    ? [
        '🔍 தமிழ்நாட்டில் ஜல் ஜீவன் மிஷன் சமீபத்திய நிதி ஒதுக்கீடு',
        'ராமநாதபுரம் குடிநீர் பற்றாக்குறை & உப்புநீர் நிலைமை',
        'சித்தேரி மலைப்பாதை அவசர நிதி & PMGSY நிலை என்ன?',
        '🔍 தமிழ்நாட்டில் PMGSY கட்டம் 3 சாலை புதிய விதிமுறைகள்',
        'அதிக விரக்தி (Sentiment) கொண்ட மனுக்கள் எவை?',
      ]
    : language === 'hi'
    ? [
        '🔍 जल जीवन मिशन का नवीनतम बजट आवंटन',
        'रामनाथपुरम जल संकट एवं पूंजीगत व्यय अंतर का विश्लेषण करें',
        'धर्मपुरी सित्तेरी सड़क धंसने की घटना और सेंटीमेंट स्कोर की समीक्षा करें',
        '🔍 वर्तमान PMGSY चरण-3 सड़क स्वीकृति नियम',
        'किन जिलों में गंभीर अवसंरचना कमी है?',
      ]
    : [
        '🔍 Latest Tamil Nadu budget outlay for Jal Jeevan Mission',
        'Analyze Ramanathapuram water deficit & capex gap',
        'Audit Dharmapuri Sitteri road collapse & sentiment score',
        '🔍 Current PMGSY Phase-3 road sanction rules in TN',
        'Which districts have critical infrastructure deficits?',
      ];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-slate-300 flex flex-col transition-all duration-200 overflow-hidden ${
        isExpanded
          ? 'w-[95vw] md:w-[720px] h-[85vh] max-h-[800px]'
          : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
      }`}
      role="dialog"
      aria-label="Gemini DPI Copilot Chatbot"
    >
      {/* Top Header */}
      <div className="bg-[#0A192F] text-white p-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-100">
                {language === 'ta' ? 'ஜன்விகாஸ் Gemini ஆலோசகர்' : language === 'hi' ? 'जनविकास जेमिनी सलाहकार' : 'JanVikas Gemini Copilot'}
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded text-[10px] font-mono">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {modelSpeed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'} · {role.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={handleResetConversation}
            title={language === 'ta' ? 'உரையாடலை மீட்டமைக்க' : language === 'hi' ? 'बातचीत रीसेट करें' : 'Reset Conversation'}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors hidden sm:block cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role and Model Selection Toolbar */}
      <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium text-[11px]">
            {language === 'ta' ? 'பாத்திரம்:' : language === 'hi' ? 'भूमिका:' : 'Role:'}
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as ChatRole)}
            className="text-[11px] bg-white border border-slate-300 rounded px-2 py-1 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          >
            <option value="policy_advisor">
              {language === 'ta' ? 'கொள்கை & நிதி ஆலோசகர் (Policy Advisor)' : language === 'hi' ? 'नीति एवं वित्त सलाहकार' : 'Policy & Capex Advisor'}
            </option>
            <option value="citizen_guide">
              {language === 'ta' ? 'மக்கள் குறைதீர்ப்பு வழிகாட்டி (Citizen Guide)' : language === 'hi' ? 'नागरिक शिकायत मार्गदर्शक' : 'Citizen Grievance Guide'}
            </option>
            <option value="data_analyst">
              {language === 'ta' ? 'புள்ளிவிவர ஆய்வாளர் (Data Analyst)' : language === 'hi' ? 'स्थानिक डेटा विश्लेषक' : 'Spatial Data Analyst'}
            </option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Google Search Grounding Toggle */}
          <button
            type="button"
            onClick={() => setUseSearchGrounding(!useSearchGrounding)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] sm:text-[11px] font-semibold border transition-all cursor-pointer ${
              useSearchGrounding
                ? 'bg-blue-50 text-blue-900 border-blue-300 shadow-2xs'
                : 'bg-white text-slate-500 border-slate-300 hover:text-slate-700'
            }`}
            title={
              useSearchGrounding
                ? 'Google Search Grounding Active (gemini-3.5-flash with real-time web access enabled)'
                : 'Click to enable Google Search Grounding for real-time web facts'
            }
          >
            <Globe className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${useSearchGrounding ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Search Grounding</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                useSearchGrounding ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
          </button>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">Model:</span>
            <div className="inline-flex rounded-md border border-slate-300 bg-white p-0.5 text-[10px] font-mono">
              <button
                onClick={() => setModelSpeed('general')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  modelSpeed === 'general' ? 'bg-[#0A192F] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="gemini-3.5-flash for balanced multi-turn reasoning"
              >
                3.5-Flash
              </button>
              <button
                onClick={() => setModelSpeed('fast')}
                disabled={useSearchGrounding}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  useSearchGrounding ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  modelSpeed === 'fast' && !useSearchGrounding ? 'bg-[#0A192F] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title={useSearchGrounding ? 'Search Grounding requires gemini-3.5-flash' : 'gemini-3.1-flash-lite for instant responses'}
              >
                3.1-Lite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg p-3 shadow-2xs border ${
                  isUser
                    ? 'bg-[#0A192F] text-white border-slate-800'
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-slate-100 text-[10px] opacity-75">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <span>{isUser ? (language === 'ta' ? 'நீங்கள்' : language === 'hi' ? 'आप' : 'You') : 'Gemini DPI Copilot'}</span>
                    {msg.grounded && !isUser && (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-medium">
                        <Globe className="w-2.5 h-2.5" />
                        Grounded
                      </span>
                    )}
                    {!isUser && msg.engine && (
                      msg.engine.startsWith('gemini-') ? (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-medium">
                          <Sparkles className="w-2.5 h-2.5" />
                          Live AI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-medium">
                          Fallback Mode
                        </span>
                      )
                    )}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    {msg.model && <span>{msg.model}</span>}
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="hover:text-slate-900 ml-1 transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body with clean whitespace & formatting */}
                <div className="whitespace-pre-line leading-relaxed text-xs">
                  {msg.content}
                </div>

                {/* Grounded with Google Search Citations Box */}
                {!isUser && msg.grounded && msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px]">
                    <div className="flex items-center justify-between gap-1 text-blue-900 font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{language === 'ta' ? 'Google Search மூலம் சரிபார்க்கப்பட்ட தளங்கள்:' : language === 'hi' ? 'गूगल सर्च द्वारा सत्यापित स्रोत:' : 'Grounded with Google Search:'}</span>
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono">Real-time Web</span>
                    </div>

                    {msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mb-2 text-[10px] text-slate-500 font-mono">
                        <span className="text-slate-400">Search:</span>
                        {msg.searchQueries.map((q, qIdx) => (
                          <span key={qIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {msg.sources.map((src, srcIdx) => {
                        let domain = '';
                        try {
                          domain = new URL(src.url).hostname.replace('www.', '');
                        } catch {
                          domain = 'Web Source';
                        }

                        return (
                          <a
                            key={srcIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 p-1.5 rounded bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 text-blue-950 transition-colors group"
                            title={`Open ${src.url}`}
                          >
                            <span className="truncate font-medium flex-1 text-[11px]">
                              {src.title}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-blue-700 shrink-0 font-mono">
                              <span>{domain}</span>
                              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2 bg-white rounded-md border border-slate-200 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>
              {language === 'ta'
                ? 'Gemini சிந்திக்கிறது (Analyzing real-time state data)...'
                : language === 'hi'
                ? 'जेमिनी विश्लेषण कर रहा है (रीयल-टाइम डेटा)...'
                : 'Gemini is synthesizing live DPI context...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 text-[11px] shrink-0 no-scrollbar">
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 transition-colors shrink-0 cursor-pointer disabled:opacity-50 text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Text Box */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'ta'
                ? 'மாவட்ட உள்கட்டமைப்பு அல்லது திட்டங்கள் குறித்து கேளுங்கள்... (Enter அனுப்ப)'
                : language === 'hi'
                ? 'जिले की अवसंरचना या परियोजनाओं के बारे में पूछें... (Enter दबाएं)'
                : 'Ask about district deficit indices, projects, or capex mismatch... (Press Enter)'
            }
            disabled={isLoading}
            className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 resize-none text-slate-900"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2.5 bg-[#0A192F] hover:bg-[#132A4A] text-white rounded-md font-semibold text-xs flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
