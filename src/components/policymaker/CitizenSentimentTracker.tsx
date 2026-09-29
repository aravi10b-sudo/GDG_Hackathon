import React, { useState } from 'react';
import { CitizenTicket, Language } from '../../types';
import { t } from '../../utils/translations';
import { SentimentBadge } from '../common/SentimentBadge';
import { analyzeTicketSentiment, attachSentimentToTicket } from '../../utils/sentimentAnalyzer';
import { HeartCrack, AlertOctagon, Filter, Search, Gauge, Sparkles, MessageSquareQuote, MapPin } from 'lucide-react';

interface CitizenSentimentTrackerProps {
  tickets: CitizenTicket[];
  language: Language;
}

export const CitizenSentimentTracker: React.FC<CitizenSentimentTrackerProps> = ({
  tickets,
  language,
}) => {
  const currentT = t[language];
  const [filterTone, setFilterTone] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Ensure all tickets have calculated sentiment
  const enrichedTickets = tickets.map((t) => attachSentimentToTicket(t));

  // Compute macro sentiment statistics
  const total = enrichedTickets.length;
  const criticalCount = enrichedTickets.filter((t) => t.sentiment?.tone === 'critical').length;
  const highCount = enrichedTickets.filter((t) => t.sentiment?.tone === 'high').length;
  const avgFrustration = Math.round(
    enrichedTickets.reduce((acc, t) => acc + (t.sentiment?.frustration_index || 0), 0) / (total || 1)
  );
  const avgUrgency = Math.round(
    enrichedTickets.reduce((acc, t) => acc + (t.sentiment?.urgency_index || 0), 0) / (total || 1)
  );

  const filtered = enrichedTickets.filter((t) => {
    const toneMatch = filterTone === 'all' || t.sentiment?.tone === filterTone;
    const districtMatch = filterDistrict === 'all' || t.district === filterDistrict;
    const searchMatch =
      t.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title_ta.includes(searchQuery) ||
      t.description_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description_ta.includes(searchQuery) ||
      t.tracking_code.toLowerCase().includes(searchQuery.toLowerCase());
    return toneMatch && districtMatch && searchMatch;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs space-y-5">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <HeartCrack className="w-5 h-5 text-rose-600" />
            <h3 className="text-base md:text-lg font-bold text-slate-900">
              {language === 'ta'
                ? 'குடிமக்கள் குறைதீர்ப்பு உணர்வு & விரக்தி நுண்ணறிவு (Sentiment Score Intelligence)'
                : language === 'hi'
                ? 'नागरिक शिकायत भावना एवं असंतोष बुद्धिमत्ता विश्लेषण'
                : 'Citizen Demand & Text Sentiment Intelligence Audit'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'ta'
              ? 'குடிமக்களின் குரல் பதிவுகள் மற்றும் உரை விவரங்களை ஆய்வு செய்து கணக்கிடப்பட்ட அவசரம் மற்றும் விரக்தி புள்ளிகள் (Sentiment Scores).'
              : language === 'hi'
              ? 'नागरिक शिकायतों का एल्गोरिथम आधारित पाठ विश्लेषण, जो अत्यावश्यकता, सामुदायिक असंतोष एवं बार-बार होने वाली उपेक्षा को मापता है।'
              : 'Algorithmic text analysis of citizen grievances quantifying urgency, community distress, and recurring neglect.'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs self-start md:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Avg Distress Level</span>
            <span className="font-mono text-sm font-bold text-rose-700">
              {avgFrustration}% Frustration
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Critical Escalations</span>
            <span className="font-mono text-sm font-bold text-slate-900">
              {criticalCount} of {total} Demands
            </span>
          </div>
        </div>
      </div>

      {/* Top Indicators Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-md border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block">Mean Urgency Index</span>
          <span className="font-mono font-bold text-slate-900 text-base">{avgUrgency}/100</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">Critical Distress (P1)</span>
          <span className="font-mono font-bold text-rose-700 text-base">{criticalCount} tickets</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">High Frustration (P2)</span>
          <span className="font-mono font-bold text-amber-700 text-base">{highCount} tickets</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">Text NLP Engine</span>
          <span className="font-mono font-semibold text-emerald-800 text-xs">Tamil & English Dual-Lexicon</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'கோரிக்கை தலைப்பு, ஊர் அல்லது எண் கொண்டு தேடுக...'
                : language === 'hi'
                ? 'शिकायत पाठ, गांव या ट्रैकिंग आईडी से खोजें...'
                : 'Search grievances by grievance text, village or tracking ID...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
          />
        </div>

        {/* Sentiment Tone Filter */}
        <select
          value={filterTone}
          onChange={(e) => setFilterTone(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none"
        >
          <option value="all">{language === 'ta' ? 'அனைத்து உணர்வு நிலைகளும்' : language === 'hi' ? 'सभी भावना स्तर' : 'All Sentiment Levels'}</option>
          <option value="critical">{language === 'ta' ? 'அதிதீவிர விரக்தி (Score 82+)' : language === 'hi' ? 'अति गंभीर असंतोष (स्कोर 82+)' : 'Critical Distress (Score 82+)'}</option>
          <option value="high">{language === 'ta' ? 'அதிக விரக்தி (Score 68-81)' : language === 'hi' ? 'उच्च असंतोष (स्कोर 68-81)' : 'High Frustration (Score 68-81)'}</option>
          <option value="moderate">{language === 'ta' ? 'மிதமான அதிருப்தி (Score 48-67)' : language === 'hi' ? 'मध्यम असंतोष' : 'Moderate Concern'}</option>
          <option value="low">{language === 'ta' ? 'சாதாரண தேவை' : language === 'hi' ? 'सामान्य आवश्यकता' : 'Standard Need'}</option>
        </select>

        {/* District Filter */}
        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none"
        >
          <option value="all">{language === 'ta' ? 'அனைத்து மாவட்டங்களும்' : language === 'hi' ? 'सभी ज़िले' : 'All Districts'}</option>
          <option value="Ramanathapuram">Ramanathapuram</option>
          <option value="Dharmapuri">Dharmapuri</option>
          <option value="Madurai">Madurai</option>
          <option value="Salem">Salem</option>
          <option value="Coimbatore">Coimbatore</option>
        </select>
      </div>

      {/* Ticket Cards Grid with Sentiment Badges */}
      <div className="space-y-3">
        {filtered.map((ticket) => {
          return (
            <div
              key={ticket.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs"
            >
              {/* Top Row: Tracking code, location, and the Sentiment Score Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
                    <span className="font-mono font-semibold text-[#0F2744]">{ticket.tracking_code}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-700 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {ticket.district} {ticket.taluk ? `, ${ticket.taluk}` : ''}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="capitalize text-slate-600">{ticket.category}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>

                  <h4 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                    {language === 'ta' ? ticket.title_ta : ticket.title_en}
                  </h4>
                </div>

                {/* Prominent Sentiment Score Badge */}
                <div className="shrink-0 sm:self-start">
                  <SentimentBadge
                    sentiment={ticket.sentiment}
                    language={language}
                    showDetails={true}
                  />
                </div>
              </div>

              {/* Citizen Text Body */}
              <div className="bg-slate-50/80 p-3 rounded border border-slate-200 my-2.5 text-xs text-slate-700 leading-relaxed">
                <div className="flex items-start gap-1.5 mb-1 text-slate-500 font-medium text-[11px]">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {language === 'ta' ? 'அசல் மக்கள் பதிவு / குரல் உரை:' : 'Direct Citizen Voice Submission:'}
                  </span>
                </div>
                <p className="italic text-slate-800">
                  "{ticket.raw_submission || ticket.description_en}"
                </p>
              </div>

              {/* Frustration and Urgency Metric Meters */}
              {ticket.sentiment && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Urgency Index (Life/Safety/Health Risk):</span>
                      <span className="font-mono font-bold text-slate-900">
                        {ticket.sentiment.urgency_index}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full rounded-full transition-all"
                        style={{ width: `${ticket.sentiment.urgency_index}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>Frustration Index (Neglect & Citizen Strain):</span>
                      <span className="font-mono font-bold text-slate-900">
                        {ticket.sentiment.frustration_index}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${ticket.sentiment.frustration_index}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer row with affected population and community support */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                <div>
                  Tagged Scheme: <span className="font-medium text-slate-800">{ticket.government_scheme || 'Public Works'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    Community Endorsements: <strong className="font-mono text-slate-900">{ticket.upvotes}</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>
                    Estimated Beneficiaries: <strong className="font-mono text-slate-900">{ticket.affected_population_estimate.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs">
            No citizen tickets match the chosen sentiment and district criteria.
          </div>
        )}
      </div>
    </div>
  );
};
