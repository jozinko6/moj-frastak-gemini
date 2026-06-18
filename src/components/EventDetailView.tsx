/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Check, 
  Heart, 
  ChevronLeft, 
  AlertTriangle 
} from 'lucide-react';

interface EventDetailViewProps {
  eventId: string | null;
  setView: (v: string) => void;
  setSelectedEventId: (id: string | null) => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({ 
  eventId, 
  setView, 
  setSelectedEventId 
}) => {
  const { events, currentUser, toggleEventRSVP } = useApp();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-xs space-y-4">
        <AlertTriangle size={36} className="text-amber-500 mx-auto" />
        <h4 className="font-serif font-bold text-slate-800">Udalosť nebola nájdená</h4>
        <button 
          onClick={() => { setSelectedEventId(null); setView('kalendar_podujati'); }}
          className="bg-wine-700 text-white font-bold px-4 py-2 rounded"
        >
          Späť na kalendár
        </button>
      </div>
    );
  }

  const isGoing = event.going.includes(currentUser.id);
  const isInterested = event.interested.includes(currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in text-xs">
      
      <button 
        onClick={() => { setSelectedEventId(null); setView('kalendar_podujati'); }}
        className="text-slate-505 text-slate-500 hover:text-slate-800 font-bold mb-4 flex items-center gap-1.5 bg-white border px-3 py-1.5 rounded-lg shadow-sm"
      >
        <ChevronLeft size={16} />
        <span>Späť na kalendár podujatí</span>
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 p-6 md:p-10 space-y-6">
        
        {/* Large visual banner */}
        <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden border">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <div className="space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#7A263A] text-white font-extrabold px-2.5 py-0.5 rounded text-[10px] uppercase">
              {event.category}
            </span>
            <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded text-[10px]">
              {event.isFree ? 'Zdravie (Zadarmo)' : `${event.price} €`}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {event.title}
          </h3>

          {/* Short specs */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] border text-slate-700">
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold uppercase text-[9px]">Dátum a Čas trvania</span>
              <span className="font-bold flex items-center gap-1">
                <Calendar size={13} />
                <span>{event.startDate} o {event.startTime}</span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-semibold uppercase text-[9px]">Miesto konania</span>
              <span className="font-bold flex items-center gap-1">
                <MapPin size={13} />
                <span>{event.location} ({event.address})</span>
              </span>
            </div>
          </div>

          {event.officialUrl && (
            <div className="bg-emerald-50 border border-emerald-250 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900 leading-normal">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center w-5 h-5">✓</span>
                <div>
                  <span className="font-bold block">Oficiálne overené podujatie mesta Hlohovec</span>
                  <p className="text-[11px] text-emerald-600 font-normal">Túto kultúrnu alebo spoločenskú akciu eviduje oficiálny mestský kalendár mesta Hlohovec.</p>
                </div>
              </div>
              <a 
                href={event.officialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shrink-0 transition-all text-[11px] whitespace-nowrap"
              >
                Otvoriť hlohovec.sk ↗
              </a>
            </div>
          )}

          <div className="text-slate-800 text-xs md:text-sm leading-relaxed font-normal pt-4 border-t space-y-4 whitespace-pre-wrap">
            {event.longDesc || event.shortDesc}
          </div>

          {/* Attendance panel */}
          <div className="bg-slate-50 p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="font-bold text-slate-850 block">Zúčastníte sa podujatia?</span>
              <span className="text-[10px] text-slate-500 block">{event.going.length} susedov potvrdilo účasť.</span>
            </div>

            {currentUser.role !== 'visitor' ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleEventRSVP(event.id, 'going')}
                  className={`py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                    isGoing 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isGoing ? <Check size={13} /> : null}
                  <span>Zúčastním sa ({event.going.length})</span>
                </button>

                <button 
                  onClick={() => toggleEventRSVP(event.id, 'interested')}
                  className={`py-2 px-4 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
                    isInterested 
                      ? 'bg-wine-100 text-wine-905 border border-wine-300' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Heart size={13} className={isInterested ? 'fill-wine-800 text-wine-900 border-none' : ''} />
                  <span>Mám záujem ({event.interested.length})</span>
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 italic">Pre zapísanie účasti sa musíte najprv prihlásiť.</span>
            )}
          </div>

          {/* Registration contact ribbon */}
          <div className="p-4 bg-wine-50 text-wine-900 rounded-xl border border-wine-200 flex flex-wrap justify-between items-center gap-3">
            <div>
              <span className="font-bold block text-[11px]">Bližšie kontaktné informácie organizátora:</span>
              <span className="text-[10px] opacity-80">{event.contact}</span>
            </div>
            {event.regUrl && (
              <a 
                href={event.regUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-wine-700 hover:bg-wine-800 text-white font-bold py-1.5 px-4 rounded uppercase"
              >
                Kúpiť lístky / Registrácia 🌐
              </a>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
