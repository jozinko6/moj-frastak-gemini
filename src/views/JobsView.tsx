/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  ChevronRight, 
  Info, 
  FileText, 
  Send,
  Building2,
  CheckCircle,
  FileDown
} from 'lucide-react';
import { JobOffer } from '../types';

type JobCategory = string;

interface JobsViewProps {
  setView: (view: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ setView }) => {
  const { jobOffers, currentUser, addJobOffer } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Všetky');
  const [activeType, setActiveType] = useState<string>('Všetky');
  const [minSalary, setMinSalary] = useState<number>(0);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  // Quick Application Form state
  const [showApplyModal, setShowApplyModal] = useState<JobOffer | null>(null);
  const [applicantName, setApplicantName] = useState(currentUser.name);
  const [applicantEmail, setApplicantEmail] = useState(currentUser.email);
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantIntro, setApplicantIntro] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // New Job Creation states
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReq, setJobReq] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobCat, setJobCat] = useState<JobCategory>('Gastronómia');
  const [jobType, setJobType] = useState<'Trvalý pomer' | 'Skrátený úväzok' | 'Brigáda' | 'Živnosť'>('Trvalý pomer');
  const [jobSalary, setJobSalary] = useState(1200);
  const [jobLoc, setJobLoc] = useState('Hlohovec');
  const [jobEmail, setJobEmail] = useState('');

  const categories = [
    'Všetky',
    'Administratíva',
    'Gastronómia',
    'Výroba a priemysel',
    'Služby a obchod',
    'IT a technológie',
    'Vzdelávanie a kultúra',
    'Doprava a logistika',
    'Stavebníctvo',
    'Záhradníctvo a poľnohospodárstvo',
    'Ostatné obory'
  ];

  const types = [
    'Všetky',
    'Trvalý pomer',
    'Skrátený úväzok',
    'Brigáda',
    'Živnosť'
  ];

  const filteredJobs = jobOffers.filter(j => {
    if (j.status === 'closed') return false;

    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'Všetky' || j.category === activeCategory;
    const matchesType = activeType === 'Všetky' || j.type === activeType;
    const matchesSalary = j.salaryRange.from >= minSalary;

    return matchesSearch && matchesCategory && matchesType && matchesSalary;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !jobDesc) return;

    addJobOffer({
      title: jobTitle,
      company: jobCompany,
      description: jobDesc,
      requirements: jobReq.split('\n').filter(r => r.trim() !== ''),
      benefits: jobBenefits.split('\n').filter(b => b.trim() !== ''),
      category: jobCat,
      type: jobType,
      location: jobLoc,
      salaryRange: {
        from: jobSalary,
        to: jobSalary + 300,
        currency: 'EUR'
      },
      verifiedCompany: currentUser.role === 'organization',
      contactEmail: jobEmail || currentUser.email
    });

    // Reset Form
    setJobTitle('');
    setJobCompany('');
    setJobDesc('');
    setJobReq('');
    setJobBenefits('');
    setJobEmail('');
    setShowAddForm(false);
    alert('Pracovná ponuka bola úspešne pridaná na lokálnu vývesku kariéry!');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setShowApplyModal(null);
      setApplicantIntro('');
      setApplicantPhone('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* HEADER ACTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Kariérna burza Hlohovca</h2>
          <p className="text-xs text-slate-500 mt-1">Hľadajte voľné pracovné miesta, brigády pre študentov a remeselné práce priamo vo vašom najbližšom okolí.</p>
        </div>

        {currentUser.role !== 'visitor' && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedJob(null);
            }}
            className="bg-wine-700 hover:bg-wine-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Zavrieť inzerát' : 'Zverejniť voľné miesto'}</span>
          </button>
        )}
      </div>

      {/* 1. ADD NEW VACANCY FORM PANEL */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-wine-150 shadow-xl space-y-4 max-w-3xl mx-auto animate-in slide-in-from-top-4 duration-250 text-xs">
          <div className="flex items-center gap-2 text-wine-900 font-serif font-bold text-lg border-b pb-3">
            <Briefcase size={20} className="text-wine-800" />
            <h3>Pridať pracovnú ponuku / brigádu</h3>
          </div>

          <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-8 space-y-1">
              <label className="font-semibold text-slate-705 block">Názov pozície:</label>
              <input type="text" required placeholder="napr. Samostatný kuchár pre pizzériu" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-wine-500 text-xs text-slate-700" />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="font-semibold text-slate-705 block">Zamestnávateľ (Firma):</label>
              <input type="text" required placeholder="napr. Gastro Fraštak s.r.o." value={jobCompany} onChange={(e) => setJobCompany(e.target.value)} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-wine-500 text-xs text-slate-700" />
            </div>

            <div className="md:col-span-12 space-y-1">
              <label className="font-semibold text-slate-705 block">Náplň práce a denné povinnosti:</label>
              <textarea rows={4} required placeholder="Popíšte čo bude zamestnanec robiť, aká je zmena, podmienky..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} className="w-full p-2.5 rounded-lg border focus:ring-1 focus:ring-wine-500 text-xs text-slate-700" />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-705 block">Požiadavky na uchádzača (Jedna požiadavka na riadok):</label>
              <textarea rows={3} placeholder="napr. Prax v odbore 2 roky&#10;Hygienické minimum&#10;Zájem učiť sa nové veci" value={jobReq} onChange={(e) => setJobReq(e.target.value)} className="w-full p-2 rounded border focus:outline-none" />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-705 block">Čo ponúkate - Benefity a výhody (Jeden benefit na riadok):</label>
              <textarea rows={3} placeholder="napr. Príspevok na stravu&#10;Víkendové bonusy&#10;Priateľský kolektív" value={jobBenefits} onChange={(e) => setJobBenefits(e.target.value)} className="w-full p-2 rounded border focus:outline-none" />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="font-semibold text-slate-705 block">Kategória:</label>
              <select value={jobCat} onChange={(e) => setJobCat(e.target.value as JobCategory)} className="w-full p-2.5 rounded-lg border bg-white focus:outline-none text-slate-700">
                {categories.filter(c => c !== 'Všetky').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="font-semibold text-slate-705 block">Forma spolupráce:</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value as any)} className="w-full p-2.5 rounded-lg border bg-white focus:outline-none text-slate-700">
                <option value="Trvalý pomer">Trvalý pomer</option>
                <option value="Skrátený úväzok">Skrátený úväzok</option>
                <option value="Brigáda">Brigáda</option>
                <option value="Živnosť">Živnosť</option>
              </select>
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="font-semibold text-slate-705 block">Nástupný plat Brutto (€):</label>
              <input type="number" min="500" value={jobSalary} onChange={(e) => setJobSalary(parseInt(e.target.value) || 0)} className="w-full p-2.5 rounded-lg border text-xs" />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-705 block">Miesto výkonu práce:</label>
              <input type="text" value={jobLoc} onChange={(e) => setJobLoc(e.target.value)} className="w-full p-2.5 rounded-lg border text-xs" />
            </div>

            <div className="md:col-span-6 space-y-1">
              <label className="font-semibold text-slate-705 block">E-mail pre zasielanie CV:</label>
              <input type="email" placeholder="vasa@firma.sk" value={jobEmail} onChange={(e) => setJobEmail(e.target.value)} className="w-full p-2.5 rounded-lg border text-xs text-slate-700" />
            </div>

            <div className="md:col-span-12 pt-3 border-t flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-705 px-4 py-2 rounded-lg font-bold">Zrušiť</button>
              <button type="submit" className="bg-wine-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-wine-805 hover:bg-wine-800">Uverejniť ponuku</button>
            </div>

          </form>
        </div>
      )}

      {/* 2. MAIN VACANCIES FEED VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
        
        {/* Left Side: Filter tools */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            <h3 className="font-serif font-bold text-slate-900 border-b pb-2 text-xs uppercase tracking-wide">Vyhľadávanie</h3>
            <div className="relative text-xs">
              <Search size={14} className="absolute top-2.5 left-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Názov, firma, popis..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] rounded-lg focus:outline-none"
              />
            </div>

            {/* Salary slider filter */}
            <div className="space-y-1 border-t pt-3">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>Minimálny plat</span>
                <span>{minSalary > 0 ? `${minSalary} €` : 'Nezáleží'}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="100"
                value={minSalary} 
                onChange={(e) => setMinSalary(parseInt(e.target.value))} 
                className="w-full accent-wine-700"
              />
            </div>

            {/* Type Category filters */}
            <div className="space-y-1 border-t pt-3">
              <span className="font-semibold text-slate-500 text-[10px] uppercase block">Druh pomeru:</span>
              <div className="space-y-1 pt-1">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`w-full text-left p-1.5 rounded text-[11px] font-semibold transition-colors ${
                      activeType === t ? 'bg-[#7A263A]/10 text-wine-900 font-bold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Categories */}
            <div className="space-y-1 border-t pt-3">
              <span className="font-semibold text-slate-500 text-[10px] uppercase block">Odbor:</span>
              <div className="space-y-1 pt-1 max-h-56 overflow-y-auto scrollbar-thin">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left p-1 rounded text-[10px] font-semibold transition-colors truncate block ${
                      activeCategory === cat ? 'bg-[#7A263A]/10 text-wine-900 font-bold' : 'hover:bg-[#FAF7F2] text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-xl border leading-relaxed text-[10px] text-slate-500 space-y-2">
            <span className="font-bold text-slate-800 block">ℹ️ Pre zamestnávateľov:</span>
            <p>Hľadáte lokálne posily, pomocníkov alebo čašníkov v okrese? Aktivujte si firemný účet s balíčkom "Partner" a zverejňujte ponuky neobmedzene pre všetkých obyvateľov mesta Hlohovec.</p>
          </div>
        </div>

        {/* Right Side: Vacancies Array Grid */}
        <div className="lg:col-span-9 space-y-4">
          
          {filteredJobs.length === 0 ? (
            <div className="bg-white py-12 rounded-2xl border text-center text-slate-400">Žiadne inzerované pozície nezodpovedajú vašim filtrom.</div>
          ) : (
            filteredJobs.map(job => (
              <div 
                key={job.id} 
                className="bg-white rounded-2xl p-5 border shadow-sm hover:border-wine-200 transition-all space-y-4"
              >
                
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-wine-50 text-wine-900 border border-wine-150 text-[9px] font-extrabold px-2 py-0.2 rounded uppercase">{job.category}</span>
                      <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.2 rounded">{job.type}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-slate-905 text-slate-900 pt-1 leading-snug">
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-0.5 text-slate-650 font-bold">
                        <Building2 size={12} className="text-slate-400" />
                        <span>{job.company}</span>
                      </span>
                      {job.verifiedCompany && (
                        <span className="text-blue-600 flex items-center gap-0.5 text-[9px] font-bold">
                          <CheckCircle size={10} />
                          <span>Mestský partner</span>
                        </span>
                      )}
                      <span>📍 {job.location}</span>
                    </div>
                  </div>

                  {/* Salary block indicator */}
                  <div className="bg-emerald-50 text-emerald-800 font-extrabold text-sm border border-emerald-200 p-2 rounded-xl text-center shrink-0 min-w-[100px]">
                    <span className="block text-[8px] uppercase tracking-wider text-emerald-600/70 leading-none">Mesačný plat</span>
                    <span className="block mt-1">{job.salaryRange.from} - {job.salaryRange.to} {job.salaryRange.currency}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-505 text-slate-500 leading-relaxed font-normal">{job.description}</p>

                {/* Requirements / Benefits inline display if clicked or previews */}
                <div className="p-3 bg-slate-50/70 rounded-xl border text-[11px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 border-r">
                    <span className="font-bold text-slate-800 text-[10px] block">📌 Očakávané požiadavky:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#334155]/90">
                      {job.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-[10px] block">🎁 Zamestnanecké benefity:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[#334155]/90">
                      {job.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="flex justify-between items-center pt-2 text-[11px]">
                  <span className="text-slate-400">Pridané dňa: {new Date(job.createdAt).toLocaleDateString()}</span>
                  
                  {currentUser.role !== 'visitor' ? (
                    <button 
                      onClick={() => setShowApplyModal(job)}
                      className="bg-wine-700 hover:bg-wine-800 text-white font-bold py-1.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Send size={12} />
                      <span>Poslať rýchly záujem</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 italic">Pre kontaktovanie sa najskôr prihláste.</span>
                  )}
                </div>

              </div>
            ))
          )}

        </div>

      </div>

      {/* QUICK JOB APPLY MODAL OVERLAY */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border animate-in zoom-in-95 leading-relaxed text-xs">
            
            <div className="flex justify-between items-center border-b pb-3 text-slate-900">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400">Záujem o prácu</span>
                <h4 className="font-serif font-bold text-sm tracking-tight">{showApplyModal.title}</h4>
              </div>
              <button onClick={() => setShowApplyModal(null)} className="text-slate-400 hover:text-slate-600 font-bold bg-[#FAF7F2] p-1 rounded-lg">x</button>
            </div>

            {appliedSuccess ? (
              <div className="py-6 text-center space-y-3">
                <span className="text-3xl text-emerald-500">🎉</span>
                <h4 className="font-serif font-bold text-base text-slate-800">CV a odpoveď úspešne odoslané!</h4>
                <p className="text-[11px] text-slate-400">Simulovaný e-mail so žiadosťou bol zaslaný zamestnávateľovi na adresu {showApplyModal.contactEmail}.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-xs leading-normal">
                
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Meno záujemcu:</label>
                  <input type="text" required value={applicantName} onChange={(e) => setApplicantName(e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Kontaktný e-mail:</label>
                    <input type="email" required value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Telefónne číslo:</label>
                    <input type="text" required placeholder="+421 905..." value={applicantPhone} onChange={(e) => setApplicantPhone(e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Krátky motivačný sprievodný list pre firmu:</label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="Napíšte prečo ste vhodný kandidát, kedy môžete nastúpiť, doplňte predošlú prax..." 
                    value={applicantIntro} 
                    onChange={(e) => setApplicantIntro(e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>

                <div className="p-3 bg-wine-50/50 rounded-xl border text-[10px] text-slate-500 italic space-y-1.5 pt-3">
                  <span className="text-wine-905 text-wine-900 font-bold block">📄 Simulácia priloženia štandardného CV:</span>
                  <p>Informačný systém automaticky priloží Váš predpripravený životopis občana zo systému Môj Fraštak a odošle ho zamestnávateľovi.</p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setShowApplyModal(null)} className="bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-bold">Zrušiť</button>
                  <button type="submit" className="bg-wine-700 hover:bg-wine-805 hover:bg-wine-800 text-white font-bold px-4 py-1.5 rounded-lg">Klopnúť na pracovnú príležitosť ✨</button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
