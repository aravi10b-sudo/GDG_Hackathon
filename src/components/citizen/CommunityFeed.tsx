import React, { useState } from 'react';
import { CitizenTicket, InfrastructureCategory, Language } from '../../types';
import { t } from '../../utils/translations';
import { ThumbsUp, Search, Filter, MapPin, Calendar, Building, Sparkles } from 'lucide-react';

interface CommunityFeedProps {
  tickets: CitizenTicket[];
  language: Language;
  onUpvoteTicket: (ticketId: string) => void;
  selectedDistrict: string;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  tickets,
  language,
  onUpvoteTicket,
  selectedDistrict,
}) => {
  const currentT = t[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  const filteredTickets = tickets.filter((tkt) => {
    const matchesSearch =
      tkt.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tkt.title_ta.includes(searchQuery) ||
      tkt.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tkt.taluk && tkt.taluk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tkt.tracking_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = sectorFilter === 'all' || tkt.category === sectorFilter;
    const matchesDistrict = districtFilter === 'all' || tkt.district === districtFilter;

    return matchesSearch && matchesSector && matchesDistrict;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6 shadow-xs">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-slate-900">
            {currentT.community_feed_title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentT.community_feed_desc}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 border border-slate-200 rounded self-start">
          {filteredTickets.length} {language === 'ta' ? 'கோரிக்கைகள்' : language === 'hi' ? 'सत्यापित मांगें' : 'Verified Demands'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentT.search_placeholder}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
          />
        </div>

        {/* Sector Filter Dropdown */}
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none"
        >
          <option value="all">{currentT.filter_all}</option>
          <option value="water">{currentT.cat_water}</option>
          <option value="roads">{currentT.cat_roads}</option>
          <option value="power">{currentT.cat_power}</option>
          <option value="health">{currentT.cat_health}</option>
          <option value="education">{currentT.cat_education}</option>
        </select>

        {/* District Filter Dropdown */}
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none"
        >
          <option value="all">{language === 'ta' ? 'அனைத்து மாவட்டங்களும்' : language === 'hi' ? 'सभी ज़िले' : 'All Districts'}</option>
          <option value="Madurai">Madurai</option>
          <option value="Ramanathapuram">Ramanathapuram</option>
          <option value="Dharmapuri">Dharmapuri</option>
          <option value="Salem">Salem</option>
          <option value="Coimbatore">Coimbatore</option>
          <option value="Tiruchirappalli">Tiruchirappalli</option>
        </select>
      </div>

      {/* Ticket List */}
      <div className="space-y-3.5">
        {filteredTickets.map((tkt) => {
          const isCritical = tkt.severity === 'critical';
          const isHigh = tkt.severity === 'high';

          return (
            <div
              key={tkt.id}
              className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  {/* Unboxed Metadata Line (No Pill Enclosures) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
                    <span className="font-mono text-[#0F2744] font-semibold">{tkt.tracking_code}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-700 capitalize flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {tkt.district} {tkt.taluk ? `, ${tkt.taluk}` : ''}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-600">
                      {new Date(tkt.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`font-semibold uppercase tracking-wider text-[11px] ${
                        isCritical
                          ? 'text-rose-700'
                          : isHigh
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {tkt.severity}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm md:text-base font-semibold text-slate-900 leading-snug">
                    {language === 'ta' ? tkt.title_ta : tkt.title_en}
                  </h4>
                </div>

                {/* Upvote Button */}
                <div className="shrink-0 flex items-center sm:self-center">
                  <button
                    onClick={() => onUpvoteTicket(tkt.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                      tkt.hasUpvoted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${
                        tkt.hasUpvoted ? 'text-emerald-600 fill-emerald-600' : 'text-slate-500'
                      }`}
                    />
                    <span>{tkt.hasUpvoted ? currentT.upvoted_btn : currentT.upvote_btn}</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-white text-slate-900 border border-slate-200 font-mono text-[11px]">
                      {tkt.upvotes}
                    </span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-2.5">
                {language === 'ta' ? tkt.description_ta : tkt.description_en}
              </p>

              {/* Bottom Details Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                <div className="flex items-center gap-3">
                  <span>
                    Scheme: <span className="text-slate-800 font-medium">{tkt.government_scheme || 'PMGSY / JJM'}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>
                    Channel: <span className="text-slate-700 uppercase font-mono">{tkt.channel}</span>
                  </span>
                </div>
                <div>
                  Impact: <span className="font-semibold text-slate-800 font-mono">{tkt.affected_population_estimate.toLocaleString('en-IN')}</span> residents
                </div>
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            {language === 'ta'
              ? 'கோரிக்கைகள் எதுவும் கிடைக்கவில்லை. புதிய கோரிக்கையை மேலே உள்ள படிவத்தில் பதிவு செய்யவும்.'
              : language === 'hi'
              ? 'कोई शिकायत नहीं मिली। सरकारी समीक्षा शुरू करने के लिए ऊपर एक नई शिकायत सबमिट करें।'
              : 'No grievances match your filter. Submit a new one above to initiate government review.'}
          </div>
        )}
      </div>
    </div>
  );
};
