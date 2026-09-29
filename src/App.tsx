import React, { useState, useEffect } from 'react';
import { Language, PortalMode, CitizenTicket } from './types';
import { initialTickets } from './data/mockTickets';
import { mockDistricts, mockHotspots, mockCandidateProjects } from './data/mockDistricts';
import { Header } from './components/layout/Header';
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { PolicymakerPortal } from './components/policymaker/PolicymakerPortal';
import { TicketReceiptModal } from './components/citizen/TicketReceiptModal';
import { GeminiChatbot } from './components/chat/GeminiChatbot';
import { attachSentimentToTicket } from './utils/sentimentAnalyzer';
import { Shield, Sparkles, Building2, Globe, Bot } from 'lucide-react';
import { loadRealDistricts } from './data/realDistrictLoader';
import { fetchTickets, createTicketAPI, toggleTicketUpvoteAPI, fetchProjects, saveProjectsAPI } from './services/apiService';

export default function App() {
  const [language, setLanguage] = useState<Language>('ta'); // Default Tamil for state focus, one-click toggle to English
  const [portalMode, setPortalMode] = useState<PortalMode>('citizen');
  const [tickets, setTickets] = useState<CitizenTicket[]>(initialTickets);
  const [districts, setDistricts] = useState(mockDistricts);
  const [hotspots, setHotspots] = useState(mockHotspots);
  const [projects, setProjects] = useState(mockCandidateProjects);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Madurai');

  // Gemini context-aware copilot chat state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Receipt modal state after submission
  const [latestReceiptTicket, setLatestReceiptTicket] = useState<CitizenTicket | null>(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : prev === 'ta' ? 'hi' : 'en'));
  };

  const handleTicketGenerated = (newTicket: CitizenTicket) => {
    const enrichedTicket = attachSentimentToTicket(newTicket);
    setTickets((prev) => [enrichedTicket, ...prev]);
    setLatestReceiptTicket(enrichedTicket);
    createTicketAPI(enrichedTicket);

    setDistricts((prevDistricts) =>
      prevDistricts.map((d) => {
        if (d.name.toLowerCase() === newTicket.district.toLowerCase()) {
          return {
            ...d,
            citizen_tickets_count: d.citizen_tickets_count + 1,
            overall_deficit_index: Math.min(99, d.overall_deficit_index + 1),
          };
        }
        return d;
      })
    );
  };

  const handleUpvoteTicket = (ticketId: string) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (target) {
      toggleTicketUpvoteAPI(ticketId, !target.hasUpvoted);
    }
    setTickets((prevTickets) =>
      prevTickets.map((t) => {
        if (t.id === ticketId) {
          const isUpvoted = !t.hasUpvoted;
          return {
            ...t,
            hasUpvoted: isUpvoted,
            upvotes: isUpvoted ? t.upvotes + 1 : t.upvotes - 1,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateProjects = (updated: typeof projects) => {
    setProjects(updated);
    saveProjectsAPI(updated);
  };

  // Loads real district data from CSV on mount; falls back to mock data if unavailable
  useEffect(() => {
    let isMounted = true;

    const loadDistrictData = async () => {
      try {
        const realData = await loadRealDistricts();
        if (isMounted && realData && realData.length > 0) {
          setDistricts(realData);
        }
      } catch (error) {
        console.error('Failed to load real districts:', error);
      }
    };

    loadDistrictData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Loads persisted tickets & projects from the backend on mount; falls back to seed data if unavailable
  useEffect(() => {
    let isMounted = true;

    const loadPersistedState = async () => {
      const [persistedTickets, persistedProjects] = await Promise.all([fetchTickets(), fetchProjects()]);
      if (!isMounted) return;
      if (persistedTickets && persistedTickets.length > 0) {
        setTickets(persistedTickets);
      }
      if (persistedProjects && persistedProjects.length > 0) {
        setProjects(persistedProjects);
      }
    };

    loadPersistedState();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top DPG & Portal Header */}
      <Header
        language={language}
        onToggleLanguage={toggleLanguage}
        portalMode={portalMode}
        onSelectPortalMode={setPortalMode}
        ticketsCount={tickets.length}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {portalMode === 'citizen' ? (
          <CitizenPortal
            language={language}
            districts={districts}
            tickets={tickets}
            onTicketGenerated={handleTicketGenerated}
            onUpvoteTicket={handleUpvoteTicket}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
          />
        ) : (
          <PolicymakerPortal
            language={language}
            districts={districts}
            hotspots={hotspots}
            projects={projects}
            tickets={tickets}
            onUpdateProjects={handleUpdateProjects}
          />
        )}
      </main>

      {/* Official Receipt Modal */}
      {latestReceiptTicket && (
        <TicketReceiptModal
          ticket={latestReceiptTicket}
          language={language}
          onClose={() => setLatestReceiptTicket(null)}
        />
      )}

      {/* Context-Aware Gemini Copilot Chatbot */}
      <GeminiChatbot
        language={language}
        districts={districts}
        tickets={tickets}
        hotspots={hotspots}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Floating Action Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-[#0A192F] hover:bg-[#132A4A] text-white rounded-lg shadow-xl border border-slate-700 font-semibold text-xs transition-all hover:scale-105 cursor-pointer group"
          aria-label="Open Gemini Copilot Chat"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-400 group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0A192F] animate-pulse" />
          </div>
          <div className="text-left">
            <span className="block font-bold text-[12px] leading-tight text-slate-100">
              {language === 'ta' ? 'Gemini AI ஆலோசகர்' : language === 'hi' ? 'जेमिनी एआई सलाहकार' : 'Gemini Copilot'}
            </span>
            <span className="block text-[10px] text-slate-400 font-mono">
              {language === 'ta' ? 'அரசு தரவு & பகுப்பாய்வு' : language === 'hi' ? 'संदर्भ-आधारित प्रश्नोत्तर' : 'Context-Aware Q&A'}
            </span>
          </div>
        </button>
      )}

      {/* Institutional DPG Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#0A192F] text-amber-400 flex items-center justify-center font-bold text-xs">
              JS
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                JanVikas Setu · National Citizen Infrastructure & Demand Intelligence
              </p>
              <p className="text-[11px] text-slate-500">
                Designed as an Open Digital Public Good (DPG) · Compliant with India DPI Architecture & PM GatiShakti
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Government of India & State Planning Boards</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Multilingual NLP (Tamil & English)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}