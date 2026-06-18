/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  MapPin, 
  ThumbsUp, 
  Clock, 
  Plus, 
  TrendingUp, 
  Check, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  Compass, 
  Camera,
  CornerDownRight,
  UserCheck
} from 'lucide-react';
import { IssueCategory, Issue, Comment } from '../types';

interface IssuesViewProps {
  setView: (view: string) => void;
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
}

export const IssuesView: React.FC<IssuesViewProps> = ({ 
  setView, 
  selectedIssueId, 
  setSelectedIssueId 
}) => {
  const { 
    issues, 
    comments, 
    currentUser, 
    addIssue, 
    supportIssue, 
    addComment, 
    toggleCommentReaction, 
    updateIssueStatus 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('Všetky');
  const [activeStatus, setActiveStatus] = useState<string>('Všetky');
  const [sortBy, setSortBy] = useState<'latest' | 'voted'>('latest');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Issue Wizard Form State
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Cesta');
  const [location, setLocation] = useState('Hlohovec – centrum');
  const [exactAddress, setExactAddress] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80');

  // Comment State
  const [commentText, setCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Admin and status manipulation tools
  const [adminStatus, setAdminStatus] = useState<any>('Rieši sa');
  const [adminNote, setAdminNote] = useState('');

  const issueCategories: string[] = [
    'Všetky',
    'Cesta',
    'Chodník',
    'Osvetlenie',
    'Odpad',
    'Zeleň',
    'Parkovanie',
    'Doprava',
    'Ihriská',
    'Mestský majetok',
    'Bezpečnosť',
    'Hluk',
    'Zvieratá',
    'Iné'
  ];

  const statuses = ['Všetky', 'Nový', 'Overuje sa', 'Odoslaný mestu', 'Rieši sa', 'Vyriešený', 'Zamietnutý'];

  const filteredIssues = issues.filter(i => {
    const matchesCategory = activeCategory === 'Všetky' || i.category === activeCategory;
    const matchesStatus = activeStatus === 'Všetky' || i.status === activeStatus;
    return matchesCategory && matchesStatus;
  });

  // Sorting
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'voted') {
      return b.supporters.length - a.supporters.length;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    // Simulate coordinates on the Hlohovec Map according to the neighborhood
    let mapX = 50, mapY = 50;
    if (location === 'Šulekovo') { mapX = 15; mapY = 82; }
    else if (location === 'Sihoť') { mapX = 35; mapY = 55; }
    else if (location === 'Leopoldov') { mapX = 18; mapY = 30; }
    else if (location === 'Hlohovec – centrum') { mapX = 55; mapY = 40; }

    addIssue({
      title,
      description,
      category,
      image: image || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
      location,
      privateLocation: exactAddress || undefined,
      coordinates: { x: mapX, y: mapY },
      authorId: currentUser.id,
      authorName: currentUser.name
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setExactAddress('');
    setCategory('Cesta');
    setLocation('Hlohovec – centrum');
    setStep(1);
    setShowAddForm(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedIssueId) return;

    addComment({
      entityType: 'issue',
      entityId: selectedIssueId,
      text: commentText,
      parentId: undefined
    });

    setCommentText('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim() || !selectedIssueId) return;

    addComment({
      entityType: 'issue',
      entityId: selectedIssueId,
      text: replyText,
      parentId: parentId
    });

    setReplyText('');
    setReplyToId(null);
  };

  const handleAdminStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !adminNote) return;

    updateIssueStatus(selectedIssueId, adminStatus, adminNote);
    setAdminNote('');
  };

  const activeIssueItem = issues.find(i => i.id === selectedIssueId);
  const activeIssueComments = comments.filter(c => c.entityType === 'issue' && c.entityId === selectedIssueId);

  // Group nesting
  const rootComments = activeIssueComments.filter(c => !c.parentId);
  const getRepliesFor = (id: string) => activeIssueComments.filter(c => c.parentId === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Občianske podnety</h2>
          <p className="text-xs text-slate-505 text-slate-500 mt-1">Zistite, aké problémy trápia ľudí v Hlohovci, podporte riešenia, alebo nahláste upchaté žľaby, poškodené lavičky či výtlky.</p>
        </div>

        {currentUser.role !== 'visitor' && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedIssueId(null);
            }}
            className="bg-[#D97706] text-white hover:bg-[#B45309] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Zatvoriť nahlásenie' : 'Nahlásiť nový problém'}</span>
          </button>
        )}
      </div>

      {/* DETAILED VIEW RENDER */}
      {selectedIssueId && activeIssueItem ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          
          {/* Issue body */}
          <div className="lg:col-span-8 space-y-6">
            
            <button 
              onClick={() => setSelectedIssueId(null)}
              className="text-slate-500 hover:text-slate-800 font-bold mb-4 flex items-center gap-1.5 bg-white border px-3 py-1.5 rounded-lg w-max shadow-sm"
            >
              <ChevronLeft size={16} />
              <span>Späť na prezeranie sťažností</span>
            </button>

            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm p-6 space-y-6">
              
              {/* Image box */}
              <div className="h-64 sm:h-80 w-full bg-slate-100 rounded-2xl overflow-hidden border">
                <img src={activeIssueItem.image} alt={activeIssueItem.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              {/* Badges line */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded text-[10px]">
                  {activeIssueItem.category}
                </span>
                <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  📍 {activeIssueItem.location}
                </span>
                <span className="ml-auto text-slate-405 text-slate-400 font-mono">
                  Zaslané: {new Date(activeIssueItem.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 leading-snug">
                {activeIssueItem.title}
              </h3>

              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
                {activeIssueItem.description}
              </p>

              {/* Supporting buttons */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-center sm:text-left">
                  <span className="font-bold text-slate-850 block">Silnejší hlas občanov!</span>
                  <span className="text-[10px] text-slate-500 leading-relaxed block">
                    {activeIssueItem.supporters.length} susedov vyjadrilo verejnú podporu tomuto podnetu.
                  </span>
                </div>

                {currentUser.role !== 'visitor' ? (
                  <button 
                    onClick={() => supportIssue(activeIssueItem.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeIssueItem.supporters.includes(currentUser.id)
                        ? 'bg-[#3F7D58] text-white' 
                        : 'bg-white text-slate-700 border hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{activeIssueItem.supporters.includes(currentUser.id) ? 'Už podporujem' : 'Podporiť sťažnosť'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Prihláste sa pre hlasovanie.</span>
                )}
              </div>

              {/* Status updating actions (Only for moderators, admins or official accounts) */}
              {['admin', 'moderator', 'organization'].includes(currentUser.role) && (
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <h4 className="font-serif font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <UserCheck size={14} className="text-amber-800" />
                    <span>PANEL PRE SPRÁVCU: Reagovať mestskej časti</span>
                  </h4>

                  <form onSubmit={handleAdminStatusChange} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-700 block font-semibold leading-normal">Zmeniť stav:</label>
                        <select 
                          value={adminStatus}
                          onChange={(e) => setAdminStatus(e.target.value as any)}
                          className="w-full p-2 rounded border bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Overuje sa">Overuje sa</option>
                          <option value="Odoslaný mestu">Odoslaný mestu</option>
                          <option value="Rieši sa">Rieši sa</option>
                          <option value="Vyriešený">Vyriešený (Uzatvoriť)</option>
                          <option value="Zamietnutý">Zamietnutý</option>
                          <option value="Bez reakcie">Bez reakcie doručenia</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-700 block font-semibold leading-normal">Meno reagujúceho úradníka:</label>
                        <input type="text" readOnly value={currentUser.name} className="w-full p-2 bg-slate-100 rounded border text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-700 block font-semibold leading-normal">Oficiálna odpoveď, stanovisko alebo technická správa:</label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="Odpovedzte občanom. Popíšte kedy prebehne oprava, alebo prečo bol podnet zamietnutý..."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        className="w-full p-2 rounded border bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
                      />
                    </div>

                    <button type="submit" className="bg-[#D97706] hover:bg-amber-600 text-white font-bold px-4 py-1.5 rounded-lg">
                      Uložiť zmenu stavu a odoslať notifikáciu
                    </button>
                  </form>
                </div>
              )}

              {/* COMMENTS & CIVIC PARTICIPATION SECTION */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-serif font-bold text-base text-slate-900">Mestská diskusia k podnetu</h4>
                
                {currentUser.role !== 'visitor' ? (
                  <form onSubmit={handleAddComment} className="flex gap-2 text-xs">
                    <input 
                      type="text" 
                      required
                      placeholder="Sem napíšte svedectvo, sťažnosť alebo doplňujúce informácie k stojacemu problému..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs bg-[#FAF7F2]"
                    />
                    <button type="submit" className="bg-wine-700 hover:bg-wine-800 text-white font-bold px-4 py-2 rounded-lg">
                      Odoslať
                    </button>
                  </form>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">Prihláste sa, ak sa chcete vyjadriť k riešeniu sťažnosti.</p>
                )}

                {/* Listing of comments */}
                <div className="space-y-4 pt-2">
                  {rootComments.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">K tomuto prebiehajúcemu podnetu zatiaľ nie sú uverejnené žiadne svedectvá.</p>
                  ) : (
                    rootComments.map(rc => {
                      const commentsReplies = getRepliesFor(rc.id);
                      return (
                        <div key={rc.id} className="p-3 bg-[#FCFAF7] rounded-xl border border-slate-150 space-y-2">
                          <div className="flex justify-between items-center bg-white p-1 rounded border-b">
                            <span className="font-bold text-slate-700">{rc.authorName} <span className="text-[8px] bg-slate-100 px-1 py-0.1 rounded font-normal text-slate-400">{rc.authorRole}</span></span>
                            <span className="text-[9px] text-slate-400">{new Date(rc.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-800 text-xs pl-1 leading-relaxed">{rc.text}</p>

                          {/* Trigger reply */}
                          {currentUser.role !== 'visitor' && (
                            <div className="flex justify-end">
                              {replyToId === rc.id ? (
                                <div className="w-full flex items-center gap-2 pt-2 border-t mt-2">
                                  <input 
                                    type="text"
                                    required
                                    placeholder="Odpovedať susedovi..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1 p-1 bg-white border rounded text-xs focus:outline-none"
                                  />
                                  <button onClick={() => handleAddReply(rc.id)} className="bg-wine-700 text-white px-2 py-1 rounded text-[10px] font-bold">✓</button>
                                  <button onClick={() => setReplyToId(null)} className="text-red-500 text-[10px] font-bold">x</button>
                                </div>
                              ) : (
                                <button onClick={() => setReplyToId(rc.id)} className="text-[10px] text-wine-800 font-semibold hover:underline flex items-center gap-0.5 mt-1">
                                  <MessageSquare size={10} />
                                  <span>Odpovedať</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Nested Replies Rendering */}
                          {commentsReplies.length > 0 && (
                            <div className="pl-6 space-y-2 pt-2 border-t border-slate-200 mt-2">
                              {commentsReplies.map(reply => (
                                <div key={reply.id} className="p-2 bg-white rounded border border-slate-100 space-y-1">
                                  <div className="flex justify-between items-center text-[9px]">
                                    <span className="font-bold text-slate-600 flex items-center gap-1">
                                      <CornerDownRight size={10} />
                                      <span>{reply.authorName}</span>
                                    </span>
                                    <span className="text-slate-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-slate-700 text-xs pl-3 leading-relaxed">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* Issue sidebar timeline */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Visual Progress Status widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-sm text-slate-900 border-b pb-2">História riešenia podnetu</h4>
              
              <div className="space-y-4 relative pl-3 border-l-2 border-wine-500">
                {activeIssueItem.history.map((h, i) => (
                  <div key={i} className="relative space-y-1 text-xs last:pb-0 pb-1">
                    {/* Ring indicator */}
                    <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-wine-700 border-2 border-white ring-2 ring-wine-300"></div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span className="text-wine-800 uppercase tracking-wide">{h.status}</span>
                      <span>{new Date(h.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-800 text-[11px] leading-relaxed italic">"{h.note}"</p>
                    <span className="text-[9px] text-slate-400 block font-medium">Reagoval: {h.changedBy || 'Mestskí Technici'}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-wine-50/50 rounded-xl border text-[10px] text-slate-500 italic leading-relaxed">
                Po sfinalizovaní podnetu a zložení zápisnice "Vyriešený" je občasné stojisko odfotené a odoslané občanom v okolí ako doručená služba.
              </div>
            </div>

            {/* Privacy details warnings */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 border text-[10px] text-slate-505 text-slate-500 leading-relaxed space-y-2">
              <p className="font-bold text-slate-700">⚖️ Informácie o ochrane a presnej polohe:</p>
              <p>
                Každé nahlasovacie políčko nesie plnú právnu čistotu. Presná, lokálne sťažená neverejná adresa (napr. číslo Vášho bytu alebo presné meno sťažovateľa) je spracovaná iba odborom výstavby a mestskej poriadkovej služby a nevystavuje sa verejne občanom pre zabránenie útokov.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <>
          {/* STEP BY STEP WIZARD FORM (Nahlasovací wizard) */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-3xl border-2 border-[#D97706]/70 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-250">
              <div className="flex justify-between items-center border-b pb-3 mb-2">
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={18} className="text-[#D97706]" />
                  <span>Občiansky hlásič znečistenia a poškodenia: Krok {step} z 3</span>
                </h3>
                <span className="text-[10px] bg-slate-900 text-slate-100 font-bold px-2 py-0.5 rounded">Sprievodca nahlásením</span>
              </div>

              <form onSubmit={handleCreateIssue} className="space-y-4 leading-relaxed text-xs">
                
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Zadajte základné, zrozumiteľné zaradenie pre technických pracovníkov alebo úrad mestskej časti Hlohovec.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">Kategória poruchy:</label>
                        <select 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value as IssueCategory)}
                          className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-550 bg-white"
                        >
                          {issueCategories.filter(c => c !== 'Všetky').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">Štvrť / Lokalita:</label>
                        <select 
                          value={location} 
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-550 bg-white"
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

                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Výstižný stručný názov sťažnosti:</label>
                      <input 
                        type="text" 
                        required
                        placeholder="napr. Vyvrátený odpadkový kôš pri detskom ihrisku"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2.5 rounded-lg border focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        disabled={!title}
                        className="bg-wine-700 text-white font-bold px-5 py-2 rounded-lg hover:bg-wine-800 disabled:opacity-50"
                      >
                        Pokračovať na popis (Krok 2)
                      </button>
                    </div>

                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Zadajte doplňujúce, fyzické postrehy a popíšte ako vážne a dlho problém pretrváva.
                    </p>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-705 block">Opis situácie a poškodenia:</label>
                      <textarea 
                        rows={5}
                        required
                        placeholder="Napíšte k čomu presne došlo, či porucha ohrozuje autá, deti na ihriskách alebo chodcov po zotmení..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg"
                      >
                        Návrat k 1. kroku
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setStep(3)}
                        disabled={!description}
                        className="bg-wine-700 text-white font-bold px-5 py-2 rounded-lg hover:bg-wine-800 disabled:opacity-50"
                      >
                        Pokračovať na adresu a fotku (Krok 3)
                      </button>
                    </div>

                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Uveďte presnejšie lokalizačné detaily a nepovinný odkaz na odfotený problém na mieste.
                    </p>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Fotografia poškodenia (url odkaz):</label>
                      <div className="flex gap-2 items-center">
                        <Camera size={14} className="text-slate-400 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="https://images.unsplash.com/..."
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          className="w-full p-2.1 p-2 border rounded focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 block">Súkromná presná adresa / orientačné body (neverejná):</label>
                      <input 
                        type="text" 
                        placeholder="napr. vedľa lampy č. HC-24, pred vchodom bytovky Jesenského 22"
                        value={exactAddress}
                        onChange={(e) => setExactAddress(e.target.value)}
                        className="w-full p-2.5 rounded-lg border focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-between pt-2 border-t mt-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(2)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg"
                      >
                        Späť na Krok 2
                      </button>
                      <button 
                        type="submit" 
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded-lg"
                      >
                        Odoslať oficiálny sťažovateľský podnet
                      </button>
                    </div>

                  </div>
                )}

              </form>
            </div>
          )}

          {/* LIST FILTER AND SORT CONTROLS PANEL */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4 text-xs">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-semibold text-slate-505 text-slate-500 text-[11px]">Stav:</span>
                {statuses.map(st => (
                  <button
                    key={st}
                    onClick={() => setActiveStatus(st)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-semibold border ${
                      activeStatus === st 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 text-[11px]">Zoradiť:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="p-1 px-2 border rounded bg-white text-[11px] text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="latest">Najnovšie príspevky</option>
                  <option value="voted">Najviac podporované (Sila)</option>
                </select>
              </div>

            </div>

            <div className="border-t pt-3 flex items-center gap-2 max-w-full overflow-x-auto pb-1.5">
              <span className="font-semibold text-slate-505 text-slate-500 text-[11px] shrink-0">Kategória:</span>
              <div className="flex gap-1.5">
                {issueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[10px] whitespace-nowrap border font-medium ${
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

          {/* ISSUES RESULT TABLE / GRID RENDER */}
          {sortedIssues.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border space-y-3">
              <span className="text-3xl">🛠️</span>
              <h3 className="font-serif font-bold text-lg text-slate-800">Nenašli sa žiadne nahlásené problémy občanov</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">V tejto kategórii alebo stave nie je evidovaný žiaden otvorený prípad.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedIssues.map(item => {
                const userSupported = item.supporters.includes(currentUser.id);
                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-205 shadow-sm hover:shadow-md transition-all flex flex-col h-full justify-between"
                  >
                    
                    {/* Visual Card Body */}
                    <div className="space-y-4">
                      
                      {/* Image header */}
                      <div className="h-44 bg-slate-100 relative cursor-pointer" onClick={() => setSelectedIssueId(item.id)}>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        
                        {/* Status Label Overlay */}
                        <div className={`absolute top-4 left-4 text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase ${
                          item.status === 'Vyriešený' ? 'bg-[#3F7D58] text-white' :
                          item.status === 'Rieši sa' ? 'bg-amber-600 text-white' :
                          item.status === 'Zamietnutý' ? 'bg-red-700 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {item.status}
                        </div>

                        {/* Supporter Badge Overlay */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm shadow border p-1 rounded-lg text-center font-bold text-[10px] flex items-center gap-1">
                          <span>👍</span>
                          <span className="text-slate-900 text-[11px] font-extrabold">{item.supporters.length}</span>
                        </div>
                      </div>

                      {/* Content panel padding */}
                      <div className="px-5 space-y-2 cursor-pointer" onClick={() => setSelectedIssueId(item.id)}>
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span className="bg-amber-100 text-amber-905 text-amber-900 font-bold px-1.5 py-0.2 rounded">{item.category}</span>
                          <span className="font-semibold text-slate-500">{item.location}</span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-slate-900 leading-snug hover:text-wine-800 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-505 text-slate-500 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                    </div>

                    <div className="p-5 pt-3 border-t bg-slate-50/50 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Zaslal: {item.authorName}</span>
                        <span>Stav: {item.status}</span>
                      </div>

                      {currentUser.role !== 'visitor' ? (
                        <button 
                          onClick={() => supportIssue(item.id)}
                          className={`w-full py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                            userSupported 
                              ? 'bg-[#3F7D58] text-white' 
                              : 'bg-white text-slate-700 border hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp size={11} />
                          <span>{userSupported ? 'Susedská podpora udelená!' : `Podporiť sťažnosť občanov`}</span>
                        </button>
                      ) : null}

                      <button 
                        onClick={() => setSelectedIssueId(item.id)}
                        className="w-full text-center bg-white text-slate-700 hover:bg-slate-100 font-bold py-2 rounded-xl text-xs border transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Sledovať riešenie & diskusia</span>
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
