/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Check, 
  Plus, 
  Sparkles, 
  HeartHandshake, 
  ChevronRight, 
  Info, 
  HelpCircle,
  Award,
  Calendar,
  Layers,
  Search,
  Users
} from 'lucide-react';
import { BusinessCategory, BusinessPackage, Business } from '../types';
import { BUSINESS_PACKAGE_INFO } from '../data/mockData';

interface DirectoryViewProps {
  setView: (view: string) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({ setView }) => {
  const { 
    organizations, 
    businesses, 
    currentUser, 
    addBusiness, 
    updateBusinessPackage, 
    requestVerification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'firmy' | 'organizacie' | 'cennik'>('firmy');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Všetky');

  // New Business registration states
  const [showAddForm, setShowAddForm] = useState(false);
  const [bizName, setBizName] = useState('');
  const [bizDesc, setBizDesc] = useState('');
  const [bizCat, setBizCat] = useState<BusinessCategory>('Reštaurácie a kaviarne');
  const [bizAddress, setBizAddress] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizWeb, setBizWeb] = useState('');
  const [bizHours, setBizHours] = useState('Po - Pia: 08:00 - 17:00');
  const [selectedPlan, setSelectedPlan] = useState<BusinessPackage>('bezplatny');

  // Active detail item overlays
  const [selectedBizDetail, setSelectedBizDetail] = useState<Business | null>(null);

  const businessCategories = [
    'Všetky',
    'Reštaurácie a kaviarne',
    'Obchody',
    'Remeselníci',
    'Autoservisy',
    'Zdravie',
    'Krása',
    'Šport a fitness',
    'Deti a vzdelávanie',
    'Reality',
    'Právne a účtovné služby',
    'Ubytovanie',
    'Doprava',
    'Ostatné služby'
  ];

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'Všetky' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOrgs = organizations.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName || !bizDesc) return;

    addBusiness({
      name: bizName,
      logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&h=150&q=80',
      banner: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=80',
      description: bizDesc,
      category: bizCat,
      address: bizAddress || 'M. R. Štefánika, Hlohovec',
      phone: bizPhone,
      email: bizEmail,
      website: bizWeb,
      openingHours: bizHours,
      services: ['Zákaznícky servis', 'Slovenský jazyk'],
      plan: selectedPlan
    });

    // Reset Form
    setBizName('');
    setBizDesc('');
    setBizAddress('');
    setBizPhone('');
    setBizEmail('');
    setBizWeb('');
    setShowAddForm(false);
    alert('Vás firemný profil bol úspešne založený! Môžete začať uverejňovať akcie a pracovné ponuky.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* 1. TOP NAV MENU FOR SECTIONS */}
      <div className="flex justify-center border-b pb-4">
        <div className="flex bg-[#FAF7F2] p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold gap-1">
          <button 
            onClick={() => { setActiveTab('firmy'); setShowAddForm(false); }}
            className={`px-5 py-2 rounded-xl transition-all ${activeTab === 'firmy' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Katalóg firiem a služieb Hlohovca
          </button>
          <button 
            onClick={() => { setActiveTab('organizacie'); setShowAddForm(false); }}
            className={`px-5 py-2 rounded-xl transition-all ${activeTab === 'organizacie' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Mestské organizácie a spolky (Overené)
          </button>
          <button 
            onClick={() => { setActiveTab('cennik'); setShowAddForm(false); }}
            className={`px-5 py-2 rounded-xl transition-all ${activeTab === 'cennik' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Pre firmy – Cenník a výhody 💎
          </button>
        </div>
      </div>

      {/* 2. SPECIFIC TAB VIEW HANDLER */}
      {activeTab === 'firmy' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Miestne firmy a remeselníci v okolí</h2>
              <p className="text-xs text-slate-500">Nakupujte u susedov, podporujte rodinné kaviarne, remeselníkov a obchody z okresu Hlohovec.</p>
            </div>

            {currentUser.role !== 'visitor' && (
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-wine-700 hover:bg-wine-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow"
              >
                <Plus size={16} />
                <span>{showAddForm ? 'Zavrieť formulár' : 'Zaregistrovať vlastnú prevádzku'}</span>
              </button>
            )}
          </div>

          {showAddForm ? (
            /* ADD BUSINESS FORM PANEL */
            <div className="bg-white p-6 rounded-3xl border-2 border-wine-300 shadow-xl space-y-4 max-w-2xl mx-auto animate-in zoom-in-95 text-xs text-slate-705">
              <h3 className="font-serif font-bold text-base text-wine-905 text-wine-900 border-b pb-2 flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-500" />
                <span>Vytvorte si firemný profil na Môj Fraštak</span>
              </h3>

              <form onSubmit={handleCreateBusiness} className="space-y-3">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Názov prevádzky / firmy:</label>
                    <input type="text" required placeholder="napr. Pekáreň starého otca" value={bizName} onChange={(e) => setBizName(e.target.value)} className="p-2 border rounded w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Kategória obchodu:</label>
                    <select value={bizCat} onChange={(e) => setBizCat(e.target.value as BusinessCategory)} className="p-2 border rounded bg-white w-full">
                      {businessCategories.filter(c => c !== 'Všetky').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold block">Popis podnikania, služieb a výhod:</label>
                  <textarea rows={4} required placeholder="Zoznámte Hlohovčanov s vašimi poctivými službami..." value={bizDesc} onChange={(e) => setBizDesc(e.target.value)} className="p-2 border rounded w-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Adresa v Hlohovci / Leopoldove:</label>
                    <input type="text" placeholder="napr. Námestie sv. Michala 4" value={bizAddress} onChange={(e) => setBizAddress(e.target.value)} className="p-2 border rounded w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Otváracie hodiny:</label>
                    <input type="text" value={bizHours} onChange={(e) => setBizHours(e.target.value)} className="p-2 border rounded w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold block">Telefón:</label>
                    <input type="text" placeholder="+421 905..." value={bizPhone} onChange={(e) => setBizPhone(e.target.value)} className="p-2 border rounded w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">E-mail kontaktu:</label>
                    <input type="email" placeholder="vasa@firma.sk" value={bizEmail} onChange={(e) => setBizEmail(e.target.value)} className="p-2 border rounded w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold block">Webstránka (Voliteľné):</label>
                    <input type="text" placeholder="https://..." value={bizWeb} onChange={(e) => setBizWeb(e.target.value)} className="p-2 border rounded w-full" />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-dashed text-[11px] space-y-2">
                  <span className="font-bold text-slate-800">Vyberte štartovací balíček profilu:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <label className="p-2 bg-white rounded border flex items-center gap-1.5 cursor-pointer hover:bg-slate-50">
                      <input type="radio" checked={selectedPlan === 'bezplatny'} onChange={() => setSelectedPlan('bezplatny')} />
                      <span>Bezplatný (0 €)</span>
                    </label>
                    <label className="p-2 bg-white rounded border flex items-center gap-1.5 cursor-pointer hover:bg-slate-50">
                      <input type="radio" checked={selectedPlan === 'start'} onChange={() => setSelectedPlan('start')} />
                      <span>Štart (9 €)</span>
                    </label>
                    <label className="p-2 bg-white rounded border flex items-center gap-1.5 cursor-pointer hover:bg-slate-50">
                      <input type="radio" checked={selectedPlan === 'lokal'} onChange={() => setSelectedPlan('lokal')} />
                      <span>Lokál (19 €)</span>
                    </label>
                    <label className="p-2 bg-white rounded border flex items-center gap-1.5 cursor-pointer hover:bg-slate-50">
                      <input type="radio" checked={selectedPlan === 'partner'} onChange={() => setSelectedPlan('partner')} />
                      <span>Partner (39 €)</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg">Zrušiť</button>
                  <button type="submit" className="bg-wine-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-wine-800">Hotovo, Zaregistrovať</button>
                </div>

              </form>
            </div>
          ) : (
            /* DIRECTORY VIEW CONTENT LIST */
            <div className="space-y-6">
              
              {/* Filters */}
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full text-xs">
                  <Search size={16} className="absolute top-3 left-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Vyhľadajte remeselníkov, kaderníctva, autoservisy, pizzu..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] rounded-lg focus:outline-none"
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  <span className="font-semibold text-slate-500 text-[10px] shrink-0">Kategória:</span>
                  <select 
                    value={activeCategory} 
                    onChange={(e) => setActiveCategory(e.target.value)} 
                    className="p-1 px-3 border rounded-lg bg-white text-xs text-slate-700 focus:outline-none font-semibold"
                  >
                    {businessCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid of items */}
              {filteredBusinesses.length === 0 ? (
                <div className="bg-white py-12 rounded-2xl border text-center text-slate-400 text-xs">Žiadna prevádzka nevyhovuje aktuálnemu filtru.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBusinesses.map(b => {
                    const isSpon = b.plan === 'partner' || b.plan === 'hlavny';
                    return (
                      <div 
                        key={b.id} 
                        className={`bg-white rounded-2xl overflow-hidden border transform hover:-translate-y-0.5 transition-all shadow-sm h-full flex flex-col justify-between ${
                          isSpon ? 'border-amber-300 ring-1 ring-amber-300/35 bg-amber-50/5' : 'border-slate-200'
                        }`}
                      >
                        
                        <div>
                          {/* Banner & Tier badges */}
                          <div className="h-28 bg-slate-150 relative">
                            <img src={b.banner} alt={b.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              <span className="bg-wine-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">{b.category}</span>
                              {b.verified && (
                                <span className="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                                  <Check size={10} />
                                  <span>Overené</span>
                                </span>
                              )}
                            </div>
                            
                            {/* Logo */}
                            <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-xl border bg-white shadow overflow-hidden flex items-center justify-center">
                              <img src={b.logo} alt={b.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>

                          {/* Info area */}
                          <div className="px-6 pt-8 pb-4 space-y-2">
                            <h3 className="font-serif font-bold text-base text-slate-900 leading-snug flex items-center gap-1">
                              <span>{b.name}</span>
                              {isSpon && <span className="text-amber-500 text-xs uppercase font-extrabold text-[9px]">Sponzorované</span>}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{b.description}</p>
                          </div>
                        </div>

                        {/* Contacts and actions */}
                        <div className="p-6 pt-2 border-t bg-slate-50/50 space-y-2 text-[11px] text-slate-500">
                          <p className="flex items-center gap-1.5">📍 <span className="truncate">{b.address}</span></p>
                          <p className="flex items-center gap-1.5">📞 <span>{b.phone}</span></p>
                          <p className="flex items-center gap-1.5">⏰ <span>{b.openingHours}</span></p>
                          
                          <button 
                            onClick={() => setSelectedBizDetail(b)}
                            className="w-full mt-3 bg-white hover:bg-slate-100 border text-slate-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                          >
                            <span>Zobraziť kompletný kontakt a akcie</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* COMPACT MODIFIED ORGANIZATIONS TAB */}
      {activeTab === 'organizacie' && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-serif font-bold text-slate-905 text-slate-900">Overené mestské organizácie, tímy a spolky</h2>
            <p className="text-xs text-slate-500 mt-1">Sledujte overených prispievateľov, s ktorými mesto Hlohovec aktívne komunikuje, spolurozhoduje a schvaľuje spoločné aktivity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrgs.map(org => (
              <div key={org.id} className="bg-white rounded-3xl p-6 border border-slate-205 shadow-sm space-y-4 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border">
                      <img src={org.logo} alt={org.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-slate-900 leading-snug flex items-center gap-1">
                        <span>{org.name}</span>
                        {org.verified && <CheckCircle2 size={15} className="text-blue-600 fill-blue-50" />}
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono uppercase font-semibold block mt-1 w-max">
                        {org.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-650 text-slate-600 leading-relaxed font-normal">{org.description}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border text-[11px] text-slate-600 space-y-1.5 pt-3">
                  <p>📍 {org.address}</p>
                  <p>📞 {org.contact}</p>
                  {org.website && <p>🌐 <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-wine-800 hover:underline">{org.website}</a></p>}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRE FIRMY AND MONETIZATION MATRIX DISPLAY */}
      {activeTab === 'cennik' && (
        <div className="space-y-12 py-4">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-serif font-extrabold tracking-tight text-slate-900">
              Zviditeľnite svoju prevádzku medzi ľuďmi z Hlohovca
            </h2>
            
            <p className="text-xs md:text-sm text-slate-505 text-slate-500 leading-relaxed">
              Môj Fraštak spája obyvateľov, udalosti, oznamy a miestne podniky na jednom mieste. Vytvorte si firemný profil, zverejňujte akcie, udalosti a pracovné ponuky a oslovte ľudí, ktorí žijú priamo vo vašom okolí.
            </p>
          </div>

          {/* Pricing bento array */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 align-stretch">
            {BUSINESS_PACKAGE_INFO.map(pkg => (
              <div 
                key={pkg.id} 
                className={`p-6 rounded-3xl border flex flex-col justify-between h-full space-y-6 ${pkg.bgClass}`}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif font-bold text-base leading-none">{pkg.name}</h4>
                    <span className="block text-2xl font-sans font-extrabold mt-3">{pkg.price}</span>
                    <span className="text-[10px] opacity-75">{pkg.period}</span>
                  </div>

                  <ul className="space-y-2 text-[10px] opacity-90 border-t pt-4">
                    {pkg.features.map((f, idx) => (
                      <li key={idx} className="flex gap-1.5 items-start">
                        <Check size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => {
                    setActiveTab('firmy');
                    setShowAddForm(true);
                    setSelectedPlan(pkg.id as any);
                  }}
                  className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-all ${
                    pkg.id === 'lokal' || pkg.id === 'partner'
                      ? 'bg-wine-700 hover:bg-wine-800 text-white shadow-md' 
                      : pkg.id === 'hlavny'
                        ? 'bg-white text-slate-900 hover:bg-slate-100'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Vytvoriť firemný profil
                </button>

              </div>
            ))}
          </div>

          {/* FAQ list */}
          <div className="max-w-3xl mx-auto space-y-4 bg-white p-6 rounded-2xl border shadow-sm text-xs">
            <h4 className="font-serif font-bold text-slate-900 text-base border-b pb-2 flex items-center gap-1">
              <HelpCircle size={16} className="text-wine-805 text-wine-800" />
              <span>Najčastejšie otázky pre podnikateľov:</span>
            </h4>
            <div className="space-y-3 leading-relaxed text-slate-700 text-[11px]">
              <div>
                <p className="font-bold text-slate-800">Ako funguje aktivácia balíčka?</p>
                <p className="opacity-80">Rýchle zaklicnutie urobíte vy sami v profile. Balíčky Štart, Lokál či Partner aktivuje administrátor manuálne ihneď po schválení úhrady prevodom na účet alebo faktúrou, čím držíme maximálnu bezpečnosť.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">Môžem pod profilom firmy uverejňovať inzeráty práce?</p>
                <p className="opacity-80">Áno! Balíček Partner a Hlavný partner má k dispozícii samostatný zverejňovací panel pre lokálne kariérne sťažnosti bez dodatočného poplatku.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. INDIVIDUAL BUSINESS PROFILE DETAILED POPUP OVERLAY */}
      {selectedBizDetail && (
        <div className="fixed inset-0 bg-[#1F2933]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-xs leading-relaxed border animate-in zoom-in-95">
            
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-slate-900 text-base">{selectedBizDetail.name}</h3>
              <button onClick={() => setSelectedBizDetail(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold bg-[#FAF7F2] p-1.5 rounded-lg">[Zatvoriť x]</button>
            </div>

            <div className="space-y-4">
              <div className="h-36 bg-slate-100 rounded-xl overflow-hidden border">
                <img src={selectedBizDetail.banner} alt={selectedBizDetail.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] bg-wine-50 text-wine-900 font-bold px-2 py-0.5 rounded border border-wine-150">{selectedBizDetail.category}</span>
                <p className="text-slate-850 text-slate-700">{selectedBizDetail.description}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border space-y-2 text-[11px]">
                <p className="font-semibold text-slate-800 border-b pb-1">Kontaktné a prevádzkové informácie s.r.o.</p>
                <p>📍 <strong>Adresa:</strong> {selectedBizDetail.address}</p>
                {selectedBizDetail.phone && <p>📞 <strong>Telefón:</strong> {selectedBizDetail.phone}</p>}
                {selectedBizDetail.email && <p>✉️ <strong>E-mail:</strong> {selectedBizDetail.email}</p>}
                {selectedBizDetail.website && <p>🌐 <strong>Web:</strong> <a href={selectedBizDetail.website} target="_blank" rel="noopener noreferrer" className="text-wine-800 hover:underline">{selectedBizDetail.website}</a></p>}
                <p>⏰ <strong>Otváracie hodiny:</strong> {selectedBizDetail.openingHours}</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <span className="font-semibold text-slate-800">Poskytované služby a vlastnosti:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedBizDetail.services.map((ser, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                      {ser}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
