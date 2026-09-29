import React from 'react';
import { CitizenTicket, Language } from '../../types';
import { t } from '../../utils/translations';
import { CheckCircle, QrCode, Printer, X, Shield, Clock, MapPin, Building2 } from 'lucide-react';

interface TicketReceiptModalProps {
  ticket: CitizenTicket | null;
  language: Language;
  onClose: () => void;
}

export const TicketReceiptModal: React.FC<TicketReceiptModalProps> = ({
  ticket,
  language,
  onClose,
}) => {
  if (!ticket) return null;
  const currentT = t[language];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Receipt Header Banner */}
        <div className="bg-[#0A192F] text-white p-4 flex items-center justify-between border-b-2 border-emerald-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-wider uppercase text-emerald-400 font-semibold block">
                {currentT.emblem_text}
              </span>
              <h3 className="text-sm md:text-base font-bold text-white">
                {currentT.receipt_title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-5 md:p-6 space-y-4 text-xs">
          {/* Tracking ID Badge Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
            <div>
              <span className="text-slate-500 text-[11px] block">
                {currentT.receipt_tracking_label}
              </span>
              <span className="font-mono text-base font-bold text-[#0F2744]">
                {ticket.tracking_code}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] block">Submission Date</span>
              <span className="font-mono text-slate-700">
                {new Date(ticket.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Ticket Title & Description */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              {language === 'ta' ? ticket.title_ta : ticket.title_en}
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              {language === 'ta' ? ticket.description_ta : ticket.description_en}
            </p>
          </div>

          {/* Unboxed Metadata Row */}
          <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Location</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {ticket.district} {ticket.taluk ? `· ${ticket.taluk}` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Tagged Department / Scheme</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{ticket.government_scheme || 'Public Works Department'}</span>
              </span>
            </div>
          </div>

          {/* SLA Timeline */}
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded text-emerald-900 flex items-start gap-2">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">{currentT.receipt_sla_label}</span>
              <span className="text-[11px] text-emerald-800">{currentT.receipt_sla_val}</span>
            </div>
          </div>

          {/* QR Code and verification guarantee */}
          <div className="flex items-center gap-4 pt-2">
            {/* SVG simulated QR Code */}
            <div className="w-16 h-16 bg-slate-900 p-1.5 rounded shrink-0 flex items-center justify-center">
              <QrCode className="w-12 h-12 text-white" />
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              <p className="font-medium text-slate-700">{currentT.receipt_qr_sub}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Integrates with Bharat Public Infrastructure Stack · Tamper-proof grievance ID.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{currentT.receipt_print}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F2744] hover:bg-[#0A192F] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            {currentT.receipt_close}
          </button>
        </div>
      </div>
    </div>
  );
};
