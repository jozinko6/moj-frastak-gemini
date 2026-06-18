/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Event, 
  Announcement, 
  Issue, 
  Discussion, 
  Comment, 
  Organization, 
  Business, 
  JobOffer, 
  Report, 
  AdCampaign, 
  AuditLog,
  AppSetting,
  UserRole,
  EventCategory,
  AnnouncementCategory,
  AnnouncementType,
  IssueCategory,
  IssueStatus,
  DiscussionCategory,
  DiscussionType,
  JobType,
  BusinessCategory,
  BusinessPackage
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_BUSINESSES, 
  INITIAL_EVENTS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ISSUES, 
  INITIAL_DISCUSSIONS, 
  INITIAL_COMMENTS, 
  INITIAL_JOBS, 
  INITIAL_REPORTS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_AUDIT_LOG, 
  INITIAL_APP_SETTINGS 
} from '../data/mockData';

interface AppContextProps {
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  organizations: Organization[];
  businesses: Business[];
  events: Event[];
  announcements: Announcement[];
  issues: Issue[];
  discussions: Discussion[];
  comments: Comment[];
  jobs: JobOffer[];
  reports: Report[];
  campaigns: AdCampaign[];
  auditLogs: AuditLog[];
  settings: AppSetting;
  notifications: Notification[];
  newsletterSubscribers: { email: string; preferences: string[] }[];
  
  // Role Simulation helpers
  switchUserRole: (role: UserRole) => void;
  
  // Actions
  addEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'interested' | 'going' | 'viewsCount'>) => void;
  editEvent: (eventId: string, updatedFields: Partial<Event>) => void;
  toggleEventRSVP: (eventId: string, type: 'going' | 'interested') => void;
  
  addAnnouncement: (annData: Omit<Announcement, 'id' | 'createdAt' | 'status'>) => void;
  editAnnouncement: (annId: string, updatedFields: Partial<Announcement>) => void;
  
  addIssue: (issueData: Omit<Issue, 'id' | 'createdAt' | 'status' | 'supporters' | 'history'>) => void;
  supportIssue: (issueId: string) => void;
  updateIssueStatus: (issueId: string, status: any, note: string) => void;
  
  addDiscussion: (discData: Omit<Discussion, 'id' | 'createdAt' | 'status' | 'reactions'>) => void;
  toggleDiscussionReaction: (discId: string, reactionType: 'suhlasim' | 'nesuhlasim' | 'uzitocne' | 'vysvetlenie' | 'podporujem') => void;
  lockDiscussion: (discId: string, locked: boolean) => void;
  pinDiscussion: (discId: string, pinned: boolean) => void;
  
  addComment: (commentData: Omit<Comment, 'id' | 'createdAt' | 'authorId' | 'authorName' | 'authorRole' | 'reactions'>) => void;
  toggleCommentReaction: (commentId: string, type: 'like' | 'dislike') => void;
  deleteComment: (commentId: string) => void;
  
  addBusiness: (bizData: Omit<Business, 'id' | 'viewsCount' | 'clicksCount' | 'verified' | 'admins' | 'planExpiresAt'>) => void;
  updateBusinessPackage: (bizId: string, plan: BusinessPackage, durationMonths: number) => void;
  incrementBusinessStats: (bizId: string, type: 'view' | 'click') => void;
  verifyBusiness: (bizId: string, verified: boolean) => void;

  requestVerification: (orgId: string) => void;
  approveVerification: (orgId: string, approve: boolean) => void;
  
  addJobOffer: (jobData: Omit<JobOffer, 'id' | 'status' | 'createdAt' | 'isSponsored'>, isSponsored: boolean) => void;
  archiveJobOffer: (jobId: string) => void;
  
  addReport: (contentType: 'comment' | 'discussion' | 'event' | 'issue', contentId: string, reason: string, note: string) => void;
  resolveReport: (reportId: string, action: 'none' | 'hidden' | 'warned' | 'blocked', feedback: string) => void;
  
  subscribeNewsletter: (email: string, preferences: string[]) => boolean;
  createAdCampaign: (campaign: Omit<AdCampaign, 'id' | 'views' | 'clicks' | 'status'>) => void;
  incrementAdStats: (campId: string, type: 'view' | 'click') => void;
  
  // Settings & Sys
  updateAppSettings: (newSettings: Partial<AppSetting>) => void;
  addAuditLog: (action: string, details?: string) => void;
  
  // Notification Management
  addNotificationToUser: (userId: string, text: string, type: any, link?: string) => void;
  markNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;

  // PWA & Connection states
  isOffline: boolean;
  canInstallPwa: boolean;
  installPwa: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from LocalStorage, otherwise use initial mock data
  const [users, setUsers] = useState<User[]>(() => {
    const local = localStorage.getItem('hc_users');
    return local ? JSON.parse(local) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const local = localStorage.getItem('hc_current_user');
    return local ? JSON.parse(local) : INITIAL_USERS[0]; // Admin by default for testing flexibility
  });

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const local = localStorage.getItem('hc_organizations');
    return local ? JSON.parse(local) : INITIAL_ORGANIZATIONS;
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const local = localStorage.getItem('hc_businesses');
    return local ? JSON.parse(local) : INITIAL_BUSINESSES;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const local = localStorage.getItem('hc_events');
    return local ? JSON.parse(local) : INITIAL_EVENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const local = localStorage.getItem('hc_announcements');
    return local ? JSON.parse(local) : INITIAL_ANNOUNCEMENTS;
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    const local = localStorage.getItem('hc_issues');
    return local ? JSON.parse(local) : INITIAL_ISSUES;
  });

  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const local = localStorage.getItem('hc_discussions');
    return local ? JSON.parse(local) : INITIAL_DISCUSSIONS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const local = localStorage.getItem('hc_comments');
    return local ? JSON.parse(local) : INITIAL_COMMENTS;
  });

  const [jobs, setJobs] = useState<JobOffer[]>(() => {
    const local = localStorage.getItem('hc_jobs');
    return local ? JSON.parse(local) : INITIAL_JOBS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const local = localStorage.getItem('hc_reports');
    return local ? JSON.parse(local) : INITIAL_REPORTS;
  });

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => {
    const local = localStorage.getItem('hc_campaigns');
    return local ? JSON.parse(local) : INITIAL_CAMPAIGNS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const local = localStorage.getItem('hc_audit_logs');
    return local ? JSON.parse(local) : INITIAL_AUDIT_LOG;
  });

  const [settings, setSettings] = useState<AppSetting>(() => {
    const local = localStorage.getItem('hc_settings');
    return local ? JSON.parse(local) : INITIAL_APP_SETTINGS;
  });

  const [notifications, setNotifications] = useState<any[]>(() => {
    const local = localStorage.getItem('hc_notifications');
    return local ? JSON.parse(local) : [
      {
        id: 'n-1',
        userId: 'u-1',
        text: 'Váš podnet "Hlboký výtlk" bol úspešne odoslaný mestu Hlohovec.',
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString(),
        link: '/podnety/i-2'
      },
      {
        id: 'n-2',
        userId: 'u-1',
        text: 'Mária Smreková pridala komentár k vašej diskusii.',
        type: 'comment',
        isRead: false,
        createdAt: new Date().toISOString(),
        link: '/diskusie/d-1'
      }
    ];
  });

  const [newsletterSubscribers, setNewsletterSubscribers] = useState<{ email: string; preferences: string[] }[]>(() => {
    const local = localStorage.getItem('hc_newsletter_subscribers');
    return local ? JSON.parse(local) : [
      { email: 'jozinko66@gmail.com', preferences: ['udalosti', 'oznamy'] },
      { email: 'peter.k@retrocafe.sk', preferences: ['reklama', 'udalosti'] }
    ];
  });

  // PWA & Connection states and effects
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If already launched in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstallPwa(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPwa = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted installation prompt');
      } else {
        console.log('[PWA] User dismissed installation prompt');
      }
      setDeferredPrompt(null);
      setCanInstallPwa(false);
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hc_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hc_organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('hc_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('hc_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('hc_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('hc_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('hc_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('hc_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('hc_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('hc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('hc_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('hc_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('hc_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('hc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('hc_newsletter_subscribers', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);


  // Helper: Switch Simulation Role
  const switchUserRole = (role: UserRole) => {
    let mockUser = INITIAL_USERS.find(u => u.role === role);
    if (!mockUser) {
      // Create a temporary simulated user for this role
      mockUser = {
        id: `sim-u-${role}`,
        email: `simulated.${role}@mojfrastak.sk`,
        name: `Simulovaný ${role === 'visitor' ? 'Návštevník' : role === 'registered' ? 'Registrovaný' : role === 'verified_citizen' ? 'Overený občan' : role === 'organization' ? 'Zástupca organizácie' : role === 'business' ? 'Podnikateľ' : role === 'moderator' ? 'Moderátor' : 'Administrátor'}`,
        role: role,
        verified: role !== 'registered' && role !== 'visitor',
        createdAt: new Date().toISOString(),
        bookmarks: [],
        followedDiscussions: [],
        followedEvents: [],
        registeredOrganizations: role === 'organization' ? ['org-2'] : [],
        registeredBusinesses: role === 'business' ? ['biz-1'] : []
      };
    }
    setCurrentUser(mockUser);
    addAuditLog('Zmena simulačnej roly', `Prihlásený pod rolou: ${role}`);
  };

  const addAuditLog = (action: string, details?: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotificationToUser = (userId: string, text: string, type: any, link?: string) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      text,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Events implementation
  const addEvent = (eventData: any) => {
    const newEvent: Event = {
      ...eventData,
      id: `e-${Date.now()}`,
      createdAt: new Date().toISOString(),
      interested: [],
      going: [],
      viewsCount: 0
    };
    setEvents(prev => [newEvent, ...prev]);
    addAuditLog('Vytvorenie udalosti', `Názov: "${newEvent.title}"`);
  };

  const editEvent = (eventId: string, updatedFields: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updatedFields } : e));
    addAuditLog('Úprava udalosti', `ID: ${eventId}`);
  };

  const toggleEventRSVP = (eventId: string, type: 'going' | 'interested') => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const list = type === 'going' ? [...e.going] : [...e.interested];
        const opposedList = type === 'going' ? [...e.interested] : [...e.going];
        
        const idx = list.indexOf(currentUser.id);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(currentUser.id);
          // Remove from the other list to stay mathematically consistent
          const oppIdx = opposedList.indexOf(currentUser.id);
          if (oppIdx > -1) {
            opposedList.splice(oppIdx, 1);
          }
        }
        
        return {
          ...e,
          going: type === 'going' ? list : opposedList,
          interested: type === 'interested' ? list : opposedList
        };
      }
      return e;
    }));
  };

  // 2. Announcements
  const addAnnouncement = (annData: any) => {
    const newAnn: Announcement = {
      ...annData,
      id: `a-${Date.now()}`,
      status: 'published',
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addAuditLog('Vytvorenie oznamu', `Názov: "${newAnn.title}"`);
    
    // Notify users about urgent announcements
    if (newAnn.importance === 'urgent') {
      users.forEach(u => {
        if (u.id !== currentUser.id) {
          addNotificationToUser(u.id, `Dôležitá výstraha: "${newAnn.title}" v lokalite ${newAnn.location}`, 'warning', `/oznamy/${newAnn.id}`);
        }
      });
    }
  };

  const editAnnouncement = (annId: string, updatedFields: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === annId ? { ...a, ...updatedFields } : a));
    addAuditLog('Úprava oznamu', `ID: ${annId}`);
  };

  // 3. Issues
  const addIssue = (issueData: any) => {
    const newIssue: Issue = {
      ...issueData,
      id: `i-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Nový',
      supporters: [currentUser.id],
      history: [
        {
          status: 'Nový',
          note: 'Podnet bol podaný občanom a zaregistrovaný v systéme.',
          date: new Date().toISOString(),
          changedBy: currentUser.name
        }
      ]
    };
    setIssues(prev => [newIssue, ...prev]);
    addAuditLog('Nahlásenie podnetu', `Problém: "${newIssue.title}"`);
    
    // Notify admins
    users.filter(u => u.role === 'admin' || u.role === 'moderator').forEach(adm => {
      addNotificationToUser(adm.id, `Nový občiansky podnet: "${newIssue.title}" v kategórii ${newIssue.category}`, 'info', `/podnety/${newIssue.id}`);
    });
  };

  const supportIssue = (issueId: string) => {
    setIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        const hasSupported = i.supporters.includes(currentUser.id);
        const nextSupporters = hasSupported 
          ? i.supporters.filter(id => id !== currentUser.id)
          : [...i.supporters, currentUser.id];
        return { ...i, supporters: nextSupporters };
      }
      return i;
    }));
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus, note: string) => {
    setIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        const newEntry = {
          status,
          note,
          date: new Date().toISOString(),
          changedBy: currentUser.name
        };
        
        // Notify author
        if (i.authorId !== currentUser.id) {
          addNotificationToUser(
            i.authorId, 
            `Váš podnet "${i.title}" zmenil stav na: "${status}"`, 
            status === 'Vyriešený' ? 'success' : 'info', 
            `/podnety/${i.id}`
          );
        }

        return {
          ...i,
          status,
          history: [...i.history, newEntry]
        };
      }
      return i;
    }));
    addAuditLog('Zmena stavu podnetu', `ID: ${issueId} -> ${status}`);
  };

  // 4. Discussions
  const addDiscussion = (discData: any) => {
    const newDisc: Discussion = {
      ...discData,
      id: `d-${Date.now()}`,
      status: 'published',
      createdAt: new Date().toISOString(),
      reactions: {
        suhlasim: [],
        nesuhlasim: [],
        uzitocne: [],
        vysvetlenie: [],
        podporujem: []
      }
    };
    setDiscussions(prev => [newDisc, ...prev]);
    addAuditLog('Založenie diskusie', `Téma: "${newDisc.title}"`);
  };

  const toggleDiscussionReaction = (discId: string, type: 'suhlasim' | 'nesuhlasim' | 'uzitocne' | 'vysvetlenie' | 'podporujem') => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        const reactionsCopy = { ...d.reactions };
        const list = [...reactionsCopy[type]];
        const idx = list.indexOf(currentUser.id);
        
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(currentUser.id);
        }
        
        reactionsCopy[type] = list;
        return { ...d, reactions: reactionsCopy };
      }
      return d;
    }));
  };

  const lockDiscussion = (discId: string, locked: boolean) => {
    setDiscussions(prev => prev.map(d => d.id === discId ? { ...d, status: locked ? 'locked' : 'published' } : d));
    addAuditLog(locked ? 'Uzamknutie diskusie' : 'Odomknutie diskusie', `ID: ${discId}`);
  };

  const pinDiscussion = (discId: string, pinned: boolean) => {
    setDiscussions(prev => prev.map(d => d.id === discId ? { ...d, status: pinned ? 'pinned' : 'published' } : d));
    addAuditLog(pinned ? 'Pripnutie diskusie' : 'Odopnutie diskusie', `ID: ${discId}`);
  };

  // 5. Comments
  const addComment = (commentData: any) => {
    const newComment: Comment = {
      ...commentData,
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      createdAt: new Date().toISOString(),
      reactions: { like: [], dislike: [] }
    };
    setComments(prev => [...prev, newComment]);

    // Handle nested replies notification
    if (newComment.parentId) {
      const parentComment = comments.find(c => c.id === newComment.parentId);
      if (parentComment && parentComment.authorId !== currentUser.id) {
        addNotificationToUser(
          parentComment.authorId, 
          `Používateľ ${currentUser.name} odpovedal na váš komentár v diskusii.`, 
          'comment', 
          `/diskusie/${newComment.entityId}`
        );
      }
    } else {
      // Notify original post author
      if (newComment.entityType === 'discussion') {
        const disc = discussions.find(d => d.id === newComment.entityId);
        if (disc && disc.authorId !== currentUser.id) {
          addNotificationToUser(
            disc.authorId, 
            `Zaregistrovaný nový príspevok od ${currentUser.name} vo vašej téme.`, 
            'comment', 
            `/diskusie/${newComment.entityId}`
          );
        }
      }
    }
  };

  const toggleCommentReaction = (commentId: string, type: 'like' | 'dislike') => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const rx = c.reactions ? { ...c.reactions } : { like: [], dislike: [] };
        const list = type === 'like' ? [...rx.like] : [...rx.dislike];
        const oppositeList = type === 'like' ? [...rx.dislike] : [...rx.like];
        
        const idx = list.indexOf(currentUser.id);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(currentUser.id);
          const oppIdx = oppositeList.indexOf(currentUser.id);
          if (oppIdx > -1) {
            oppositeList.splice(oppIdx, 1);
          }
        }
        
        return {
          ...c,
          reactions: {
            like: type === 'like' ? list : oppositeList,
            dislike: type === 'dislike' ? list : oppositeList
          }
        };
      }
      return c;
    }));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    addAuditLog('Odstránenie komentára', `ID: ${commentId}`);
  };

  // 6. Businesses & Packages
  const addBusiness = (bizData: any) => {
    const newBiz: Business = {
      ...bizData,
      id: `biz-${Date.now()}`,
      viewsCount: 0,
      clicksCount: 0,
      verified: false,
      admins: [currentUser.id]
    };
    setBusinesses(prev => [...prev, newBiz]);
    addAuditLog('Registrácia firmy', `Názov: "${newBiz.name}"`);
  };

  const updateBusinessPackage = (bizId: string, plan: BusinessPackage, durationMonths: number) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        const expires = new Date();
        expires.setMonth(expires.getMonth() + durationMonths);
        return {
          ...b,
          plan,
          planExpiresAt: expires.toISOString()
        };
      }
      return b;
    }));
    addAuditLog('Zmena balíka pre firmu', `Firma ID: ${bizId} -> Balík: ${plan}`);
  };

  const incrementBusinessStats = (bizId: string, type: 'view' | 'click') => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        return {
          ...b,
          viewsCount: type === 'view' ? b.viewsCount + 1 : b.viewsCount,
          clicksCount: type === 'click' ? b.clicksCount + 1 : b.clicksCount
        };
      }
      return b;
    }));
  };

  const verifyBusiness = (bizId: string, verified: boolean) => {
    setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, verified } : b));
    addAuditLog(verified ? 'Overenie firmy' : 'Zrušenie overenia firmy', `ID: ${bizId}`);
  };

  // 7. Verification Workflows for Orgs
  const requestVerification = (orgId: string) => {
    setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, verified: false } : o));
    addAuditLog('Žiadosť o overenie organizácie', `Org ID: ${orgId}`);
  };

  const approveVerification = (orgId: string, approve: boolean) => {
    setOrganizations(prev => prev.map(o => o.id === orgId ? { 
      ...o, 
      verified: approve,
      verifiedAt: approve ? new Date().toISOString() : undefined
    } : o));
    addAuditLog(approve ? 'Overenie schválené' : 'Overenie zamietnuté', `Org ID: ${orgId}`);
    
    // Notify administrators
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      org.admins.forEach(admId => {
        addNotificationToUser(
          admId, 
          approve ? `Vaša organizácia "${org.name}" získala overený profil!` : `Žiadosť o overenie organizácie "${org.name}" bola zamietnutá.`, 
          approve ? 'success' : 'warning', 
          `/organizacie/${org.id}`
        );
      });
    }
  };

  // 8. Jobs
  const addJobOffer = (jobData: any, isSponsored: boolean) => {
    const newJob: JobOffer = {
      ...jobData,
      id: `j-${Date.now()}`,
      status: 'active',
      isSponsored,
      createdAt: new Date().toISOString()
    };
    setJobs(prev => [newJob, ...prev]);
    addAuditLog('Uverejnenie pracovnej ponuky', `Práca: "${newJob.title}"`);
  };

  const archiveJobOffer = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'archived' } : j));
    addAuditLog('Archivácia pracovnej ponuky', `ID: ${jobId}`);
  };

  // 9. Reporting (Offensive contents)
  const addReport = (contentType: any, contentId: string, reason: any, note: string) => {
    const contentSnap = comments.find(c => c.id === contentId)?.text 
      || discussions.find(d => d.id === contentId)?.text 
      || events.find(e => e.id === contentId)?.shortDesc 
      || issues.find(i => i.id === contentId)?.description
      || '';

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      contentType,
      contentId,
      contentSnapshot: contentSnap.substring(0, 100) + '...',
      reason,
      note,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);
    addAuditLog('Nahlásenie obsahu', `Typ: ${contentType}, Dôvod: ${reason}`);

    // Notify moderators/admins
    users.filter(u => u.role === 'admin' || u.role === 'moderator').forEach(mod => {
      addNotificationToUser(mod.id, `Nové nahlásenie porušenia pravidiel: ${reason}`, 'warning', '/admin/hlasenia');
    });
  };

  const resolveReport = (reportId: string, action: 'none' | 'hidden' | 'warned' | 'blocked', feedback: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { 
      ...r, 
      status: action === 'none' ? 'rejected' : 'resolved', 
      resolvedBy: currentUser.name,
      actionTaken: action
    } : r));

    const repEntry = reports.find(r => r.id === reportId);
    if (!repEntry) return;

    if (action === 'hidden') {
      // Hide actual item based on contentType
      if (repEntry.contentType === 'comment') {
        setComments(prev => prev.filter(c => c.id !== repEntry.contentId));
      } else if (repEntry.contentType === 'discussion') {
        setDiscussions(prev => prev.map(d => d.id === repEntry.contentId ? { ...d, status: 'hidden' } : d));
      } else if (repEntry.contentType === 'event') {
        setEvents(prev => prev.map(e => e.id === repEntry.contentId ? { ...e, status: 'hidden' } : e));
      }
    }

    // Notify reporter
    addNotificationToUser(
      repEntry.reporterId, 
      `Vaše nahlásenie zo dňa ${new Date(repEntry.createdAt).toLocaleDateString()} bolo preskúmané a vyriešené.`, 
      'success'
    );

    addAuditLog('Vyriešenie nahlásenia', `Report ID: ${reportId}, Čin: ${action}`);
  };

  // 10. Newsletter enrollment
  const subscribeNewsletter = (email: string, preferences: string[]): boolean => {
    const exists = newsletterSubscribers.some(ns => ns.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setNewsletterSubscribers(prev => prev.map(ns => ns.email.toLowerCase() === email.toLowerCase() ? { ...ns, preferences } : ns));
      return true;
    } else {
      setNewsletterSubscribers(prev => [...prev, { email, preferences }]);
      return false;
    }
  };

  // 11. Monetization Ad campaigns
  const createAdCampaign = (campData: any) => {
    const newCamp: AdCampaign = {
      ...campData,
      id: `ad-${Date.now()}`,
      status: 'active',
      views: 0,
      clicks: 0
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addAuditLog('Spustenie reklamnej kampane', `ID: ${newCamp.title}`);
  };

  const incrementAdStats = (campId: string, type: 'view' | 'click') => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campId) {
        return {
          ...c,
          views: type === 'view' ? c.views + 1 : c.views,
          clicks: type === 'click' ? c.clicks + 1 : c.clicks
        };
      }
      return c;
    }));
  };

  // 12. Settings Adjustment
  const updateAppSettings = (newSettingsFields: Partial<AppSetting>) => {
    setSettings(prev => ({ ...prev, ...newSettingsFields }));
    addAuditLog('Zmena sieťových nastavení', JSON.stringify(newSettingsFields));
  };

  // notifications and utilities
  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      users,
      currentUser,
      setCurrentUser,
      organizations,
      businesses,
      events,
      announcements,
      issues,
      discussions,
      comments,
      jobs,
      reports,
      campaigns,
      auditLogs,
      settings,
      notifications: notifications.filter(n => n.userId === currentUser.id),
      newsletterSubscribers,
      
      switchUserRole,
      addEvent,
      editEvent,
      toggleEventRSVP,
      
      addAnnouncement,
      editAnnouncement,
      
      addIssue,
      supportIssue,
      updateIssueStatus,
      
      addDiscussion,
      toggleDiscussionReaction,
      lockDiscussion,
      pinDiscussion,
      
      addComment,
      toggleCommentReaction,
      deleteComment,
      
      addBusiness,
      updateBusinessPackage,
      incrementBusinessStats,
      verifyBusiness,

      requestVerification,
      approveVerification,
      
      addJobOffer,
      archiveJobOffer,
      
      addReport,
      resolveReport,
      
      subscribeNewsletter,
      createAdCampaign,
      incrementAdStats,
      
      updateAppSettings,
      addAuditLog,
      
      addNotificationToUser,
      markNotificationsAsRead,
      clearNotification,
      
      isOffline,
      canInstallPwa,
      installPwa
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
