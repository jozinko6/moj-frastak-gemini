/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Plus, 
  Pin, 
  Lock, 
  Unlock, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  Lightbulb, 
  HeartHandshake, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Trash2,
  AlertOctagon,
  CornerDownRight
} from 'lucide-react';
import { DiscussionCategory, DiscussionType, Discussion, Comment } from '../types';

interface DiscussionsViewProps {
  setView: (view: string) => void;
  selectedDiscussionId: string | null;
  setSelectedDiscussionId: (id: string | null) => void;
}

export const DiscussionsView: React.FC<DiscussionsViewProps> = ({ 
  setView, 
  selectedDiscussionId, 
  setSelectedDiscussionId 
}) => {
  const { 
    discussions, 
    comments, 
    currentUser, 
    addDiscussion, 
    toggleDiscussionReaction, 
    lockDiscussion, 
    pinDiscussion, 
    addComment, 
    toggleCommentReaction, 
    deleteComment,
    addReport
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Všetky');
  const [activeType, setActiveType] = useState<string>('Všetky');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Topic Form State
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<DiscussionCategory>('Voľná diskusia');
  const [newType, setNewType] = useState<DiscussionType>('Názor');

  // Input states inside Detail
  const [commentInput, setCommentInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

  // Community Flag reports modal simulation
  const [showReportModal, setShowReportModal] = useState<string | null>(null); // comment/discussion ID
  const [reportReason, setReportReason] = useState<any>('Spam');
  const [reportNote, setReportNote] = useState('');

  const discussionCategories: string[] = [
    'Všetky',
    'Mesto a samospráva',
    'Doprava a parkovanie',
    'Výstavba a rozvoj',
    'Kultúra',
    'Šport',
    'Školy a škôlky',
    'Rodiny a deti',
    'Seniori',
    'Bezpečnosť',
    'Životné prostredie',
    'Podnikanie',
    'História mesta',
    'Šulekovo',
    'Návrhy občanov',
    'Voľná diskusia'
  ];

  const types = ['Všetky', 'Názor', 'Otázka', 'Návrh', 'Problém'];

  const filteredDiscussions = discussions.filter(d => {
    if (d.status === 'hidden') return false;

    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'Všetky' || d.category === activeCategory;
    const matchesType = activeType === 'Všetky' || d.type === activeType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort: pinned first, then newest
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.status === 'pinned' && b.status !== 'pinned') return -1;
    if (a.status !== 'pinned' && b.status === 'pinned') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newText) return;

    addDiscussion({
      title: newTitle,
      text: newText,
      category: newCategory,
      type: newType,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role
    });

    // Reset Form
    setNewTitle('');
    setNewText('');
    setNewCategory('Voľná diskusia');
    setNewType('Názor');
    setShowAddForm(false);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedDiscussionId) return;

    addComment({
      entityType: 'discussion',
      entityId: selectedDiscussionId,
      text: commentInput,
      parentId: undefined
    });

    setCommentInput('');
  };

  const handlePostReply = (parentId: string) => {
    if (!replyInput.trim() || !selectedDiscussionId) return;

    addComment({
      entityType: 'discussion',
      entityId: selectedDiscussionId,
      text: replyInput,
      parentId
    });

    setReplyInput('');
    setReplyTargetId(null);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReportModal) return;

    addReport('discussion', showReportModal, reportReason, reportNote);
    setShowReportModal(null);
    setReportNote('');
    alert('Nahlásenie bolo úspešne zaznamenané a odovzdané tímu moderátorov.');
  };

  const currentDisc = discussions.find(d => d.id === selectedDiscussionId);
  const currentComments = comments.filter(c => c.entityType === 'discussion' && c.entityId === selectedDiscussionId);

  // Nesting
  const rootComments = currentComments.filter(c => !c.parentId);
  const getRepliesFor = (id: string) => currentComments.filter(c => c.parentId === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Komunitné fóra a diskusie</h2>
          <p className="text-xs text-slate-505 text-slate-500 mt-1">Slušná susedská výmena názorov. Vyjadrite sa k plánom rozvoja, prekážkam alebo zdieľajte rady.</p>
        </div>

        {currentUser.role !== 'visitor' && (
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedDiscussionId(null);
            }}
            className="bg-wine-700 text-white hover:bg-wine-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>{showAddForm ? 'Zavrieť tému' : 'Založiť novú diskusiu'}</span>
          </button>
        )}
      </div>

      {/* DISCUSSION DETAILS CHANNELS */}
      {selectedDiscussionId && currentDisc ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          
          <div className="lg:col-span-8 space-y-6 animate-in slide-in-from-left-4 duration-200">
            
            <button 
              onClick={() => setSelectedDiscussionId(null)}
              className="text-slate-505 text-slate-500 hover:text-slate-800 font-bold mb-4 flex items-center gap-1.5 bg-white border px-3 py-1.5 rounded-lg w-max"
            >
              <ChevronLeft size={16} />
              <span>Späť na zoznam tém fóra</span>
            </button>

            {/* Main Forum Post */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold px-2 py-0.5 rounded text-[10px]">
                  {currentDisc.category}
                </span>
                <span className="bg-wine-50 text-wine-900 font-extrabold px-2 py-0.5 rounded text-[10px] border border-wine-100">
                  {currentDisc.type}
                </span>

                {/* State Badges */}
                {currentDisc.status === 'pinned' && (
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                    <Pin size={10} className="fill-amber-600" />
                    <span>PINNED</span>
                  </span>
                )}
                {currentDisc.status === 'locked' && (
                  <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                    <Lock size={10} />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 leading-snug">
                {currentDisc.title}
              </h3>

              <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                <span>Založil občan: <strong>{currentDisc.authorName}</strong></span>
                <span>• Role: <span className="text-wine-800 font-semibold">{currentDisc.authorRole}</span></span>
                <span>• {new Date(currentDisc.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal pt-2 border-t whitespace-pre-wrap">
                {currentDisc.text}
              </p>

              {/* REACTION SYSTEM MATRIX BUTTONS */}
              <div className="border-t pt-4 space-y-2">
                <span className="font-semibold text-[10px] text-slate-500 uppercase tracking-widest block">Susedské reakcie:</span>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  
                  <button 
                    onClick={() => currentUser.role !== 'visitor' && toggleDiscussionReaction(currentDisc.id, 'suhlasim')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold ${
                      currentDisc.reactions.suhlasim.includes(currentUser.id) ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ThumbsUp size={11} />
                    <span>Súhlasím ({currentDisc.reactions.suhlasim.length})</span>
                  </button>

                  <button 
                    onClick={() => currentUser.role !== 'visitor' && toggleDiscussionReaction(currentDisc.id, 'nesuhlasim')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold ${
                      currentDisc.reactions.nesuhlasim.includes(currentUser.id) ? 'bg-red-600 text-white border-red-700' : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ThumbsDown size={11} />
                    <span>Nesúhlasím ({currentDisc.reactions.nesuhlasim.length})</span>
                  </button>

                  <button 
                    onClick={() => currentUser.role !== 'visitor' && toggleDiscussionReaction(currentDisc.id, 'uzitocne')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold ${
                      currentDisc.reactions.uzitocne.includes(currentUser.id) ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Lightbulb size={11} />
                    <span>Užitočné ({currentDisc.reactions.uzitocne.length})</span>
                  </button>

                  <button 
                    onClick={() => currentUser.role !== 'visitor' && toggleDiscussionReaction(currentDisc.id, 'vysvetlenie')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold ${
                      currentDisc.reactions.vysvetlenie.includes(currentUser.id) ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <HelpCircle size={11} />
                    <span>Chcem vysvetlenie ({currentDisc.reactions.vysvetlenie.length})</span>
                  </button>

                  <button 
                    onClick={() => currentUser.role !== 'visitor' && toggleDiscussionReaction(currentDisc.id, 'podporujem')}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-bold ${
                      currentDisc.reactions.podporujem.includes(currentUser.id) ? 'bg-wine-100 text-wine-900 border-wine-300' : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <HeartHandshake size={11} />
                    <span>Podporujem riešenie ({currentDisc.reactions.podporujem.length})</span>
                  </button>

                </div>
              </div>

            </div>

            {/* FORUM FEED comments panel */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-1.5 border-b pb-2">
                <span>Príspevky v diskusii ({currentComments.length})</span>
              </h4>

              {/* POST NEW COMMENT FORM */}
              {currentDisc.status === 'locked' ? (
                <div className="bg-red-50 p-3 rounded-lg border text-red-800 text-[11px] font-semibold text-center italic">
                  Táto diskusná téma bola uzamknutá moderátormi. Pridávanie nových komentárov bolo obmedzené.
                </div>
              ) : currentUser.role !== 'visitor' ? (
                <form onSubmit={handlePostComment} className="flex gap-2 text-xs">
                  <input 
                    type="text" 
                    required
                    placeholder="Zapojte sa do konštruktívneho rozhovoru slušným tónom..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 p-2.5 bg-[#FAF7F2] focus:bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                  />
                  <button type="submit" className="bg-wine-700 hover:bg-wine-800 text-white font-bold px-4 rounded-xl flex items-center gap-1">
                    <Send size={13} />
                    <span>Zavesiť</span>
                  </button>
                </form>
              ) : (
                <p className="text-[10px] text-slate-400 italic text-center py-2">Pre komentovanie a diskusiu sa musíte prihlásiť.</p>
              )}

              {/* COMMENTS LOG LOOP */}
              <div className="space-y-4 pt-2">
                {rootComments.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-4">Zatiaľ žiadne príspevky. Začnite diskusiu prvým názorom vy!</p>
                ) : (
                  rootComments.map(rc => {
                    const rcReplies = getRepliesFor(rc.id);
                    const userLiked = rc.reactions?.like.includes(currentUser.id);
                    const userDisliked = rc.reactions?.dislike.includes(currentUser.id);

                    return (
                      <div key={rc.id} className="p-4 bg-[#FCFAF7] rounded-xl border border-slate-150 space-y-2">
                        
                        <div className="flex justify-between items-center bg-white p-1.5 rounded-lg border-b text-[10px]">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <span>{rc.authorName}</span>
                            <span className="text-[8px] bg-wine-50 text-wine-900 border border-wine-150 px-1 rounded font-semibold">{rc.authorRole}</span>
                          </span>
                          <span className="text-slate-400 font-mono">{new Date(rc.createdAt).toLocaleDateString()}</span>
                        </div>

                        <p className="text-slate-800 pl-1 leading-relaxed text-xs">{rc.text}</p>

                        <div className="flex items-center justify-between text-[10px] pt-1">
                          
                          {/* Likes */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => currentUser.role !== 'visitor' && toggleCommentReaction(rc.id, 'like')}
                              className={`flex items-center gap-0.5 font-bold ${userLiked ? 'text-emerald-700' : 'text-slate-400'}`}
                            >
                              👍 <span>{rc.reactions?.like.length || 0}</span>
                            </button>
                            <button 
                              onClick={() => currentUser.role !== 'visitor' && toggleCommentReaction(rc.id, 'dislike')}
                              className={`flex items-center gap-0.5 font-bold ${userDisliked ? 'text-red-700' : 'text-slate-400'}`}
                            >
                              👎 <span>{rc.reactions?.dislike.length || 0}</span>
                            </button>
                          </div>

                          {/* Action Items */}
                          <div className="flex gap-3">
                            {/* Flag report button */}
                            <button 
                              onClick={() => setShowReportModal(rc.id)}
                              className="text-red-600/70 hover:text-red-800 hover:underline"
                            >
                              Nahlásiť ⚠️
                            </button>

                            {/* Delete Button (admin/moderator/mine) */}
                            {(rc.authorId === currentUser.id || ['admin', 'moderator'].includes(currentUser.role)) && (
                              <button 
                                onClick={() => deleteComment(rc.id)}
                                className="text-red-700/80 hover:text-red-900 hover:underline flex items-center gap-0.5 font-semibold"
                              >
                                <Trash2 size={11} />
                                <span>Zmazať</span>
                              </button>
                            )}

                            {/* Reply Input Trigger */}
                            {currentUser.role !== 'visitor' && currentDisc.status !== 'locked' && (
                              <button 
                                onClick={() => setReplyTargetId(rc.id === replyTargetId ? null : rc.id)}
                                className="text-wine-855 text-wine-800 hover:underline font-bold flex items-center gap-0.5"
                              >
                                <CornerDownRight size={11} />
                                <span>Odpovedať ({rcReplies.length})</span>
                              </button>
                            )}
                          </div>

                        </div>

                        {/* Inline Reply Form */}
                        {replyTargetId === rc.id && (
                          <div className="w-full flex items-center gap-2 pt-2 border-t mt-2">
                            <input 
                              type="text"
                              required
                              placeholder="Napíšte priamu odpoveď..."
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              className="flex-1 p-1.5 text-xs bg-white border rounded-lg focus:outline-none"
                            />
                            <button onClick={() => handlePostReply(rc.id)} className="bg-wine-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold">✓</button>
                            <button onClick={() => setReplyTargetId(null)} className="text-red-500 font-bold px-1 text-sm">x</button>
                          </div>
                        )}

                        {/* Staggered Replies List */}
                        {rcReplies.length > 0 && (
                          <div className="pl-6 space-y-2 pt-2 mt-2 border-l-2 border-slate-200">
                            {rcReplies.map(reply => (
                              <div key={reply.id} className="p-2.5 bg-white border rounded-lg space-y-1">
                                <div className="flex justify-between items-center text-[9px] text-slate-400">
                                  <span className="font-bold text-slate-600 flex items-center gap-1">
                                    <CornerDownRight size={10} />
                                    <span>{reply.authorName}</span>
                                    <span className="text-[8px] bg-slate-50 border px-1 rounded font-normal">{reply.authorRole}</span>
                                  </span>
                                  <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-800 leading-relaxed text-xs pl-3">{reply.text}</p>
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

          {/* SIDEBAR FOR DETAIL ACTIONS (Lock, Pin, Rules) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Moderator Control Box */}
            {['admin', 'moderator'].includes(currentUser.role) && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                  ⚙️ Moderácia diskusie
                </h4>
                
                <div className="space-y-2 text-xs">
                  
                  {currentDisc.status === 'pinned' ? (
                    <button 
                      onClick={() => pinDiscussion(currentDisc.id, false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Pin size={13} />
                      <span>Odopnúť tému z vrchu</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => pinDiscussion(currentDisc.id, true)}
                      className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold p-2 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Pin size={13} className="fill-amber-600" />
                      <span>Pripnúť na vrch fóra</span>
                    </button>
                  )}

                  {currentDisc.status === 'locked' ? (
                    <button 
                      onClick={() => lockDiscussion(currentDisc.id, false)}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold p-2 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Unlock size={13} />
                      <span>Odomknúť tému pre diskusiu</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => lockDiscussion(currentDisc.id, true)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-950 border border-red-200 font-bold p-2 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Lock size={13} />
                      <span>Uzamknúť tému (Lock)</span>
                    </button>
                  )}

                </div>
              </div>
            )}

            {/* Rules checklist sidebar */}
            <div className="bg-[#FAF7F2] rounded-3xl p-5 border text-[10px] text-slate-500 leading-relaxed space-y-3">
              <p className="font-serif font-bold text-slate-800 text-xs">Čestný kódex fóra Môj Fraštak:</p>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>Diskutujte vecne a k veci, urážky mazu naši moderátori.</li>
                <li>Názor je názor, no lživé obvinenia a ohovárky sem nepatria.</li>
                <li>Nezverejňujte osobné údaje tretích osôb bez ich vedomia (GDPR).</li>
                <li>Reklama patrí výlučne do firemných baličkov, spam sa prísne odstraňuje.</li>
              </ul>
            </div>

          </div>

        </div>
      ) : (
        <>
          {/* CREATE NEW DISCUSSION TOPIC FORM */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-2xl border-2 border-wine-150 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-250">
              <div className="flex items-center gap-2 text-wine-900 font-serif font-bold text-lg border-b pb-3">
                <MessageSquare size={20} className="text-wine-800" />
                <h3>Založiť novú diskusnú tému</h3>
              </div>

              <form onSubmit={handleCreateDiscussion} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                
                <div className="md:col-span-8 space-y-1">
                  <label className="font-semibold text-slate-700 block">Názov alebo otázka diskusie:</label>
                  <input 
                    type="text" 
                    required
                    placeholder="napr. Aký máte názor na dočasné zokruhovanie dopravy pri poliklinike?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="font-semibold text-slate-700 block">Druh:</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value as DiscussionType)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700 bg-white"
                  >
                    <option value="Názor">Názor</option>
                    <option value="Otázka">Otázka</option>
                    <option value="Návrh">Návrh</option>
                    <option value="Problém">Problém</option>
                  </select>
                </div>

                <div className="md:col-span-6 space-y-1">
                  <label className="font-semibold text-slate-700 block">Kategória témy:</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value as DiscussionCategory)}
                    className="w-full p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs text-slate-700 bg-white"
                  >
                    {discussionCategories.filter(c => c !== 'Všetky').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-12 space-y-1">
                  <label className="font-semibold text-slate-705 block">Čo chcete v Hlohovci prediskutovať?</label>
                  <textarea 
                    rows={6}
                    required
                    placeholder="Napíšte argumenty, argumentujte k veci, doplňte prepojenia. Pomôžte vytvoriť lepšie, slušnejšie susedstvo..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
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
                    Vytvoriť tému a začať rozhovor
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* SEARCH & FILTERS FOR DISCUSSION LISTING */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-4 text-xs">
            
            <div className="relative">
              <Search size={16} className="absolute top-3.5 left-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Vyhľadať kľúčové slová v susedských debatách a fórach..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-wine-500 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t pt-3">
              <span className="font-semibold text-slate-500 text-[11px]">Druh:</span>
              <div className="flex gap-1">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${
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

            <div className="border-t pt-3 flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="font-semibold text-slate-505 text-slate-500 text-[11px] shrink-0">Zaradenie:</span>
              <div className="flex gap-1.5">
                {discussionCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[10px] whitespace-nowrap transition-colors font-medium border border-transparent ${
                      activeCategory === cat 
                        ? 'bg-[#7A263A]/10 text-wine-900 font-bold border-wine-200' 
                        : 'bg-[#FAF7F2] hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* DISCUSSION CARD LOOPS */}
          {sortedDiscussions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border space-y-3">
              <span className="text-3xl">🗣️</span>
              <h3 className="font-serif font-bold text-lg text-slate-800">Nenašli sa žiadne diskusie</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">V tejto kategórii predbežne nikto neotvoril verejnú tému. Založte ju vy!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedDiscussions.map(disc => {
                const totalReactions = Object.values(disc.reactions).reduce((acc: number, current: any) => acc + (current ? current.length : 0), 0);
                const isPinned = disc.status === 'pinned';
                const isLocked = disc.status === 'locked';

                return (
                  <div 
                    key={disc.id}
                    onClick={() => setSelectedDiscussionId(disc.id)}
                    className={`bg-white rounded-2xl p-5 md:p-6 border transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-sm hover:border-wine-300 ${
                      isPinned ? 'border-amber-250 ring-1 ring-amber-100/50 bg-amber-50/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-2 md:max-w-3xl">
                      
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                        {isPinned && (
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase flex items-center gap-0.5">
                            📌 Pripnuté
                          </span>
                        )}
                        <span className="bg-wine-50 text-wine-900 font-bold px-2 py-0.5 rounded border border-wine-100">{disc.category}</span>
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-extrabold">{disc.type}</span>
                        <span className="text-slate-400 pt-0.5 font-mono">{disc.createdAt.split('T')[0]}</span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                        {disc.title}
                      </h3>

                      <p className="text-xs text-slate-505 text-slate-500 line-clamp-2 leading-relaxed">
                        {disc.text}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-slate-450 text-slate-400 font-mono">
                        <span>Založil: <strong>{disc.authorName}</strong> ({disc.authorRole})</span>
                        {isLocked && <span className="text-red-600 font-bold">🔒 Uzamknuté pre príspevky</span>}
                      </div>

                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto shrink-0 md:bg-[#FAF7F2] p-2.5 rounded-xl border border-transparent md:border-slate-150 gap-4">
                      
                      <div className="text-center md:px-3">
                        <span className="block text-slate-500 text-[8px] uppercase font-bold tracking-wider leading-none">Spätná väzba</span>
                        <span className="block text-slate-900 text-base font-extrabold mt-1">{totalReactions} hlasov</span>
                      </div>

                      <div className="border-l md:border-l-0 md:border-t border-slate-200 pl-4 md:pl-0 md:pt-2 text-center md:px-3">
                        <span className="block text-slate-550 text-slate-500 text-[8px] uppercase font-bold tracking-wider leading-none">Prepojenie</span>
                        <span className="block text-wine-900 font-bold hover:underline text-xs mt-1 flex items-center gap-0.5">
                          <span>Zapojiť sa</span>
                          <ChevronRight size={13} />
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* 5. MODERATOR COMMUNITY OFFENSIVE REPORT MODAL BOX */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-905/70 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-2xl border border-red-200">
            <h4 className="font-serif font-bold text-red-900 text-sm border-b pb-2 flex items-center gap-1.5">
              <AlertOctagon size={18} />
              <span>Nahlásiť hriech alebo spam v komunite</span>
            </h4>

            <form onSubmit={handleSendReport} className="space-y-3">
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-700 block">Dôvod nahlásenia príspevku:</label>
                <select 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as any)}
                  className="w-full p-2 rounded bg-slate-100 border focus:outline-none focus:ring-1 focus:ring-red-500 text-xs text-slate-700 font-semibold"
                >
                  <option value="Spam">Spam a klamlivé reklamy</option>
                  <option value="Vulgarizmy">Vulgarizmy a urážky</option>
                  <option value="Osobný útok">Osobný cielny útok</option>
                  <option value="Nenávistný obsah">Nenávistné a fašistické prejavy</option>
                  <option value="Zavádzajúce informácie">Zavádzajúce alebo poplašné správy</option>
                  <option value="Osobné údaje">Zverejnenie osobných údajov</option>
                  <option value="Nevyžiadaná reklama">Nevyžiadaná politická agitácia</option>
                  <option value="Iný dôvod">Iný závažný dôvod poručenia</option>
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-705 block">Doplňujúci záznam pre moderátorov:</label>
                <textarea 
                  rows={3}
                  placeholder="Popíšte bližšie, ako príspevok porušuje pravidlá..."
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded"
                >
                  Zrušiť
                </button>
                <button 
                  type="submit" 
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-1.5 rounded"
                >
                  Odoslať nahlásenie
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
