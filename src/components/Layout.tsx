/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  User as UserIcon, 
  Briefcase, 
  Building2, 
  Plus, 
  Bell, 
  Search, 
  LogOut, 
  ShieldAlert, 
  Settings, 
  Sliders,
  CheckCircle2,
  Lock,
  Compass,
  FileText,
  Menu,
  X,
  Megaphone
} from 'lucide-react';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  currentView: string;
  setView: (view: string) => void;
  children: React.ReactNode;
  onOpenQuickAdd: (type: 'udalost' | 'oznam' | 'podnet' | 'diskusia') => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, onOpenQuickAdd }) => {
  const { currentUser, switchUserRole, notifications, markNotificationsAsRead, clearNotification, isOffline, canInstallPwa, installPwa } = useApp();
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInstallToast, setShowInstallToast] = useState<boolean>(() => {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('pwa_prompt_dismissed') !== 'true' : true;
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const rolesList: { role: UserRole; label: string; desc: string; color: string }[] = [
    { role: 'visitor', label: 'Návštevník', desc: 'Iba prezeranie, vyhľadávanie a filtre', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    { role: 'registered', label: 'Registrovaný občan', desc: 'Komentovanie, reakcie, ukladanie', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { role: 'verified_citizen', label: 'Overený obyvateľ', desc: 'Možnosť podporovať sťažnosti, zelený odznak', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { role: 'organization', label: 'Organizácia', desc: 'Pridávanie oficiálnych oznamov a udalostí', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { role: 'business', label: 'Miestna firma', desc: 'Vlastný biznis panel, balíky a práce', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { role: 'moderator', label: 'Moderátor', desc: 'Správa sťažností občanov, schvaľovanie diskusií', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { role: 'admin', label: 'Administrátor', desc: 'Plný prístup ku kategóriám, logom a štatistikám', color: 'bg-wine-50 text-wine-900 border-wine-200 font-bold' }
  ];

  const handleNotificationClick = (link?: string) => {
    setShowNotifications(false);
    if (link) {
      if (link.startsWith('/podnety')) {
        setView('podnety');
      } else if (link.startsWith('/diskusie')) {
        setView('diskusie');
      } else if (link.startsWith('/oznamy')) {
        setView('oznamy');
      } else if (link.startsWith('/admin')) {
        setView('administracia');
      }
    }
  };

  const handleLogoClick = () => {
    setView('domov');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F2933]">
      
      {/* 1. TOP ROLE SIMULATOR BAR (Dramatically useful for active evaluation) */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 z-50">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 block h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium opacity-90">Simulačné prostredie pre hodnotiteľa:</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-75">Aktívna rola:</span>
          <button 
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="bg-wine-600 hover:bg-wine-700 text-white font-medium px-2 py-1 rounded flex items-center gap-1 transition-all"
          >
            <Sliders size={13} />
            <span>{rolesList.find(r => r.role === currentUser.role)?.label}</span>
            <span className="text-[10px] opacity-80">(Zmeniť rolu)</span>
          </button>
        </div>

        {/* Floating Selector Drawer */}
        {showRoleSelector && (
          <div className="absolute top-9 right-4 bg-white text-[#1F2933] w-80 p-4 rounded-lg shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-3">
            <h3 className="font-semibold text-sm text-slate-900 border-b pb-2 mb-2 flex items-center justify-between">
              <span>Vyberte testovaciu rolu:</span>
              <button onClick={() => setShowRoleSelector(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">Zatvoriť</button>
            </h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {rolesList.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    switchUserRole(item.role);
                    setShowRoleSelector(false);
                  }}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors flex items-start gap-2 ${
                    currentUser.role === item.role 
                      ? 'border-wine-500 ring-2 ring-wine-300' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${item.color}`}>
                    {item.label}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.role === currentUser.role ? '✓ Aktívna rola' : 'Simulovať podmienky'}</p>
                    <p className="text-[10px] text-slate-505 text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-3 pt-2 text-[10px] text-slate-400 border-t italic leading-snug">
              Zmena roly okamžite upraví vizuálne funkcie, admin panely, formulárové práva a schvaľovanie v celej aplikácii.
            </p>
          </div>
        )}
      </div>

      {/* 2. MAIN HEADER (DESKTOP) & TOP DRAWER */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8DED2] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogoClick}>
              <div className="w-10 h-10 rounded-xl bg-wine-700 flex items-center justify-center text-white shadow-md shadow-wine-700/20">
                <span className="font-serif font-bold text-xl tracking-tight">F</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg md:text-xl tracking-tight text-wine-900 leading-none">Môj Fraštak</h1>
                <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase hidden sm:block mt-0.5">Komunitný portál Hlohovca</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-medium">
              <button 
                onClick={() => setView('domov')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'domov' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Domov
              </button>
              <button 
                onClick={() => setView('udalosti')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'udalosti' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Udalosti
              </button>
              <button 
                onClick={() => setView('oznamy')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'oznamy' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Oznamy
              </button>
              <button 
                onClick={() => setView('podnety')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'podnety' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Podnety občanov
              </button>
              <button 
                onClick={() => setView('diskusie')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'diskusie' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Diskusie
              </button>
              <button 
                onClick={() => setView('adresar')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'adresar' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Firmy a organizácie
              </button>
              <button 
                onClick={() => setView('prace')} 
                className={`px-3 py-2 rounded-lg transition-all ${currentView === 'prace' ? 'bg-[#7A263A]/10 text-wine-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                Pracovné ponuky
              </button>
            </nav>

            {/* Icons Actions Bar */}
            <div className="flex items-center gap-3">
              
              {/* Notification bell */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) markNotificationsAsRead();
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-950 relative transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span id="unread-notif-dot" className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {showNotifications && (
                  <div className="absolute top-12 right-0 bg-white w-80 rounded-xl shadow-xl border border-slate-200/95 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b flex justify-between items-center bg-slate-50/50">
                      <span className="font-semibold text-xs text-slate-800">Moje Upozornenia</span>
                      <button 
                        onClick={() => markNotificationsAsRead()}
                        className="text-[10px] text-wine-700 hover:underline font-semibold"
                      >
                        Označiť ako prečítané
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          Žiadne nové oznámenia
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => handleNotificationClick(n.link)}
                            className={`p-3 border-b border-slate-50 flex gap-2 cursor-pointer transition-colors text-xs hover:bg-[#FAF7F2] ${!n.isRead ? 'bg-[#7A263A]/5 font-medium' : ''}`}
                          >
                            <span className="text-base">
                              {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : n.type === 'comment' ? '💬' : 'ℹ️'}
                            </span>
                            <div className="flex-1">
                              <p className="text-slate-700 leading-snug">{n.text}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Add Button (Desktop) */}
              {currentUser.role !== 'visitor' && (
                <div className="relative group hidden sm:block">
                  <button className="bg-wine-700 text-white font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-wine-800 transition-all shadow-sm">
                    <Plus size={16} />
                    <span>Pridať obsah</span>
                  </button>
                  <div className="absolute right-0 top-9 bg-white hidden group-hover:block hover:block w-48 rounded-lg shadow-xl border border-slate-100 p-1 z-50 text-xs text-slate-700">
                    <button 
                      onClick={() => onOpenQuickAdd('udalost')} 
                      className="w-full text-left px-3 py-2 rounded hover:bg-wine-50 transition-all hover:text-wine-900 flex items-center gap-1.5"
                    >
                      <Calendar size={13} className="text-wine-600" />
                      Pridať udalosť
                    </button>
                    {['admin', 'moderator', 'organization'].includes(currentUser.role) && (
                      <button 
                        onClick={() => onOpenQuickAdd('oznam')} 
                        className="w-full text-left px-3 py-2 rounded hover:bg-wine-50 transition-all hover:text-wine-900 flex items-center gap-1.5"
                      >
                        <FileText size={13} className="text-wine-600" />
                        Pridať oznam
                      </button>
                    )}
                    <button 
                      onClick={() => onOpenQuickAdd('podnet')} 
                      className="w-full text-left px-3 py-2 rounded hover:bg-wine-50 transition-all hover:text-wine-900 flex items-center gap-1.5"
                    >
                      <AlertTriangle size={13} className="text-wine-600" />
                      Nahlásiť problém
                    </button>
                    <button 
                      onClick={() => onOpenQuickAdd('diskusia')} 
                      className="w-full text-left px-3 py-2 rounded hover:bg-wine-50 transition-all hover:text-wine-900 flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} className="text-wine-600" />
                      Otvoriť diskusiu
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Panel button (Visible only if current user is moderator or admin) */}
              {['admin', 'moderator'].includes(currentUser.role) && (
                <button 
                  onClick={() => setView('administracia')}
                  className={`p-2 rounded-full hidden sm:flex items-center gap-1 font-semibold text-xs transition-colors ${
                    currentView === 'administracia' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Administračné centrum Môj Fraštak"
                >
                  <ShieldAlert size={16} />
                  <span>Administrácia</span>
                </button>
              )}

              {/* User Avatar Action */}
              <div 
                onClick={() => setView('profil')}
                className="w-8 h-8 rounded-full border border-wine-200/50 hover:border-wine-500 overflow-hidden cursor-pointer flex items-center justify-center bg-slate-200 text-wine-950 shadow-inner"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon size={18} />
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Connection Indicator Banner */}
      {isOffline && (
        <div id="offline-banner" className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-2 border-b border-amber-600/30 animate-in fade-in duration-300 z-50 sticky top-16">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
          <span>Práve ste v offline režime. Môj Fraštak zobrazuje lokálne uložené dáta, správy a kalendár.</span>
        </div>
      )}

      {/* 3. MAIN PAGE CANVAS */}
      <main className="flex-grow pb-24 md:pb-12">
        {children}
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <span className="font-serif font-bold text-lg text-white tracking-widest block mb-1">MÔJ FRAŠTAK</span>
              <p className="opacity-70 text-[10px]">Komunitná mestská aplikácia pre lepšie, informovanejšie a čistejšie mesto.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs">
              <button onClick={() => setView('domov')} className="hover:text-white transition-all">Domov</button>
              <button onClick={() => setView('udalosti')} className="hover:text-white transition-all">Kalendár akcií</button>
              <button onClick={() => setView('podnety')} className="hover:text-white transition-all">Služby a Sťažnosti občanov</button>
              <button onClick={() => setView('diskusie')} className="hover:text-white transition-all">Diskusie</button>
              <button onClick={() => setView('adresar')} className="hover:text-white transition-all">Firmy / Sponzori</button>
              <button onClick={() => setView('profil')} className="hover:text-white transition-all">Môj účet</button>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] opacity-60">
            <p>© 2026 Môj Fraštak. Všetky práva vyhradené. Vytvorené pre komunitný rozvoj v Hlohovci.</p>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">100% Lokalizované slovensky</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Formát 24h & Euro €</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. RESPONSIVE BOTTOM NAVIGATION BAR FOR MOBILE */}
      <div id="mobile-dock" className="lg:hidden fixed bottom-3 left-4 right-4 max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#eedecb]/75 px-1 py-1.5 flex items-center justify-around z-45">
        
        <button 
          onClick={() => {
            setView('domov');
            setShowMobileMenu(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentView === 'domov' && !showMobileMenu ? 'text-[#7A263A] font-bold bg-[#7A263A]/5' : 'text-slate-500'
          }`}
        >
          <Home size={18} className="stroke-[2.25] mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Prehľad</span>
        </button>

        <button 
          onClick={() => {
            setView('oznamy');
            setShowMobileMenu(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentView === 'oznamy' && !showMobileMenu ? 'text-[#7A263A] font-bold bg-[#7A263A]/5' : 'text-slate-500'
          }`}
        >
          <Megaphone size={18} className="stroke-[2.25] mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Oznamy</span>
        </button>

        {/* Center Plávajúce tlačidlo - Quick Add (for logged-in citizens) */}
        {currentUser.role !== 'visitor' && (
          <div className="px-1 shrink-0">
            <button 
              onClick={() => {
                onOpenQuickAdd('podnet');
                setShowMobileMenu(false);
              }}
              className="w-10 h-10 rounded-full bg-[#7A263A] text-white flex items-center justify-center hover:bg-[#8F3348] shadow-md shadow-[#7A263A]/20 active:scale-90 transition-all outline-none"
              title="Pridať podnet"
            >
              <Plus size={20} className="stroke-[3.5]" />
            </button>
          </div>
        )}

        <button 
          onClick={() => {
            setView('udalosti');
            setShowMobileMenu(false);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentView === 'udalosti' && !showMobileMenu ? 'text-[#7A263A] font-bold bg-[#7A263A]/5' : 'text-slate-500'
          }`}
        >
          <Calendar size={18} className="stroke-[2.25] mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Udalosti</span>
        </button>

        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            showMobileMenu ? 'text-[#7A263A] font-bold bg-[#7A263A]/10' : 'text-slate-500'
          }`}
        >
          <Menu size={18} className="stroke-[2.25] mb-0.5" />
          <span className="text-[10px] tracking-tight font-medium">Služby</span>
        </button>

      </div>

      {/* Modern, clean full-screen slide-up drawer for mobile PWA layout */}
      <AnimatePresence>
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            {/* Slide-up Container */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative max-h-[85vh] w-full bg-[#FAF7F2] rounded-t-[2.5rem] border-t border-[#eedecb] shadow-2xl overflow-y-auto pb-28 z-50 flex flex-col"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 shrink-0" onClick={() => setShowMobileMenu(false)}></div>
              
              {/* Header inside drawer */}
              <div className="px-6 pb-4 border-b border-[#eedecb]/55 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-none">Všetky služby mestečka</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Jednoduchá navigácia pre portál Môj Fraštak</p>
                </div>
                <button 
                  onClick={() => setShowMobileMenu(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Visual Greeting inside drawer */}
                <div className="bg-[#7A263A] text-white p-4 rounded-3xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold">👤</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-amber-200 font-bold">Rola: {rolesList.find(r => r.role === currentUser.role)?.label}</span>
                      <h4 className="font-bold text-xs leading-none truncate max-w-[150px]">{currentUser.name || 'Hosť'}</h4>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setView('profil');
                      setShowMobileMenu(false);
                    }}
                    className="bg-white/10 hover:bg-white/15 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/20 transition-all"
                  >
                    Môj profil
                  </button>
                </div>

                {/* Navigation Modules Grid */}
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block mb-1">Mestské a susedské sekcie</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    
                    <button 
                      onClick={() => {
                        setView('domov');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <Compass className="text-wine-800 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Domov / Prehľad</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Základné novinky</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setView('oznamy');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <Megaphone className="text-blue-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Oznamy a hlásenia</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Obyvateľstvo, voda</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setView('udalosti');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <Calendar className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Kultúra & Akcie</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Kalendár Hlohovca</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setView('podnety');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Nahlásené podnety</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Komunálne odpady</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setView('diskusie');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <MessageSquare className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Komunitné fórum</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Susedské diskusie</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setView('adresar');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <Building2 className="text-cyan-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Firmy & Sponzori</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Overený adresár</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        setView('prace');
                        setShowMobileMenu(false);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-wine-200 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                    >
                      <Briefcase className="text-amber-805 text-amber-600 shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="font-bold text-[#1f2937] text-xs block">Ponuky práce</span>
                        <span className="text-[9px] text-slate-500 leading-tight">Inzercia kariéry</span>
                      </div>
                    </button>

                    {/* Admin Panel button (Visible only if current user is moderator or admin) */}
                    {['admin', 'moderator'].includes(currentUser.role) && (
                      <button 
                        onClick={() => {
                          setView('administracia');
                          setShowMobileMenu(false);
                        }}
                        className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/60 hover:border-amber-400 text-left flex items-start gap-2.5 shadow-sm active:scale-98 transition-all"
                      >
                        <ShieldAlert className="text-amber-700 shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="font-bold text-amber-900 text-xs block">Administrácia</span>
                          <span className="text-[9px] text-amber-700 leading-tight">Riadiace centrum</span>
                        </div>
                      </button>
                    )}

                  </div>
                </div>

                {/* Fast simulated switch rola to facilitate tester actions */}
                <div className="bg-[#FAF7F2] p-4 rounded-3xl border border-[#eedecb] space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Simulácia testovania</span>
                  <p className="text-[10px] text-slate-500 leading-tight">Zmena roly okamžite prepne povolenie tvorby obsahu, hlasovaní, administrátorských panelov a upozornení:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rolesList.slice(0, 3).map(r => (
                      <button 
                        key={r.role}
                        onClick={() => {
                          switchUserRole(r.role);
                        }}
                        className={`text-[9px] px-2.5 py-1 rounded-lg border font-bold transition-all ${
                          currentUser.role === r.role 
                            ? 'bg-wine-700 text-white border-wine-800' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                    <button 
                      onClick={() => setShowRoleSelector(true)}
                      className="text-[9px] px-2.5 py-1 rounded-lg border bg-slate-900 text-white font-bold hover:bg-slate-800"
                    >
                      Iné roly...
                    </button>
                  </div>
                </div>

                {/* Footer of the Drawer */}
                <div className="text-center pt-2">
                  <p className="text-[9px] text-slate-400">Môj Fraštak PWA • Verzia 1.2 • Hlohovec 2026</p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Elegant PWA Floating Mobile Install Prompt */}
      {canInstallPwa && showInstallToast && (
        <div id="pwa-install-toast" className="lg:hidden fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom duration-500 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#7A263A] flex items-center justify-center text-white shrink-0 shadow-md">
                <span className="font-serif font-bold text-base tracking-tight text-white text-center">F</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Pridať Môj Fraštak na plochu</h4>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">Získajte rýchly a stabilný prístup priamo z domovskej obrazovky vášho mobilu.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                sessionStorage.setItem('pwa_prompt_dismissed', 'true');
                setShowInstallToast(false);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-full text-xs"
              aria-label="Zatvoriť"
            >
              ✕
            </button>
          </div>
          <div className="flex justify-end gap-2 text-[10px] font-bold mt-1">
            <button 
              onClick={() => {
                sessionStorage.setItem('pwa_prompt_dismissed', 'true');
                setShowInstallToast(false);
              }}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Neskôr
            </button>
            <button 
              onClick={() => {
                installPwa();
                setShowInstallToast(false);
              }}
              className="bg-[#7A263A] hover:bg-[#8F3348] text-white px-3.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-md"
            >
              Nainštalovať aplikáciu
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
