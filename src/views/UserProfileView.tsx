/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Settings, 
  Bookmark, 
  MapPin, 
  Clock, 
  Calendar, 
  FileText, 
  Compass, 
  Check, 
  Save, 
  Eye, 
  TrendingUp,
  Award,
  LogOut,
  ChevronRight,
  Smartphone,
  Download
} from 'lucide-react';

interface UserProfileViewProps {
  setView: (view: string) => void;
  setSelectedEventId: (id: string | null) => void;
  setSelectedIssueId: (id: string | null) => void;
  setSelectedAnnId: (id: string | null) => void;
  setSelectedDiscussionId: (id: string | null) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ 
  setView, 
  setSelectedEventId, 
  setSelectedIssueId, 
  setSelectedAnnId, 
  setSelectedDiscussionId 
}) => {
  const { 
    currentUser, 
    updateCurrentUserProfile,
    events,
    announcements,
    discussions,
    issues,
    canInstallPwa,
    installPwa,
    isOffline
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [notifyOutages, setNotifyOutages] = useState(true);
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter bookmarked items
  const savedEvents = events.filter(e => e.going.includes(currentUser.id) || e.interested.includes(currentUser.id));
  const savedDiscussions = discussions.filter(d => 
    d.reactions.suhlasim.includes(currentUser.id) || d.reactions.podporujem.includes(currentUser.id)
  );
  const savedIssues = issues.filter(i => i.supporters.includes(currentUser.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name,
      bio,
      avatar
    });
    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* PROFILE HEADER & SETTINGS HERO CARD */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6 relative">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-wine-500 shadow-md shrink-0 relative bg-slate-50">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">{currentUser.name}</h2>
              <span className="bg-wine-100 text-wine-900 font-bold border border-wine-200 text-[10px] px-2.5 py-0.5 rounded uppercase">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono italic">Môj Fraštak ID: {currentUser.id.substring(0, 8)}...</p>
            <p className="text-slate-600 text-xs sm:text-sm max-w-md italic leading-relaxed font-normal">
              {currentUser.bio || '„Susedské prepojenia robia Hlohovec bezpečnejším a poctivejším mestom pre život.“'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-550 text-slate-500 font-medium">
              <span>📧 {currentUser.email}</span>
              <span>📍 Členom od: 18. Jún, 2026</span>
            </div>
          </div>
        </div>

        {/* Change Profile CTA Button */}
        <div>
          <button 
            type="button"
            onClick={() => setEditing(!editing)}
            className="w-full bg-[#FAF7F2] hover:bg-slate-100 border text-slate-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Settings size={14} />
            <span>{editing ? 'Zrušiť úpravy' : 'Upraviť nastavenia profilu'}</span>
          </button>
        </div>

      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-center text-xs font-semibold animate-pulse">
          Profil bol úspešne uložený do systému.
        </div>
      )}

      {/* PWA & CONNECTION STATE SECTION */}
      <div className="bg-[#fcfbf9] rounded-3xl p-6 border border-[#eedecb] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#eedecb]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7A263A]/10 text-wine-900 flex items-center justify-center shrink-0">
              <Smartphone size={20} className="text-[#7A263A]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-slate-900">PWA Mobilná verzia aplikácie</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Váš smartfón komunikuje priamo s aplikáciou Môj Fraštak.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">DÁTOVÝ STAV:</span>
            {isOffline ? (
              <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span>
                <span>OFFLINE REŽIM AKTÍVNY</span>
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse"></span>
                <span>ONLINE - SYNCHRONIZÁCIA BEŽÍ</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-705">
          
          {/* Quick installation launcher */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between gap-4 shadow-sm">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Award size={15} className="text-wine-700 shrink-0" />
                <span>Natívny PWA režim</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                Naša aplikácia plne podporuje moderný PWA (Progressive Web App) štandard. Umožňuje vám bezpečne pridať ikonu na domovskú obrazovku telefónu a spúšťať ju rovnako ako natívny software s prístupom k ukladaniu dôležitých mestskej aktualít a kontaktov priamo do pamäte telefónu.
              </p>
            </div>

            {canInstallPwa ? (
              <button 
                type="button"
                onClick={installPwa}
                className="w-full bg-[#7A263A] hover:bg-[#8F3348] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-xs"
              >
                <Download size={14} />
                <span>Nainštalovať do mobilu</span>
              </button>
            ) : (
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-500 leading-normal">
                <span className="text-base shrink-0">📱</span>
                <div>
                  <span className="font-bold text-slate-700 block">Systém je optimalizovaný</span>
                  <span>Aplikácia už beží v natívnom režime, alebo váš webový prehliadač vyžaduje manuálny postup zobrazený vedľa.</span>
                </div>
              </div>
            )}
          </div>

          {/* Manual Instructions */}
          <div className="bg-[#FAF7F2]/80 rounded-2xl p-5 border border-[#eedecb]/45 space-y-3 shadow-sm">
            <h4 className="font-bold text-slate-950 text-xs flex items-center gap-1.5">
              <span className="text-sm">📋</span>
              <span>Ako pridať Môj Fraštak na plochu</span>
            </h4>
            
            <div className="space-y-3 text-[11px] leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="bg-[#7A263A]/10 text-wine-900 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <span className="font-bold text-slate-900">Apple iPhone (Safari):</span>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-normal">Kliknite na spodný štandardný gombík <strong className="font-bold">„Zdieľať“ 📤</strong>, v zobrazenom menu posuňte zoznam nižšie a stlačte <strong className="font-bold">„Pridať na domovskú obrazovku“ ➕</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="bg-[#7A263A]/10 text-wine-900 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <span className="font-bold text-slate-900">Android prehliadače (Chrome):</span>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-normal">Klepnutím na ikonu s tromi bodkami <strong className="font-bold">⠇</strong> v pravom hornom rohu vyhľadajte voľbu <strong className="font-bold">„Pridať na plochu“</strong> alebo <strong className="font-bold">„Inštalovať aplikáciu“</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="bg-[#7A263A]/10 text-wine-900 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <span className="font-bold text-slate-900">Jednoduché spustenie:</span>
                  <p className="text-slate-500 text-[10px] mt-0.5 leading-normal">Pridaná skratka na ploche sa spustí v plnohodnotnom režime na celej obrazovke bez horných adresných i vyhľadávacích panelov.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* EDITING DIALOG CONTAINER */}
      {editing && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border-2 border-wine-150 shadow-xl space-y-4 max-w-lg mx-auto text-xs leading-relaxed animate-in slide-in-from-top-4">
          <h3 className="font-serif font-bold text-sm text-slate-900 border-b pb-2">Upraviť osobné informácie</h3>
          
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Celé meno alebo Prezývka:</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-wine-500 text-xs" />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Stručný osobný bioprofil:</label>
            <textarea rows={3} required value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-wine-500 text-xs" />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-slate-750 block">Zvoľte si susedskú ikonku (Avatar):</label>
            <div className="flex gap-2.5 pt-1">
              {avatars.map((av, idx) => (
                <button 
                  key={idx} 
                  type="button" 
                  onClick={() => setAvatar(av)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all shrink-0 ${avatar === av ? 'border-wine-800 ring-2 ring-wine-300' : 'border-slate-205'}`}
                >
                  <img src={av} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-[10px] border">
            <span className="font-bold text-slate-805 block">E-mailové upozornenia:</span>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" checked={notifyOutages} onChange={(e) => setNotifyOutages(e.target.checked)} className="rounded" />
              <span>Chcem dostávať e-maily o dôležitých odstávkach elektriny/vody Hlohovca</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" checked={notifyEvents} onChange={(e) => setNotifyEvents(e.target.checked)} className="rounded" />
              <span>Chcem týždenný newsletter s programom susedských podujatí</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button type="button" onClick={() => setEditing(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg">Storno</button>
            <button type="submit" className="bg-wine-700 hover:bg-wine-800 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-1">
              <Save size={14} />
              <span>Uložiť nastavenia</span>
            </button>
          </div>
        </form>
      )}

      {/* USER BOOKMARKED / INTERESTED LISTS BLOCK */}
      <div className="space-y-6">
        <h3 className="text-xl font-serif font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
          <Bookmark size={20} className="text-wine-700" />
          <span>Moja záložková knižnica a podporené aktivity</span>
        </h3>

        {/* Triple grid splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">

          {/* 1. SAVED EVENTS */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-1">
              📅 Podujatia, na ktoré sa chystám ({savedEvents.length})
            </h4>

            {savedEvents.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">Zatiaľ ste v sekcii Podujatia nezaklikli účasť.</p>
            ) : (
              <div className="space-y-2">
                {savedEvents.map(e => (
                  <div 
                    key={e.id}
                    onClick={() => {
                      setSelectedEventId(e.id);
                      setView('detail_udalosti');
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-205 hover:border-wine-500 cursor-pointer shadow-sm transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border">
                      <img src={e.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-serif font-bold text-slate-900 truncate">{e.title}</h5>
                      <span className="text-[10px] text-slate-450 text-slate-400 font-semibold">{e.startDate} o {e.startTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. SUPPORTED CIVIC ISSUES */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-1">
              🚨 Podporené občianske podnety ({savedIssues.length})
            </h4>

            {savedIssues.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">Zatiaľ ste nepodporili žiadnu prebiehajúcu sťažnosť občanov.</p>
            ) : (
              <div className="space-y-2">
                {savedIssues.map(issue => (
                  <div 
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setView('obcianske_podnety');
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-205 hover:border-wine-500 cursor-pointer shadow-sm transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border">
                      <img src={issue.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-serif font-bold text-slate-900 truncate">{issue.title}</h5>
                      <div className="flex justify-between text-[9px] font-semibold text-slate-500 pt-0.5">
                        <span className="text-amber-800 uppercase">{issue.category}</span>
                        <span>Stav: {issue.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. ACTIVE DISCUSSIONS FEED PARTICIPATIONS */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-slate-800 border-b pb-2 flex items-center gap-1">
              💬 Debaty a fóra s mojou reakciou ({savedDiscussions.length})
            </h4>

            {savedDiscussions.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">Reagovania v diskusnom fóre zatiaľ chýbajú.</p>
            ) : (
              <div className="space-y-2">
                {savedDiscussions.map(disc => (
                  <div 
                    key={disc.id}
                    onClick={() => {
                      setSelectedDiscussionId(disc.id);
                      setView('komunitne_forum');
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-205 hover:border-wine-500 cursor-pointer shadow-sm transition-all space-y-1"
                  >
                    <h5 className="font-serif font-bold text-slate-900 truncate">{disc.title}</h5>
                    <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                      <span className="bg-wine-50 text-wine-905 px-1 rounded">{disc.category}</span>
                      <span>Autor: {disc.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
