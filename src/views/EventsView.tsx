/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Filter, 
  Search, 
  Plus, 
  DollarSign, 
  User, 
  Clock, 
  Compass, 
  Heart, 
  Check, 
  ChevronRight,
  Info 
} from 'lucide-react';
import { EventCategory, Event } from '../types';

interface EventsViewProps {
  setView: (view: string) => void;
  setSelectedEventId: (id: string | null) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ setView, setSelectedEventId }) => {
  const { events, currentUser, addEvent, toggleEventRSVP } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Všetky');
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [filterDateTag, setFilterDateTag] = useState<string>('vsetko'); // 'dnes', 'vikend', 'vsetko'
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newLongDesc, setNewLongDesc] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('Kultúra');
  const [newDate, setNewDate] = useState('2026-06-20');
  const [newTime, setNewTime] = useState('18:00');
  const [newLocation, setNewLocation] = useState('Hlohovec – centrum');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState('0');
  const [newContact, setNewContact] = useState('');
  const [newRegUrl, setNewRegUrl] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80');

  const categories: string[] = [
    'Všetky',
    'Kultúra',
    'Šport',
    'Deti a rodiny',
    'Seniori',
    'Vzdelávanie',
    'Hudba',
    'Trhy',
    'Dobrovoľníctvo',
    'Mesto',
    'Komunita',
    'Gastronómia',
    'Iné'
  ];

  // Filters calculation
  const filteredEvents = events.filter(e => {
    if (e.status === 'hidden' || e.status === 'draft') return false;

    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'Všetky' || e.category === activeCategory;
    const matchesFree = !filterFreeOnly || e.price === 0 || e.isFree;
    
    let matchesDate = true;
    if (filterDateTag === 'dnes') {
      matchesDate = e.startDate === '2026-06-18';
    } else if (filterDateTag === 'vikend') {
      matchesDate = e.startDate === '2026-06-20' || e.startDate === '2026-06-21';
    }

    return matchesSearch && matchesCategory && matchesFree && matchesDate;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newShortDesc) return;

    const priceNum = parseFloat(newPrice) || 0;

    addEvent({
      title: newTitle,
      shortDesc: newShortDesc,
      longDesc: newLongDesc || newShortDesc,
      category: newCategory,
      startDate: newDate,
      startTime: newTime,
      location: newLocation,
      address: newAddress || 'Zámok Hlohovec, 920 01',
      coordinates: { x: 50, y: 50 },
      image: newImage,
      organizerId: currentUser.id,
      organizerType: 'user',
      price: priceNum,
      isFree: priceNum === 0,
      contact: newContact || currentUser.email,
      regUrl: newRegUrl,
      status: 'published'
    });

    // Reset Form
    setNewTitle('');
    setNewShortDesc('');
    setNewLongDesc('');
    setNewCategory('Kultúra');
    setNewDate('2026-06-20');
    setNewTime('18:00');
    setNewPrice('0');
    setNewAddress('');
    setNewContact('');
    setNewRegUrl('');
    setShowAddForm(false);
  };

  const getDayFormat = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    return { day, month };
  };

  const navigateToDetail = (id: string) => {
    setSelectedEventId(id);
    setView('detail_udalosti');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* 1. VIEW HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Mestský kalendár podujatí</h2>
          <p className="text-xs text-slate-500 mt-1">Spoznajte koncerty, jarmoky, zápasy, behy a rodinné aktivity priamo vo vašom susedstve.</p>
        </div>

        {currentUser.role !== 'visitor' && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-wine-700 text-white hover:bg-wine-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-wine-700/10 active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Zatvoriť formulár' : 'Usporiadať udalosť'}</span>
          </button>
        )}
      </div>

      {/* 2. ADD EVENT FORM MODAL / COLLAPSED BLOCK */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-wine-150 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-250">
          <div className="flex items-center gap-2 text-wine-900 font-serif font-bold text-lg border-b pb-3">
            <Calendar size={20} className="text-wine-800" />
            <h3>Usporiadajte novú udalosť v Hlohovci</h3>
          </div>

          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
            
            <div className="md:col-span-8 space-y-1">
              <label className="font-semibold text-slate-700 block">Názov udalosti:</label>
              <input 
                type="text" 
                required
                placeholder="napr. Otvorený turnaj v plážovom volejbale na Sihoti"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="font-semibold text-slate-700 block">Kategória:</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700 bg-white"
              >
                {categories.filter(c => c !== 'Všetky').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-12 space-y-1">
              <label className="font-semibold text-slate-700 block">Stručný opis (Zobrazovaný na karte):</label>
              <input 
                type="text" 
                required
                maxLength={160}
                placeholder="napr. Príjemný turnaj pre amatérske aj poloprofesionálne zmiešané tímy..."
                value={newShortDesc}
                onChange={(e) => setNewShortDesc(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-12 space-y-1">
              <label className="font-semibold text-slate-700 block">Podrobný opis, program a bližšie pokyny:</label>
              <textarea 
                rows={4}
                placeholder="Napíšte kedy, kde, s kým, či treba výstroj, odkaz na registráciu, propozície ceny a podrobné pravidlá..."
                value={newLongDesc}
                onChange={(e) => setNewLongDesc(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="font-semibold text-slate-700 block">Dátum začiatku:</label>
              <input 
                type="date" 
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="font-semibold text-slate-700 block">Čas začiatku (24h):</label>
              <input 
                type="text" 
                required
                placeholder="17:00"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="font-semibold text-slate-700 block">Lokalita:</label>
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

            <div className="md:col-span-3 space-y-1">
              <label className="font-semibold text-slate-700 block">Cena lístka (€, 0 = zdarma):</label>
              <input 
                type="number" 
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-700 block">Presná adresa podujatia:</label>
              <input 
                type="text" 
                placeholder="napr. Plážové volejbalové ihrisko ŠKP, Sihoť"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-700 block">URL Titulný obrázok (Nepovinné, link):</label>
              <input 
                type="text" 
                placeholder="Zadajte odkaz na fotografiu..."
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-700 block">Kontaktné údaje pre návštevníkov:</label>
              <input 
                type="text" 
                placeholder="napr. volejbal@slovensko.sk, +421 905..."
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-700 block">Registračný odkaz (Voliteľný kupón/vstupenky):</label>
              <input 
                type="text" 
                placeholder="https://..."
                value={newRegUrl}
                onChange={(e) => setNewRegUrl(e.target.value)}
                className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
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
                Uložiť a publikovať
              </button>
            </div>

          </form>

        </div>
      )}

      {/* 3. FILTERS AREA */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4 text-xs">
        
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute top-3.5 left-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Vyhľadať udalosť podľa názvu, popisu alebo usporiadateľa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
          />
        </div>

        {/* Quick Date Tabs & Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 text-[10px] md:text-xs">
            <button 
              onClick={() => setFilterDateTag('vsetko')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterDateTag === 'vsetko' ? 'bg-[#7A263A] text-white shadow-sm' : 'bg-[#FAF7F2] text-slate-600 hover:bg-slate-100'
              }`}
            >
              Všetky termíny
            </button>
            <button 
              onClick={() => setFilterDateTag('dnes')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterDateTag === 'dnes' ? 'bg-[#7A263A] text-white shadow-sm' : 'bg-[#FAF7F2] text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dnes (18. Jún)
            </button>
            <button 
              onClick={() => setFilterDateTag('vikend')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterDateTag === 'vikend' ? 'bg-[#7A263A] text-white shadow-sm' : 'bg-[#FAF7F2] text-slate-600 hover:bg-slate-100'
              }`}
            >
              Cez víkend
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold text-[11px] select-none">
            <input 
              type="checkbox" 
              checked={filterFreeOnly}
              onChange={(e) => setFilterFreeOnly(e.target.checked)}
              className="rounded text-wine-600 focus:ring-wine-550 focus:ring-0"
            />
            <span>Iba bezplatné podujatia (Zadarmo)</span>
          </label>
        </div>

        {/* Categories Pills */}
        <div className="border-t pt-3 flex items-center gap-2">
          <span className="font-semibold text-[11px] text-slate-500 shrink-0 hidden sm:inline">Kategórie:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] whitespace-nowrap transition-colors border font-medium ${
                  activeCategory === cat 
                    ? 'bg-[#7A263A]/10 text-wine-900 border-[#7A263A]' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 4. EVENTS RESULT LIST/GRID */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border space-y-3">
          <span className="text-3xl">📅</span>
          <h3 className="font-serif font-bold text-lg text-slate-800">Nenašli sa žiadne komunitné podujatia</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Skúste upraviť klávesový vyhľadávač, alebo zvoľte prezeranie všetkých kategórií v meste.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(e => {
            const dateInf = getDayFormat(e.startDate);
            const userIsGoing = e.going.includes(currentUser.id);
            const userIsInterested = e.interested.includes(currentUser.id);

            return (
              <div 
                key={e.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative"
              >
                {/* Image & Price Tag */}
                <div className="h-44 bg-slate-100 relative cursor-pointer" onClick={() => navigateToDetail(e.id)}>
                  <img src={e.image} alt={e.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  {/* Category ribbon & date block */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
                    <div className="bg-[#7A263A] text-white text-[9px] font-bold px-2 py-1 rounded shadow uppercase">
                      {e.category}
                    </div>
                    {e.officialUrl && (
                      <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow uppercase flex items-center gap-1 shrink-0">
                        <span className="w-1 h-1 rounded-full bg-white block"></span>
                        <span>hlohovec.sk</span>
                      </div>
                    )}
                  </div>

                  {/* Calendar Widget Overlay */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center min-w-[45px] shadow-md border">
                    <span className="block text-slate-900 font-extrabold text-sm leading-none">{dateInf.day}</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{dateInf.month}</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                    {e.isFree ? 'Zdravie (Bezplatne)' : `${e.price} €`}
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Title and Short Description */}
                  <div className="space-y-2 cursor-pointer" onClick={() => navigateToDetail(e.id)}>
                    <h3 className="font-serif font-bold text-base text-slate-900 tracking-tight leading-snug hover:text-wine-800 transition-colors">
                      {e.title}
                    </h3>
                    <p className="text-xs text-slate-505 text-slate-500 leading-relaxed line-clamp-3">
                      {e.shortDesc}
                    </p>
                  </div>

                  {/* Details metadata */}
                  <div className="space-y-2 pt-3 border-t text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      <span>{e.startDate} o {e.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-slate-400" />
                      <span className="truncate" title={e.address}>{e.location} ({e.address})</span>
                    </div>
                  </div>

                  {/* Attendance & RSVP Interaction */}
                  {currentUser.role !== 'visitor' ? (
                    <div className="bg-slate-50/75 p-2 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-[10px]">
                      
                      <button 
                        onClick={() => toggleEventRSVP(e.id, 'going')}
                        className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${
                          userIsGoing 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {userIsGoing ? <Check size={11} /> : null}
                        <span>Zúčastním sa ({e.going.length})</span>
                      </button>

                      <button 
                        onClick={() => toggleEventRSVP(e.id, 'interested')}
                        className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors ${
                          userIsInterested 
                            ? 'bg-wine-100 text-wine-900 border border-wine-300' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <Heart size={11} className={userIsInterested ? 'fill-wine-850 text-wine-900' : ''} />
                        <span>Mám záujem ({e.interested.length})</span>
                      </button>

                    </div>
                  ) : (
                    <div className="p-2 bg-slate-50 rounded-lg text-center text-[10px] text-slate-400 border border-dashed">
                      Pre zapojenie a uloženie sa musíte prihlásiť.
                    </div>
                  )}

                  {/* Detail link */}
                  <button 
                    onClick={() => navigateToDetail(e.id)}
                    className="w-full bg-[#FCFAF7] hover:bg-slate-100 border text-slate-700 text-[11px] font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 focus:ring-0"
                  >
                    <span>Zobraziť detailné propozície</span>
                    <ChevronRight size={13} />
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
