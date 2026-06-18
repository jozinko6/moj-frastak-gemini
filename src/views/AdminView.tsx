/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Settings, 
  FileText, 
  Trash2, 
  CheckCircle, 
  UserPlus, 
  Sparkles, 
  Volume2, 
  Bell,
  Clock
} from 'lucide-react';
import { UserRole, User } from '../types';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    auditLogs, 
    reports, 
    events, 
    announcements, 
    discussions, 
    issues,
    hideEntity,
    discardReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'users' | 'settings' | 'audit'>('reports');

  // Simulated Mock Users State
  const [usersList, setUsersList] = useState<User[]>([
    { id: 'usr-1', name: 'Ján Mrkvička', email: 'jan@hlohovec.sk', role: 'registered', bio: '', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', verified: false, createdAt: '2026-06-18', bookmarks: [], followedDiscussions: [], followedEvents: [], registeredOrganizations: [], registeredBusinesses: [] },
    { id: 'usr-2', name: 'Michaela Blahová', email: 'michaela@kc.sk', role: 'organization', bio: 'Kultúrne centrum Hlohovec', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', verified: true, createdAt: '2026-06-18', bookmarks: [], followedDiscussions: [], followedEvents: [], registeredOrganizations: [], registeredBusinesses: [] },
    { id: 'usr-3', name: 'Karol Technik', email: 'karol@sluzbymesta.sk', role: 'moderator', bio: 'Poriadkové a technické služby', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', verified: true, createdAt: '2026-06-18', bookmarks: [], followedDiscussions: [], followedEvents: [], registeredOrganizations: [], registeredBusinesses: [] },
    { id: 'usr-4', name: 'Zuzana Drobná', email: 'zuzana@sused.sk', role: 'registered', bio: '', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', verified: false, createdAt: '2026-06-18', bookmarks: [], followedDiscussions: [], followedEvents: [], registeredOrganizations: [], registeredBusinesses: [] },
  ]);

  // Settings State
  const [townEmail, setTownEmail] = useState('info@hlohovec.sk');
  const [alertBannerActive, setAlertBannerActive] = useState(true);
  const [alertBannerText, setAlertBannerText] = useState('⚠️ UPOZORNENIE: Dňa 19. Júna v čase od 8:00 do 14:00 prebehne plánovaná odstávka elektrickej energie v celej časti Šulekovo.');

  const handleUpdateRole = (id: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    alert(`Rola používateľa bola úspešne zmenená na ${newRole}.`);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Globálne mestské nastavenia boli úspešne uložené.');
  };

  const getEntityTitle = (type: string, id: string) => {
    if (type === 'event') return events.find(e => e.id === id)?.title || 'Udalosť';
    if (type === 'discussion') return discussions.find(d => d.id === id)?.title || 'Diskusná téma / komentár';
    if (type === 'announcement') return announcements.find(a => a.id === id)?.title || 'Oznam';
    if (type === 'issue') return issues.find(i => i.id === id)?.title || 'Občiansky podnet';
    return 'Obsah';
  };

  if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4 text-xs">
        <AlertTriangle size={40} className="text-red-600 mx-auto" />
        <h3 className="font-serif font-bold text-lg text-slate-900">Prístup zamietnutý ⚠️</h3>
        <p className="text-slate-500">Táto sekcia je chránená a slúži výlučne pre administrátorov alebo koordinátorov mestskej časti Hlohovec. Zmeňte si prosím simulovanú rolu na paneli v hlavičke na Admina alebo Moderátora.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* HEADER ROW */}
      <div className="border-b pb-6 space-y-1">
        <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-1.5 tracking-tight">
          <Shield size={28} className="text-wine-700" />
          <span>Riadiaca centrála obce</span>
        </h2>
        <p className="text-xs text-slate-500">Moderácia obyvateľov, kontrola nahláseného spamu, editovanie núdzových hlásení a sledovanie audit záznamov mesta Hlohovec.</p>
      </div>

      {/* ADMIN LEVEL SUB NAV */}
      <div className="flex bg-[#FAF7F2] p-1.5 rounded-2xl border border-slate-205 text-xs font-semibold gap-1 w-max">
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1 ${activeTab === 'reports' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'}`}
        >
          <AlertTriangle size={14} />
          <span>Závesné nahlásenia spamu ({reports.length})</span>
        </button>

        <button 
          onClick={() => setActiveTab('users')}
          className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1 ${activeTab === 'users' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'}`}
        >
          <Users size={14} />
          <span>Používatelia a správa rolí</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1 ${activeTab === 'settings' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'}`}
        >
          <Settings size={14} />
          <span>Mestské krízové správy</span>
        </button>

        <button 
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1 ${activeTab === 'audit' ? 'bg-wine-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-950'}`}
        >
          <FileText size={14} />
          <span>Denník audit logs</span>
        </button>
      </div>

      {/* COMPONENT ACCORDING TO THE ACTIVE TAB SELECTION */}
      
      {/* TAB A: OFFENSIVE REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-xs">
          <h3 className="font-serif font-bold text-slate-900 border-b pb-2 text-sm flex items-center gap-1.5 uppercase tracking-wide">
            <span>🔴 Nahlášené urážky, vulgarizmy a spam od susedov</span>
          </h3>

          {reports.length === 0 ? (
            <div className="bg-slate-50 p-12 rounded-2xl text-center text-slate-400">Momentálne nečakajú žiadne občianske nahlásenia. Komunita komunikuje v mezích slušnosti.</div>
          ) : (
            <div className="overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-3">Uhlika / Typ</th>
                    <th className="p-3">Dotknutý názov príspevku</th>
                    <th className="p-3">Dôvod nahlásenia</th>
                    <th className="p-3">Poznámka sťažovateľa</th>
                    <th className="p-3 text-right">Moderácia</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {reports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-wine-900 uppercase">{rep.entityType}</td>
                      <td className="p-3 font-bold text-slate-800">{getEntityTitle(rep.entityType, rep.entityId)}</td>
                      <td className="p-3"><span className="bg-red-50 text-red-800 border-red-200 border px-2 py-0.5 rounded font-extrabold text-[10px]">{rep.reason}</span></td>
                      <td className="p-3 leading-relaxed italic text-slate-500">"{rep.note}"</td>
                      <td className="p-3 text-right space-x-2 shrink-0">
                        <button 
                          onClick={() => discardReport(rep.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1.5 rounded text-[10px]"
                        >
                          Zamietnuť nahlásenie (Slušné)
                        </button>
                        <button 
                          onClick={() => hideEntity(rep.entityType, rep.entityId, rep.id)}
                          className="bg-red-700 hover:bg-red-800 text-white font-bold p-1.5 rounded text-[10px]"
                        >
                          Skryť / Vymazať príspevok
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB B: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-xs">
          <h3 className="font-serif font-bold text-slate-905 text-slate-900 border-b pb-2 text-sm flex items-center gap-1.5 uppercase tracking-wide">
            <span>👥 Správa obyvateľov a právomocí fóra</span>
          </h3>

          <div className="overflow-x-auto text-[11px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b text-[10px] font-bold uppercase coding-wide">
                  <th className="p-3">Meno občana</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Aktuálna Rola</th>
                  <th className="p-3 text-right">Zmena právomoci úradu</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-705 text-slate-700">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="p-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border">
                        <img src={u.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold">{u.name}</span>
                    </td>
                    <td className="p-3 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 font-extrabold px-2 py-0.5 rounded text-[10px]">{u.role}</span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button onClick={() => handleUpdateRole(u.id, 'registered')} className="bg-white hover:bg-slate-100 border text-slate-700 py-1 px-2 rounded-lg font-semibold text-[10px]">Občan</button>
                      <button onClick={() => handleUpdateRole(u.id, 'organization')} className="bg-blue-50 hover:bg-blue-105 border border-blue-200 text-blue-900 py-1 px-2 rounded-lg font-semibold text-[10px]">Spolok</button>
                      <button onClick={() => handleUpdateRole(u.id, 'moderator')} className="bg-amber-50 hover:bg-amber-105 border border-amber-200 text-amber-900 py-1 px-2 rounded-lg font-semibold text-[10px]">Moderátor</button>
                      <button onClick={() => { alert('Obyvateľ bol dočasne suspendovaný z diskusného kruhu.'); }} className="bg-red-50 hover:bg-red-105 border border-red-250 text-red-900 py-1 px-2 rounded-lg font-semibold text-[10px]">Suspendovať 🚫</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB C: TOWN BANNER ALERTS SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm/50 space-y-6 text-xs max-w-2xl">
          <h3 className="font-serif font-bold text-slate-900 border-b pb-2 text-sm flex items-center gap-1.5 uppercase tracking-wide">
            <span>🚨 Editovanie mestského krízového výstražného pásu</span>
          </h3>

          <form onSubmit={handleUpdateSettings} className="space-y-4">
            
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block text-[11px]">Hlavný oficiálny mestský e-mail:</label>
              <input type="email" required value={townEmail} onChange={(e) => setTownEmail(e.target.value)} className="w-full p-2 rounded border focus:outline-none focus:ring-1 focus:ring-wine-500" />
            </div>

            <div className="p-4 bg-amber-50 rounded-xl space-y-3 border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-950 text-[11px]">
                <input type="checkbox" checked={alertBannerActive} onChange={(e) => setAlertBannerActive(e.target.checked)} className="rounded" />
                <span>AKTIVOVAŤ KRÍZOVÝ VÝSTRAŽNÝ BANER NA HLAVNEJ STRÁNKE OBYVATEĽOM</span>
              </label>

              <div className="space-y-1">
                <span className="text-[10px] text-amber-800 font-semibold block">Obsah výstražného oznamu (Zobrazí sa červeným pásavým písmom):</span>
                <textarea 
                  rows={4}
                  required
                  placeholder="Zadajte urgentný text... napr. výpadok vody, mimoriadny jarný vietor..."
                  value={alertBannerText}
                  onChange={(e) => setAlertBannerText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border bg-white focus:outline-none font-semibold text-amber-900 border-amber-300"
                />
              </div>
            </div>

            <button type="submit" className="bg-wine-700 hover:bg-wine-800 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-sm">
              Uložiť výstražnú konfiguráciu
            </button>

          </form>
        </div>
      )}

      {/* TAB D: LIVE SYSTEM AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-xs">
          
          <div className="border-b pb-2 flex justify-between items-center">
            <h3 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <span>📜 Bezpečnostno-aktivitný log Môj Fraštak</span>
            </h3>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-500 flex items-center gap-1">
              <Clock size={11} className="text-slate-400" />
              <span>Zariadenie Live</span>
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin font-mono text-[10px] leading-relaxed">
            {auditLogs.length === 0 ? (
              <p className="italic text-slate-400">Denník je v tejto relácii prázdny.</p>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-2 border rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE4] border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start sm:items-center gap-2">
                    <span className="bg-slate-300 text-slate-800 font-extrabold px-1 text-[9px] rounded uppercase shrink-0">
                      {log.action}
                    </span>
                    <span className="text-slate-800 leading-normal">{log.details}</span>
                  </div>
                  <span className="text-slate-400 shrink-0 font-sans text-[9px] font-semibold">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-wine-50 text-wine-900 border text-[10px] italic rounded-xl max-w-xl">
            Audit logs sa obnovia po premazaní klientskej LocalStorage pamäte, no slúžia aj ako reálna ochrana pred nekalým správaním a neférovým nahlasovaním.
          </div>

        </div>
      )}

    </div>
  );
};
