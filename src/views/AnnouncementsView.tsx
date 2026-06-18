/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Megaphone, 
  MapPin, 
  Clock, 
  AlertOctagon, 
  ShieldCheck, 
  Calendar, 
  Search, 
  Plus, 
  BookOpen, 
  ChevronLeft,
  ChevronRight,
  Archive,
  AlertTriangle 
} from 'lucide-react';
import { AnnouncementCategory, AnnouncementType, AnnouncementImportance } from '../types';

interface AnnouncementsViewProps {
  setView: (view: string) => void;
  selectedAnnId?: string | null;
  setSelectedAnnId?: (id: string | null) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ 
  setView, 
  selectedAnnId, 
  setSelectedAnnId 
}) => {
  const { announcements, currentUser, addAnnouncement } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Všetky');
  const [activeType, setActiveType] = useState<string>('Všetky');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newFullText, setNewFullText] = useState('');
  const [newCategory, setNewCategory] = useState<AnnouncementCategory>('Odstávky');
  const [newType, setNewType] = useState<AnnouncementType>('Komunitný oznam');
  const [newImportance, setNewImportance] = useState<AnnouncementImportance>('normal');
  const [newLocation, setNewLocation] = useState('Hlohovec – centrum');
  const [newEndDate, setNewEndDate] = useState('');

  // Selected item detail state
  const [activeDetailId, setActiveDetailId] = useState<string | null>(selectedAnnId || null);

  const categories = [
    'Všetky',
    'Odstávky',
    'Doprava',
    'Uzávierky',
    'Odpad',
    'Mestský úrad',
    'Školy',
    'Bezpečnosť',
    'Počasie',
    'Mimoriadne udalosti',
    'Iné'
  ];

  const types = [
    'Všetky',
    'Oficiálny oznam',
    'Informácia organizátora',
    'Komunitný oznam',
    'Neoverená informácia'
  ];

  const filteredAnnouncements = announcements.filter(ann => {
    if (ann.status === 'draft') return false;

    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ann.fullText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'Všetky' || ann.category === activeCategory;
    const matchesType = activeType === 'Všetky' || ann.type === activeType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newFullText) return;

    // Organization or Admins fallback type checking
    let publishedType = newType;
    if (currentUser.role === 'admin' || currentUser.role === 'organization') {
      publishedType = 'Oficiálny oznam';
    }

    addAnnouncement({
      title: newTitle,
      shortDesc: newShortDesc || newFullText.substring(0, 100) + '...',
      fullText: newFullText,
      category: newCategory,
      type: publishedType,
      importance: newImportance,
      location: newLocation,
      startDate: new Date().toISOString().split('T')[0],
      endDate: newEndDate || undefined,
      authorId: currentUser.id,
      authorName: currentUser.name
    });

    // Reset Form
    setNewTitle('');
    setNewShortDesc('');
    setNewFullText('');
    setNewCategory('Odstávky');
    setNewType('Komunitný oznam');
    setNewImportance('normal');
    setNewLocation('Hlohovec – centrum');
    setNewEndDate('');
    setShowAddForm(false);
  };

  const getSourceBadgeColor = (type: AnnouncementType) => {
    switch (type) {
      case 'Oficiálny oznam':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Informácia organizátora':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Komunitný oznam':
        return 'bg-slate-50 text-slate-800 border-slate-200';
      case 'Neoverená informácia':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const currentDetailItem = announcements.find(a => a.id === activeDetailId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Oznamy, odstávky a výluky</h2>
          <p className="text-xs text-slate-500 mt-1">Dôležité mestské výstrahy, odstávky energií, otváracie hodiny a organizačné zmeny na jednom mieste.</p>
        </div>

        {currentUser.role !== 'visitor' && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setActiveDetailId(null);
            }}
            className="bg-wine-700 text-white hover:bg-wine-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Zavrieť formulár' : 'Publikovať oznam'}</span>
          </button>
        )}
      </div>

      {/* RENDER SPECIFIC ANNOUNCEMENT DETAIL VIEW (If clicked) */}
      {activeDetailId && currentDetailItem ? (
        <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-3xl border border-[#E8DED2] shadow-xl animate-in zoom-in-95 duration-200 text-xs">
          
          <button 
            onClick={() => {
              setActiveDetailId(null);
              if (setSelectedAnnId) setSelectedAnnId(null);
            }}
            className="text-slate-500 hover:text-slate-800 font-bold mb-4 flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-lg w-max"
          >
            <ChevronLeft size={16} />
            <span>Späť na zoznam oznamov</span>
          </button>

          <div className="space-y-4">
            
            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${getSourceBadgeColor(currentDetailItem.type)}`}>
                {currentDetailItem.type}
              </span>
              <span className="bg-wine-50 text-wine-900 font-bold px-2 py-0.5 rounded border border-wine-100 text-[10px]">
                {currentDetailItem.category}
              </span>
              {currentDetailItem.importance === 'urgent' && (
                <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse flex items-center gap-0.5">
                  <AlertTriangle size={10} />
                  <span>URGENTNÉ</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl font-serif font-extrabold text-slate-900 leading-tight">
              {currentDetailItem.title}
            </h3>

            {/* Author info & Location dates */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-600 border border-slate-200/50">
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold uppercase text-[9px]">Uverejnil</span>
                <span className="font-bold text-slate-800">{currentDetailItem.authorName}</span>
              </div>
              <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                <span className="text-slate-400 block font-semibold uppercase text-[9px]">Miesto dopadu</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin size={11} />
                  <span>{currentDetailItem.location}</span>
                </span>
              </div>
              <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
                <span className="text-slate-400 block font-semibold uppercase text-[9px]">Platnosť informácie</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Clock size={11} />
                  <span>Do {currentDetailItem.endDate || 'odvolania'}</span>
                </span>
              </div>
            </div>

            {currentDetailItem.officialUrl && (
              <div className="bg-blue-50 border border-blue-250 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-800">
                <div className="flex items-center gap-2">
                  <Megaphone size={16} className="text-blue-600 shrink-0" />
                  <div>
                    <span className="font-bold">Oficiálny zdroj informácie</span>
                    <p className="text-[11px] text-blue-600 font-normal">Tento oznam bol uverejnený priamo na stránkach mesta Hlohovec.</p>
                  </div>
                </div>
                <a 
                  href={currentDetailItem.officialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-650 hover:bg-blue-750 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shrink-0 transition-all text-[11px]"
                >
                  Otvoriť hlohovec.sk ↗
                </a>
              </div>
            )}

            {/* Full text markup container */}
            <div className="text-slate-800 text-xs md:text-sm leading-relaxed pt-4 space-y-4 font-normal max-w-none prose prose-slate">
              {currentDetailItem.fullText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Share action ribbon */}
            <div className="pt-6 border-t flex flex-wrap gap-4 items-center justify-between text-xs text-slate-400">
              <span>Zverejnené dňa: {new Date(currentDetailItem.createdAt).toLocaleString()}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Odkaz na oznam bol skopírovaný do schránky!');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded"
              >
                Kopírovať odkaz a zdieľať 🔗
              </button>
            </div>

          </div>

        </div>
      ) : (
        <>
          {/* OZNAM COMPREHENSIVE SUBMIT FORM */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-2xl border-2 border-wine-150 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-250">
              <div className="flex items-center gap-2 text-wine-900 font-serif font-bold text-lg border-b pb-3">
                <Megaphone size={20} className="text-wine-800" />
                <h3>Uverejniť správu alebo hlásenie</h3>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                
                <div className="md:col-span-8 space-y-1">
                  <label className="font-semibold text-slate-700 block">Názov oznamu / Hlavička:</label>
                  <input 
                    type="text" 
                    required
                    placeholder="napr. Havarijná porucha vodovodu na lúke pod Sihotiou"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="font-semibold text-slate-700 block">Kategória:</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value as AnnouncementCategory)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700 bg-white"
                  >
                    {categories.filter(c => c !== 'Všetky').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-12 space-y-1">
                  <label className="font-semibold text-slate-700 block">Stručné zhrnutie (Pre zoznamy):</label>
                  <input 
                    type="text" 
                    placeholder="Bezpečnostná výstraha, dopravné zápchy alebo technické obmedzenia v krátkosti..."
                    value={newShortDesc}
                    onChange={(e) => setNewShortDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                  />
                </div>

                <div className="md:col-span-12 space-y-1">
                  <label className="font-semibold text-slate-700 block">Kompletný text oznámenia:</label>
                  <textarea 
                    rows={6}
                    required
                    placeholder="Uveďte harmonogram výpadkov, náhradné spoje, dotknuté činžiaky či presné inštrukcie pre obyvateľov..."
                    value={newFullText}
                    onChange={(e) => setNewFullText(e.target.value)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="font-semibold text-slate-700 block">Dopad na lokalitu:</label>
                  <select 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700 bg-white"
                  >
                    <option value="Hlohovec – centrum">Hlohovec – centrum</option>
                    <option value="Sihoť">Sihoť</option>
                    <option value="Nová štvrť">Nová štvrť</option>
                    <option value="Peter">Peter</option>
                    <option value="Šulekovo">Šulekovo</option>
                    <option value="Leopoldov">Leopoldov</option>
                    <option value="Červeník">Červeník</option>
                    <option value="Okolie Hlohovca">Okolie Hlohovca</option>
                  </select>
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="font-semibold text-slate-700 block">Predpokladaný koniec platnosti:</label>
                  <input 
                    type="date" 
                    placeholder="YYYY-MM-DD"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="font-semibold text-slate-700 block">Úroveň dôležitosti:</label>
                  <select 
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as AnnouncementImportance)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700 bg-white"
                  >
                    <option value="normal">Bežný komunikačný oznam</option>
                    <option value="urgent">⚠️ Urgentný (odstávka / ohrozenie)</option>
                  </select>
                </div>

                <div className="md:col-span-12 pt-3 border-t flex justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg"
                  >
                    Zrušiť
                  </button>
                  <button 
                    type="submit" 
                    className="bg-wine-700 hover:bg-wine-800 text-white font-bold px-6 py-2 rounded-lg"
                  >
                    Zverejniť správu
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* SEARCH & FILTERS CONTROLS */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4 text-xs">
            
            <div className="relative">
              <Search size={16} className="absolute top-3.5 left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Vyhľadať dôležitú výstrahu, havárie vody / elektriny..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500 text-[11px] shrink-0">Typ zdroja:</span>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1 rounded-full text-[10px] whitespace-nowrap font-semibold border ${
                      activeType === t 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 border-t pt-3 overflow-x-auto pb-1 max-w-full">
              <span className="font-semibold text-slate-505 text-slate-500 text-[11px] shrink-0">Sekcia:</span>
              <div className="flex gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[10px] whitespace-nowrap transition-colors font-medium ${
                      activeCategory === cat 
                        ? 'bg-wine-50 text-wine-900 font-bold border border-wine-200' 
                        : 'bg-[#FAF7F2] hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RESULT CARD ARRAY */}
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border space-y-3">
              <span className="text-3xl">📢</span>
              <h3 className="font-serif font-bold text-lg text-slate-800">Nenašli sa žiadne oznamy</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Skúste preladiť filtre alebo prečítať historický archív mesta Hlohovec.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAnnouncements.map(ann => {
                const isUrgent = ann.importance === 'urgent';
                return (
                  <div 
                    key={ann.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border flex flex-col justify-between ${
                      isUrgent ? 'border-amber-300 ring-1 ring-amber-200/30 bg-amber-50/10' : 'border-slate-200/90'
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      
                      <div className="flex justify-between items-center text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded uppercase font-bold text-[8px] border ${getSourceBadgeColor(ann.type)}`}>
                            {ann.type}
                          </span>
                          {ann.officialUrl && (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shrink-0 flex items-center gap-0.5">
                              <span className="relative top-px block w-1 h-1 rounded-full bg-emerald-500"></span>
                              <span>hlohovec.sk</span>
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 font-mono">{ann.startDate}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-wine-800 font-bold tracking-wider uppercase block">{ann.category}</span>
                        <h3 className="font-serif font-bold text-base text-slate-900 leading-snug line-clamp-2">
                          {ann.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-505 text-slate-500 leading-relaxed line-clamp-3">
                        {ann.shortDesc}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2">
                        <span className="inline-flex items-center gap-1">📍 {ann.location}</span>
                        <span>Autor: {ann.authorName}</span>
                      </div>

                    </div>

                    <div className="px-6 py-3 border-t bg-slate-50/50 flex align-middle justify-between">
                      {isUrgent ? (
                        <div className="text-[9px] text-amber-700 font-bold flex items-center gap-1 shrink-0 animate-pulse">
                          <span>⚠️ POZOR: AKTÍVNY VÝPADOK</span>
                        </div>
                      ) : (
                        <div className="text-[9px] text-slate-400 font-semibold flex items-center shrink-0">
                          <span>ℹ️ Informatívny oznam</span>
                        </div>
                      )}

                      <button 
                        onClick={() => {
                          setActiveDetailId(ann.id);
                          if (setSelectedAnnId) setSelectedAnnId(ann.id);
                        }}
                        className="text-wine-800 hover:text-wine-900 font-bold text-xs flex items-center gap-0.5"
                      >
                        <span>Čítať celý oznam</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

    </div>
  );
};
