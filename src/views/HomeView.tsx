/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  MapPin, 
  ChevronRight, 
  HelpCircle,
  Briefcase, 
  Award, 
  Building2, 
  TrendingUp, 
  Compass,
  Mail,
  Users,
  CheckCircle,
  Megaphone,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { INITIAL_LOCATIONS } from '../data/mockData';

interface HomeViewProps {
  setView: (view: string) => void;
  setSelectedEventId?: (id: string | null) => void;
  setSelectedDiscussionId?: (id: string | null) => void;
  setSelectedIssueId?: (id: string | null) => void;
  onOpenQuickAdd: (type: 'udalost' | 'oznam' | 'podnet' | 'diskusia') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  setView, 
  setSelectedEventId, 
  setSelectedDiscussionId, 
  setSelectedIssueId,
  onOpenQuickAdd
}) => {
  const { 
    events, 
    announcements, 
    issues, 
    discussions, 
    organizations, 
    campaigns, 
    jobs,
    currentUser,
    subscribeNewsletter
  } = useApp();

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Všetky časti');
  const [emailInput, setEmailInput] = useState('');
  const [newsfeedPreferences, setNewsfeedPreferences] = useState<string[]>(['vsetko']);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'oznamy' | 'udalosti' | 'podnety'>('oznamy');

  // Dynamic calculations
  const todaysDate = '2026-06-18'; // Matches context time

  const todaysEvents = events.filter(e => e.startDate === todaysDate && e.status === 'published');
  const weekendEvents = events.filter(e => {
    const d = new Date(e.startDate);
    const day = d.getDay();
    // Friday (5), Saturday (6), Sunday (0) which are close to 2026-06-20
    return (e.startDate === '2026-06-20' || e.startDate === '2026-06-21') && e.status === 'published';
  });

  const urgentAnnouncements = announcements.filter(a => a.importance === 'urgent' && a.status === 'published');
  const regularAnnouncements = announcements.filter(a => a.importance === 'normal' && a.status === 'published');

  const partnerCampaign = campaigns.find(c => c.format === 'partner_tyzdna' && c.status === 'active');
  const cardCampaign = campaigns.find(c => c.format === 'sponzorovana_karta' && c.status === 'active');

  const totalRegisteredUsers = 1340; // Simulated count

  // Filter content by neighborhood on the mini map
  const activeIssues = selectedNeighborhood === 'Všetky časti' 
    ? issues 
    : issues.filter(i => i.location === selectedNeighborhood);

  const activeEvents = selectedNeighborhood === 'Všetky časti'
    ? events
    : events.filter(e => e.location === selectedNeighborhood);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    const isNew = subscribeNewsletter(emailInput, newsfeedPreferences);
    setSignupSuccess(
      isNew 
        ? 'Váša emailová adresa bola aktualizovaná.' 
        : 'Ďakujeme! Odber hlohoveckého newslettera bol úspešne aktivovaný.'
    );
    setEmailInput('');
  };

  const selectEvent = (id: string) => {
    if (setSelectedEventId) setSelectedEventId(id);
    setView('detail_udalosti');
  };

  const selectDiscussion = (id: string) => {
    if (setSelectedDiscussionId) setSelectedDiscussionId(id);
    setView('detail_diskusie');
  };

  const selectIssue = (id: string) => {
    if (setSelectedIssueId) setSelectedIssueId(id);
    setView('detail_podnetu');
  };

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* ========================================== */}
      {/* A. MOBILE PORTAL VIEW (block md:hidden)   */}
      {/* ========================================== */}
      <div className="block md:hidden pb-16 bg-[#FAF7F2] min-h-screen">
        
        {/* Compact, clean greeting card */}
        <div className="bg-[#7A263A] text-white px-5 py-8 rounded-b-[2rem] border-b border-[#eedecb] relative overflow-hidden flex flex-col gap-4 shadow-xl">
          <div className="absolute inset-0 bg-radial-gradient from-wine-800 to-wine-950 opacity-40 mix-blend-multiply" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Komunitný portál Hlohovca</span>
              <h2 className="text-2xl font-serif font-extrabold tracking-tight mt-0.5">Môj Fraštak</h2>
            </div>
            <div className="bg-white/10 px-2.5 py-1 rounded-xl border border-white/20 text-[10px] font-semibold text-amber-100 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block animate-pulse"></span>
              <span>18. jún 2026</span>
            </div>
          </div>

          <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold font-serif text-white">Ahoj, {currentUser.name || 'sused'}! 👋</h3>
              <p className="text-[10px] text-slate-300 leading-relaxed mt-0.5">Všetky dôležité udalosti a hlásenia nájdete na jednom mieste.</p>
            </div>
            {currentUser.role !== 'visitor' && (
              <button 
                onClick={() => onOpenQuickAdd('podnet')}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-[10px] px-3.5 py-1.5 rounded-xl shrink-0 shadow transition-all flex items-center gap-1"
              >
                <Plus size={12} className="stroke-[3]" />
                <span>Nahlásiť</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories/Services Quick Grid Hub */}
        <div className="px-4 py-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Hlavný rozcestník</span>
            <span className="text-[9px] text-[#7A263A] font-bold">Základné sekcie</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            
            <button 
              onClick={() => setView('oznamy')}
              className="bg-white p-3 rounded-2xl border border-dashed border-[#eedecb] flex flex-col items-center justify-center text-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
                <Megaphone size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-none mt-1">Oznamy</span>
            </button>

            <button 
              onClick={() => setView('udalosti')}
              className="bg-white p-3 rounded-2xl border border-dashed border-[#eedecb] flex flex-col items-center justify-center text-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="w-9 h-9 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-none mt-1">Kultúra akcií</span>
            </button>

            <button 
              onClick={() => setView('podnety')}
              className="bg-white p-3 rounded-2xl border border-dashed border-[#eedecb] flex flex-col items-center justify-center text-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="w-9 h-9 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-none mt-1">Sťažnosti</span>
            </button>

            <button 
              onClick={() => setView('diskusie')}
              className="bg-white p-3 rounded-2xl border border-dashed border-[#eedecb] flex flex-col items-center justify-center text-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="w-9 h-9 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-none mt-1">Diskusné fórum</span>
            </button>

            <button 
              onClick={() => setView('adresar')}
              className="bg-white p-3 rounded-2xl border border-dashed border-[#eedecb] flex flex-col items-center justify-center text-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="w-9 h-9 bg-cyan-50 text-cyan-700 rounded-xl flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-none mt-1">Firmy</span>
            </button>

            <button 
              onClick={() => setView('prace')}
              className="bg-white p-3 rounded-2xl border border-dashed border-[#eedecb] flex flex-col items-center justify-center text-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <div className="w-9 h-9 bg-[#FAF7F2] text-wine-900 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-none mt-1">Kariéra</span>
            </button>

          </div>
        </div>

        {/* Modern, high contrast urgent alerts ticker */}
        {urgentAnnouncements.length > 0 && (
          <div className="px-4 py-2">
            <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 flex gap-3 shadow-inner">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <span className="text-[9px] font-bold text-amber-800 font-mono tracking-wider block">KRITICKÉ OZNÁMENIE:</span>
                <p className="font-bold text-slate-900 text-xs mt-0.5 leading-snug">{urgentAnnouncements[0].title}</p>
                <button 
                  onClick={() => setView('oznamy')}
                  className="text-wine-800 font-bold hover:underline text-[10px] mt-1.5 flex items-center gap-0.5"
                >
                  <span>Prečítať celé znenie</span>
                  <ChevronRight size={12} className="stroke-[2]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Curated Highlights Unified Feed Section */}
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-[#eedecb] shadow-md flex flex-col">
            
            <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 flex items-center gap-1 shrink-0">
              
              <button 
                onClick={() => setActiveMobileTab('oznamy')}
                className={`flex-1 text-[10px] py-2 px-1 rounded-xl font-bold transition-all text-center leading-none truncate ${
                  activeMobileTab === 'oznamy' ? 'bg-[#7A263A] text-white shadow' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📢 Oznamy
              </button>

              <button 
                onClick={() => setActiveMobileTab('udalosti')}
                className={`flex-1 text-[10px] py-2 px-1 rounded-xl font-bold transition-all text-center leading-none truncate ${
                  activeMobileTab === 'udalosti' ? 'bg-[#7A263A] text-white shadow' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📅 Udalosti
              </button>

              <button 
                onClick={() => setActiveMobileTab('podnety')}
                className={`flex-1 text-[10px] py-2 px-1 rounded-xl font-bold transition-all text-center leading-none truncate ${
                  activeMobileTab === 'podnety' ? 'bg-[#7A263A] text-white shadow' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🚧 Podnety
              </button>

            </div>

            {/* Tap content representation */}
            <div className="pt-4 min-h-[220px]">
              
              {activeMobileTab === 'oznamy' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wide">NAJNOVŠIE HORE</span>
                    <button onClick={() => setView('oznamy')} className="text-wine-800 text-[10px] font-bold flex items-center gap-0.5">
                      <span>Všetky oznamy</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                  {regularAnnouncements.slice(0, 3).map(ann => (
                    <div 
                      key={ann.id} 
                      onClick={() => setView('oznamy')}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100/80 cursor-pointer active:scale-99 transition-all"
                    >
                      <div className="flex justify-between items-center text-[8px] text-slate-400">
                        <span className="bg-blue-50 text-blue-700 font-bold px-1 rounded">{ann.category}</span>
                        <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 leading-snug mt-1.5 truncate">{ann.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-snug">{ann.shortDesc}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeMobileTab === 'udalosti' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wide">KAM CEZ VÍKEND</span>
                    <button onClick={() => setView('udalosti')} className="text-wine-800 text-[10px] font-bold flex items-center gap-0.5">
                      <span>Celý kalendár</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                  {weekendEvents.length === 0 ? (
                    <p className="text-[11px] text-slate-500 italic py-6 text-center">Tento víkend nie sú plánované žiadne verejné podujatia.</p>
                  ) : (
                    weekendEvents.slice(0, 3).map(e => (
                      <div 
                        key={e.id} 
                        onClick={() => selectEvent(e.id)}
                        className="p-2 bg-[#FCFAF7] hover:bg-[#FAF7F2] rounded-xl border border-slate-150 flex items-center gap-3 cursor-pointer active:scale-99 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img src={e.image} alt={e.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">{e.title}</h4>
                          <p className="text-[10px] text-slate-500 truncate leading-none mt-1">{e.startDate} • {e.location}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeMobileTab === 'podnety' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wide">HLÁSENÉ OBČANMI</span>
                    <button onClick={() => setView('podnety')} className="text-wine-800 text-[10px] font-bold flex items-center gap-0.5">
                      <span>Všetky podnety</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                  {issues.slice(0, 3).map(i => (
                    <div 
                      key={i.id} 
                      onClick={() => selectIssue(i.id)} 
                      className="p-2 bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] rounded-xl border border-[#eedecb]/40 flex gap-3 items-center cursor-pointer active:scale-99 transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                        <img src={i.image} alt={i.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 leading-none">
                          <span className={`text-[8px] font-semibold px-1 py-0.2 rounded-full leading-none ${
                            i.status === 'Vyriešený' ? 'bg-emerald-100 text-emerald-800' :
                            i.status === 'Rieši sa' ? 'bg-yellow-100 text-yellow-850' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {i.status}
                          </span>
                          <span className="text-[9px] text-slate-400 font-normal truncate">{i.location}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 mt-1 truncate">{i.title}</h4>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Compact Partner of the Week Promo */}
        {partnerCampaign && (
          <div className="px-4 pb-6">
            <div className="bg-gradient-to-br from-wine-900 to-[#310811] text-white rounded-3xl p-5 border border-wine-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded shadow">Partner Týždňa</span>
                <span className="text-[9px] text-white/60">Komunita a Inzercia</span>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl overflow-hidden shrink-0 border border-white/25">
                  <img src={partnerCampaign.image} alt="partner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs font-serif leading-snug text-white truncate">{partnerCampaign.title}</h4>
                  <p className="text-[10px] text-slate-300 leading-normal line-clamp-2 mt-0.5">{partnerCampaign.text}</p>
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <a 
                  href={partnerCampaign.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-wine-900 font-extrabold text-[10px] tracking-tight px-4 py-1.5 rounded-xl block active:scale-95 transition-all text-center"
                >
                  Navštíviť partnera ↗
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* B. DESKTOP VIEWPORT ONLY (hidden md:block) */}
      {/* ========================================== */}
      <div className="hidden md:block space-y-12">
        
        {/* 1. HERO HEADER SECTION */}
        <section className="relative bg-gradient-to-br from-wine-900 via-wine-955 to-[#1c070c] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8DED2]">
        
        {/* Subtle decorative background watermark */}
        <div className="absolute inset-0 opacity-10 bg-no-repeat bg-[#7A263A] bg-cover mix-blend-overlay"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-200 border border-white/20">
            <Award size={14} className="text-amber-300" />
            <span>Oficiálny Komunitný Spasiteľ Hlohovca</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight leading-none text-white">
            Môj Fraštak
          </h2>
          
          <p className="text-lg md:text-xl font-medium tracking-tight text-amber-50">
            Čo sa deje v Hlohovci, na jednom mieste.
          </p>

          <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
            Moderná komunitná nástenka pre obyvateľov Hlohovca, Šulekova, Leopoldova, Červeníka a blízkeho okolia. Sledujte dôležité výpadky, plánujte víkend s rodinou, nahlasujte problémy a zapojte sa do miestneho diania.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {currentUser.role !== 'visitor' ? (
              <>
                <button 
                  onClick={() => onOpenQuickAdd('udalost')}
                  className="bg-[#FAF7F2] text-[#7A263A] hover:bg-white font-semibold text-xs md:text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Pridať udalosť +
                </button>
                <button 
                  onClick={() => onOpenQuickAdd('podnet')}
                  className="bg-[#D97706] text-white hover:bg-amber-600 font-semibold text-xs md:text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <AlertTriangle size={15} />
                  <span>Nahlásiť problém (Podnet)</span>
                </button>
                <button 
                  onClick={() => onOpenQuickAdd('diskusia')}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs md:text-sm px-5 py-3 rounded-xl transition-all"
                >
                  Otvoriť diskusiu
                </button>
              </>
            ) : (
              <button 
                onClick={() => setView('profil')}
                className="bg-[#FAF7F2] text-[#7A263A] hover:bg-white font-semibold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Prihláste sa a prispievajte do komunity
              </button>
            )}
          </div>
        </div>

        {/* Dynamic statistics ribbon */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center text-xs">
          <div>
            <span className="block text-xl font-bold text-amber-300">{events.length}</span>
            <span className="opacity-75">Plánovaných udalostí</span>
          </div>
          <div className="border-l border-white/10">
            <span className="block text-xl font-bold text-amber-300">{announcements.length}</span>
            <span className="opacity-75">Aktuálnych oznamov</span>
          </div>
          <div className="border-l border-white/10">
            <span className="block text-xl font-bold text-amber-300">{issues.filter(i=> i.status !== 'Vyriešený').length}</span>
            <span className="opacity-75">Riešených podnetov</span>
          </div>
          <div className="border-l border-white/10">
            <span className="block text-xl font-bold text-amber-300">{totalRegisteredUsers}</span>
            <span className="opacity-75">Susedov na portáli</span>
          </div>
        </div>

      </section>

      {/* 2. URGENT ANNOUNCEMENT BAR (Dôležité upozornenia) */}
      {urgentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 shadow-sm animate-pulse-slow">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="font-bold text-amber-900 text-sm">DÔLEŽITÉ UPOZORNENIE V MESTE:</h4>
                <div className="space-y-2 mt-1">
                  {urgentAnnouncements.map(ann => (
                    <div key={ann.id} className="text-xs text-amber-800 flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/50 pb-2 last:border-none last:pb-0">
                      <span><strong>{ann.title}</strong> – Platnosť do {ann.endDate || 'odvolania'} ({ann.location})</span>
                      <button 
                        onClick={() => {
                          setSelectedIssueId && setSelectedIssueId(ann.id); // Re-use ID slot for detail routing
                          setView('oznamy');
                        }}
                        className="text-wine-800 font-bold hover:underline flex items-center gap-0.5 shrink-0"
                      >
                        <span>Viac informácií</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. DOCK GRID (Left panel: Map & Location picker, Right panel: Today and weekend agenda) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAP & LOCALITY NAVIGATION */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E8DED2] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="text-wine-800" size={18} />
                <h3 className="font-serif font-bold text-lg text-slate-900">Mapa a dianie podľa častí</h3>
              </div>
              <span className="text-[10px] bg-wine-50 text-wine-900 font-bold px-2 py-1 rounded">Hlohovec a okolie</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Zvoľte časť mesta na mape nižšie, čím prefiltrujete zoznam aktívnych oznámení, dôležitých prác na ceste a nahlásených podnetov v okolitom rádiuse.
            </p>

            {/* Interactive Vector Locality Grid Map */}
            <div className="relative bg-[#FAF7F2] rounded-xl border border-dashed border-slate-300 p-4 h-64 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-2 left-2 bg-white px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 border">
                Interaktívny náhľad mesta
              </div>

              {/* Simulated Map Blocks using customizable SVG or Styled Grids */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-sm relative z-10">
                {INITIAL_LOCATIONS.map((loc, i) => {
                  const itemsCount = issues.filter(issue => issue.location === loc).length + events.filter(e => e.location === loc).length;
                  const isActive = selectedNeighborhood === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => setSelectedNeighborhood(loc === selectedNeighborhood ? 'Všetky časti' : loc)}
                      className={`p-2 rounded-lg border text-left flex flex-col justify-between h-16 transition-all ${
                        isActive 
                          ? 'bg-wine-700 text-white border-wine-800 scale-[1.03] shadow-md shadow-wine-700/25' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-[10px] font-semibold leading-none truncate w-full">{loc.split(' – ')[0]}</span>
                      <span className="text-[9px] opacity-75 truncate">{loc.split(' – ')[1] || 'Kraj'}</span>
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className={`text-[8px] px-1 py-0.2 rounded font-mono ${isActive ? 'bg-white text-wine-900' : 'bg-slate-100 text-slate-500'}`}>
                          {itemsCount} aktív.
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Clear neighborhood filter */}
              {selectedNeighborhood !== 'Všetky časti' && (
                <button 
                  onClick={() => setSelectedNeighborhood('Všetky časti')}
                  className="absolute bottom-2 right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                >
                  Zrušiť filter [x]
                </button>
              )}
            </div>

            {/* Neighborhood statistics feedback */}
            <div className="bg-slate-50 p-3 rounded-xl border text-xs">
              <p className="font-bold text-slate-800 text-center">
                Aktívna oblasť: <span className="text-wine-800 font-serif">{selectedNeighborhood}</span>
              </p>
              {selectedNeighborhood !== 'Všetky časti' ? (
                <div className="grid grid-cols-2 gap-2 mt-2 text-center text-[10px]">
                  <div className="bg-white p-1 rounded border">
                    <span className="font-bold block text-slate-800 text-sm">{activeEvents.length}</span>
                    <span>Plánované podujatia</span>
                  </div>
                  <div className="bg-white p-1 rounded border">
                    <span className="font-bold block text-slate-800 text-sm">{activeIssues.length}</span>
                    <span>Nahlásené problémy</span>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Kliknutím na dielik mapy zobrazíte štatistiky príslušnej časti mesta.
                </p>
              )}
            </div>

          </div>

          {/* EVENTS CALENDAR HIGHLIGHTS (Dnes a tento víkend) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E8DED2] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="text-wine-800" size={18} />
                <h3 className="font-serif font-bold text-lg text-slate-900">Kam v Hlohovci cez víkend</h3>
              </div>
              <button onClick={() => setView('udalosti')} className="text-wine-800 hover:text-wine-900 text-xs font-bold flex items-center gap-0.5">
                <span>Všetky</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Dnes v Hlohovci */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Dostupné dnes (štvrtor)</span>
              {todaysEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Dnes nie sú naplánované žiadne podujatia. Stavte sa cez víkend!</p>
              ) : (
                todaysEvents.map(e => (
                  <div key={e.id} onClick={() => selectEvent(e.id)} className="p-3 bg-[#FCFAF7] hover:bg-[#FAF7F2] rounded-xl border border-slate-100 flex items-center justify-between cursor-pointer transition-all">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{e.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{e.startTime} • {e.location}</p>
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase">Dnes</span>
                  </div>
                ))
              )}
            </div>

            {/* Cez víkend */}
            <div className="space-y-2 pt-2 border-t">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">Najbližší Víkend (20. - 21. jún)</span>
              {weekendEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Cez víkend nie sú plánované žiadne verejné podujatia.</p>
              ) : (
                weekendEvents.map(e => (
                  <div key={e.id} onClick={() => selectEvent(e.id)} className="p-3 bg-[#FCFAF7] hover:bg-[#FAF7F2] rounded-xl border border-slate-100 flex gap-3 items-center cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img src={e.image} alt={e.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{e.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{e.startDate} • {e.location}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                ))
              )}
            </div>

            {/* Sponzoring podujatia banner */}
            {cardCampaign && (
              <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-300 rounded-xl p-3 flex gap-3 items-center">
                <span className="text-lg">🍪</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[7px] bg-amber-600 text-white font-bold px-1 py-0.1 rounded uppercase">Sponzorované</span>
                  <h4 className="font-bold text-[11px] text-slate-800 leading-none mt-1 truncate">{cardCampaign.title}</h4>
                  <p className="text-[10px] text-slate-505 text-slate-500 truncate leading-snug mt-0.5">{cardCampaign.text}</p>
                </div>
                <a href={cardCampaign.link} target="_blank" rel="noopener noreferrer" className="text-amber-800 font-bold hover:underline shrink-0 text-xs">Viac</a>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. ANNOUNCEMENTS BENGRID (Mesto a organizácie informujú) */}
      <section className="bg-white py-12 border-y border-[#E8DED2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-1.5 text-wine-800 font-bold text-xs uppercase tracking-wider">
                <Megaphone size={14} />
                <span>Úradná nástenka</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">Mesto a partnerské organizácie informujú</h3>
            </div>
            <button onClick={() => setView('oznamy')} className="text-wine-800 hover:text-wine-900 text-xs font-bold flex items-center gap-0.5">
              <span>Zobraziť všetky oznamy</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularAnnouncements.slice(0, 3).map(ann => (
              <div 
                key={ann.id} 
                className="bg-[#FCFAF7] rounded-xl p-5 border border-slate-200/80 hover:border-wine-300 transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2 py-0.5 rounded">{ann.category}</span>
                    <span className="text-slate-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 leading-snug">{ann.title}</h4>
                  <p className="text-xs text-slate-505 text-slate-500 leading-relaxed line-clamp-3">{ann.shortDesc}</p>
                </div>

                <div className="pt-3 border-t flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 italic">Zdroj: {ann.authorName}</span>
                  <button 
                    onClick={() => {
                      setSelectedIssueId && setSelectedIssueId(ann.id); // Re-use for routing
                      setView('oznamy');
                    }}
                    className="text-wine-800 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>Čítať oznam</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PASSIVE BENTO PANEL (Left side: Civic Issues tracker, Right side: Most active Discussions forum) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CIVIC ISSUES COLUMN */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8DED2] shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-wine-800" size={18} />
                <h3 className="font-serif font-bold text-lg text-slate-900">Aktuálne podnety občanov</h3>
              </div>
              <button onClick={() => setView('podnety')} className="text-wine-800 hover:text-wine-900 text-xs font-bold flex items-center gap-0.5">
                <span>Viac podnetov</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Obyvatelia Hlohovca pomáhajú udržiavať naše mesto čisté a zdravé. Prehliadnite si najčastejšie nahlásené problémy a podporte tie, ktoré vás trápia.
            </p>

            <div className="space-y-3">
              {issues.slice(0, 3).map(i => (
                <div 
                  key={i.id} 
                  onClick={() => selectIssue(i.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex gap-3 items-center cursor-pointer transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    <img src={i.image} alt={i.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        i.status === 'Vyriešený' ? 'bg-emerald-100 text-emerald-800' :
                        i.status === 'Rieši sa' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {i.status}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">{i.location}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 truncate">{i.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Sila komunity: {i.supporters.length} susedov podporilo</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-350 text-slate-400" />
                </div>
              ))}
            </div>
          </div>

          {/* DISCUSSIONS COLUMN */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8DED2] shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-wine-800" size={18} />
                <h3 className="font-serif font-bold text-lg text-slate-900">Najviac diskutované diskusie</h3>
              </div>
              <button onClick={() => setView('diskusie')} className="text-wine-800 hover:text-wine-900 text-xs font-bold flex items-center gap-0.5">
                <span>Viac tém</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Máte názor na rozvoj dopravy, ihrísk alebo kultúry v meste? Zapojte sa do konštruktívneho a slušného fóra s ostatnými obyvateľmi a volenými zástupcami.
            </p>

            <div className="space-y-3">
              {discussions.slice(0, 3).map(disc => {
                const commentsCount = 8; // Simulated comments count
                const upvotes = disc.reactions.suhlasim.length;
                return (
                  <div 
                    key={disc.id} 
                    onClick={() => selectDiscussion(disc.id)}
                    className="p-3 bg-[#FCFAF7] hover:bg-[#FAF7F2] rounded-xl border border-slate-100 flex flex-col justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-wine-800">{disc.category}</span>
                      <span>Typ: {disc.type}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 leading-snug line-clamp-1">{disc.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                      <span className="inline-flex items-center gap-0.5">💬 Komentáre</span>
                      <span className="inline-flex items-center gap-0.5">👍 Súhlasí: {upvotes}</span>
                      <span className="text-slate-500 italic ml-auto truncate max-w-[120px]">Občan: {disc.authorName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 6. PARTNER OF THE WEEK (Monetization component) */}
      {partnerCampaign && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-wine-900 to-[#3d0d18] text-white rounded-3xl overflow-hidden shadow-xl border border-wine-850 flex flex-col md:flex-row">
            <div className="md:w-1/2 h-64 md:h-auto min-h-[220px] bg-slate-100 relative">
              <img src={partnerCampaign.image} alt={partnerCampaign.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-900 font-bold text-[9px] px-2 py-1 rounded shadow-md uppercase tracking-wider">
                Partner Týždňa
              </span>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300">Projektová inzercia</span>
              <h3 className="font-serif font-bold text-2xl md:text-3xl leading-tight text-white">{partnerCampaign.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{partnerCampaign.text}</p>
              <div className="pt-2">
                <a 
                  href={partnerCampaign.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-[#FAF7F2] text-[#7A263A] hover:bg-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-all active:scale-95"
                >
                  <span>Chcem ochutnať / Navštíviť</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. VERIFIED ORGS & FEATURED BUSINESSES */}
      <section className="bg-white py-12 border-t border-[#E8DED2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-wine-800 font-bold uppercase tracking-wider">Komunita a Obchody s odznakom dôvery</span>
              <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">Overené organizácie a lokálne obchody</h3>
            </div>
            <button onClick={() => setView('adresar')} className="text-wine-800 hover:text-wine-900 text-xs font-bold flex items-center gap-0.5">
              <span>Zobraziť adresár firiem</span>
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {organizations.slice(0, 4).map(org => (
              <div 
                key={org.id} 
                onClick={() => setView('adresar')}
                className="bg-[#FCFAF7] border border-slate-200/80 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:scale-[1.01] hover:border-wine-300 cursor-pointer transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border">
                  <img src={org.logo} alt={org.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 leading-snug mt-3 truncate w-full">{org.name}</h4>
                <div className="flex items-center gap-1 justify-center text-[9px] text-blue-600 mt-1">
                  <CheckCircle size={10} className="fill-blue-50 text-blue-600" />
                  <span>Overený Profil</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CAREERS CORNER (Najnovšie pracovné ponuky) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-wine-800 font-bold uppercase tracking-wider">Práca v regióne</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900 mt-1">Aktuálne pracovné ponuky v okolí</h3>
          </div>
          <button onClick={() => setView('prace')} className="text-wine-800 hover:text-wine-900 text-xs font-bold flex items-center gap-0.5">
            <span>Zobraziť všetkých {jobs.length} ponúk</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.slice(0, 3).map(offer => (
            <div 
              key={offer.id} 
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#D97706]/55 transition-all"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">{offer.type}</span>
                  <span className="text-emerald-700 font-extrabold">{offer.salary}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">{offer.title}</h4>
                <p className="text-[10px] text-slate-400 block font-semibold">{offer.businessName} • {offer.location}</p>
                <p className="text-xs text-slate-505 text-slate-500 leading-relaxed line-clamp-3">{offer.description}</p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Platnosť do: {offer.expiresAt}</span>
                <button onClick={() => setView('prace')} className="text-wine-800 font-bold hover:underline flex items-center gap-0.5">
                  <span>Zobraziť ponuku</span>
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION (Odber newslettera) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] border-2 border-dashed border-[#E8DED2] rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 lg:max-w-lg text-center lg:text-left">
            <div className="inline-flex p-2.5 bg-[#7A263A]/10 text-wine-800 rounded-xl items-center justify-center">
              <Mail size={22} />
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl text-slate-900">Majte Hlohovec v kapse</h3>
            <p className="text-xs text-slate-505 text-slate-500 leading-relaxed">
              Odoberajte najdôležitejšie mestské správy, plánované odstávky pitnej vody/energie, zaujímavé kultúrne akcie a prehľady nahlásených podnetov každý piatok ráno priamo do vašej schránky.
            </p>
          </div>

          <div className="w-full lg:max-w-md bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            {signupSuccess ? (
              <div className="text-center space-y-3 py-4">
                <span className="text-2xl">🎉</span>
                <p className="text-xs text-emerald-800 font-bold">{signupSuccess}</p>
                <button 
                  onClick={() => setSignupSuccess(null)}
                  className="text-[10px] text-wine-800 hover:underline font-semibold"
                >
                  Prihlásiť ďalší email
                </button>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block text-[11px]">Váš e-mailový kontakt:</label>
                  <input 
                    type="email" 
                    required
                    placeholder="napr. sused@hlohovec.sk"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block text-[11px]">Čo preferujete odosielať?</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        value="udalosti"
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewsfeedPreferences(prev => prev.includes(val) ? prev.filter(p=>p!==val) : [...prev, val]);
                        }}
                      />
                      <span>Týždenné podujatia</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        value="oznamy"
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewsfeedPreferences(prev => prev.includes(val) ? prev.filter(p=>p!==val) : [...prev, val]);
                        }}
                      />
                      <span>Odstávky a Uzávierky</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="podnety"
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewsfeedPreferences(prev => prev.includes(val) ? prev.filter(p=>p!==val) : [...prev, val]);
                        }}
                      />
                      <span>Komunálne sťažnosti</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="prace"
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewsfeedPreferences(prev => prev.includes(val) ? prev.filter(p=>p!==val) : [...prev, val]);
                        }}
                      />
                      <span>Pracovné inzeráty</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold p-2.5 rounded-lg hover:bg-slate-800 transition-colors text-xs"
                >
                  Aktivovať bezplatný odber noviniek
                </button>

                <p className="text-[9px] text-slate-400 text-center leading-snug">
                  Prihlásením súhlasíte so spracovaním emailu v súlade s GDPR a zásadami overeného komunitného portálu Môj Fraštak. Z odberu sa odhlásite kedykoľvek 1 klikom.
                </p>

              </form>
            )}
          </div>

        </div>
      </section>

      </div> {/* END OF DESKTOP WRAPPER */}

    </div>
  );
};
