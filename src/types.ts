/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'visitor' 
  | 'registered' 
  | 'verified_citizen' 
  | 'organization' 
  | 'business' 
  | 'moderator' 
  | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  bookmarks: string[]; // IDs of events, issues, discussions, jobs
  followedDiscussions: string[];
  followedEvents: string[];
  registeredOrganizations: string[]; // Admin of these orgs
  registeredBusinesses: string[]; // Admin of these businesses
}

export type EventCategory = 
  | 'Kultúra'
  | 'Šport'
  | 'Deti a rodiny'
  | 'Seniori'
  | 'Vzdelávanie'
  | 'Hudba'
  | 'Trhy'
  | 'Dobrovoľníctvo'
  | 'Mesto'
  | 'Komunita'
  | 'Gastronómia'
  | 'Iné';

export type EventStatus = 'draft' | 'pending' | 'published' | 'rejected' | 'archived' | 'hidden';

export interface Event {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endDate?: string;
  location: string; // Lokalita
  address: string;
  coordinates: { x: number; y: number }; // Simulated percentage-based coordinates for local map
  image: string;
  organizerId: string; // User ID or Organization ID
  organizerType: 'user' | 'organization';
  price: number;
  isFree: boolean;
  regUrl?: string;
  contact: string;
  status: EventStatus;
  createdAt: string;
  interested: string[]; // User IDs
  going: string[]; // User IDs
  viewsCount: number;
  isSponsored?: boolean;
  officialUrl?: string;
}

export type AnnouncementCategory = 
  | 'Odstávky'
  | 'Doprava'
  | 'Uzávierky'
  | 'Odpad'
  | 'Mestský úrad'
  | 'Školy'
  | 'Bezpečnosť'
  | 'Počasie'
  | 'Mimoriadne udalosti'
  | 'Iné';

export type AnnouncementType = 
  | 'Oficiálny oznam'
  | 'Informácia organizátora'
  | 'Komunitný oznam'
  | 'Neoverená informácia';

export type AnnouncementImportance = 'normal' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  shortDesc: string;
  fullText: string;
  category: AnnouncementCategory;
  type: AnnouncementType;
  importance: AnnouncementImportance;
  location: string; // Lokalita
  startDate: string;
  endDate?: string;
  image?: string;
  authorId: string;
  authorName: string;
  status: 'published' | 'archived' | 'draft';
  createdAt: string;
  officialUrl?: string;
}

export type IssueCategory = 
  | 'Cesta'
  | 'Chodník'
  | 'Osvetlenie'
  | 'Odpad'
  | 'Zeleň'
  | 'Parkovanie'
  | 'Doprava'
  | 'Ihriská'
  | 'Mestský majetok'
  | 'Bezpečnosť'
  | 'Hluk'
  | 'Zvieratá'
  | 'Iné';

export type IssueStatus = 
  | 'Nový'
  | 'Overuje sa'
  | 'Odoslaný mestu'
  | 'Rieši sa'
  | 'Vyriešený'
  | 'Zamietnutý'
  | 'Bez reakcie';

export interface StatusHistoryEntry {
  status: IssueStatus;
  note: string;
  date: string;
  changedBy: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  image: string;
  location: string; // Location name
  privateLocation?: string; // Exact non-public location
  coordinates: { x: number; y: number };
  authorId: string;
  authorName: string;
  status: IssueStatus;
  supporters: string[]; // User IDs
  createdAt: string;
  history: StatusHistoryEntry[];
}

export type DiscussionCategory = 
  | 'Mesto a samospráva'
  | 'Doprava a parkovanie'
  | 'Výstavba a rozvoj'
  | 'Kultúra'
  | 'Šport'
  | 'Školy a škôlky'
  | 'Rodiny a deti'
  | 'Seniori'
  | 'Bezpečnosť'
  | 'Životné prostredie'
  | 'Podnikanie'
  | 'História mesta'
  | 'Šulekovo'
  | 'Návrhy občanov'
  | 'Voľná diskusia';

export type DiscussionType = 'Názor' | 'Otázka' | 'Návrh' | 'Problém';

export interface Discussion {
  id: string;
  title: string;
  text: string;
  category: DiscussionCategory;
  type: DiscussionType;
  image?: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  status: 'published' | 'pinned' | 'locked' | 'hidden';
  createdAt: string;
  reactions: {
    suhlasim: string[]; // User IDs
    nesuhlasim: string[];
    uzitocne: string[];
    vysvetlenie: string[];
    podporujem: string[];
  };
}

export interface Comment {
  id: string;
  entityType: 'event' | 'issue' | 'discussion';
  entityId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  createdAt: string;
  parentId?: string; // High quality 2-level comment nesting
  reactions?: {
    like: string[];
    dislike: string[];
  };
}

export type OrgType = 
  | 'mesto'
  | 'mestské organizácie'
  | 'škola'
  | 'škôlka'
  | 'športový klub'
  | 'kultúrna organizácia'
  | 'občianske združenie'
  | 'organizátor'
  | 'poslanec';

export interface Organization {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  type: OrgType;
  address: string;
  contact: string;
  website: string;
  socials: { fb?: string; ig?: string };
  admins: string[]; // User IDs
  verified: boolean;
  verifiedAt?: string;
}

export type BusinessPackage = 'bezplatny' | 'start' | 'lokal' | 'partner' | 'hlavny';

export type BusinessCategory = 
  | 'Reštaurácie a kaviarne'
  | 'Obchody'
  | 'Remeselníci'
  | 'Autoservisy'
  | 'Zdravie'
  | 'Krása'
  | 'Šport a fitness'
  | 'Deti a vzdelávanie'
  | 'Reality'
  | 'Právne a účtovné služby'
  | 'Ubytovanie'
  | 'Doprava'
  | 'Ostatné služby';

export interface Business {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  category: BusinessCategory;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
  services: string[];
  plan: BusinessPackage;
  planExpiresAt?: string;
  viewsCount: number;
  clicksCount: number;
  verified: boolean;
  admins: string[];
}

export type JobType = 
  | 'Trvalý pracovný pomer'
  | 'Dohoda'
  | 'Brigáda'
  | 'Živnosť'
  | 'Skrátený úväzok'
  | 'Sezónna práca'
  | 'Stáž';

export interface JobOffer {
  id: string;
  title: string;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  location: string;
  type: JobType;
  salary: string; // Slovak € format e.g. "1 200 € - 1 500 €"
  description: string;
  requirements: string;
  benefits: string;
  contact: string;
  expiresAt: string;
  isSponsored: boolean;
  createdAt: string;
  status: 'active' | 'archived';
}

export type ReportReason = 
  | 'Spam'
  | 'Vulgarizmy'
  | 'Osobný útok'
  | 'Nenávistný obsah'
  | 'Zavádzajúce informácie'
  | 'Osobné údaje'
  | 'Nevyžiadaná reklama'
  | 'Porušenie autorských práv'
  | 'Iný dôvod';

export interface Report {
  id: string;
  contentType: 'comment' | 'discussion' | 'event' | 'issue';
  contentId: string;
  contentSnapshot: string; // For moderator preview
  reason: ReportReason;
  note: string;
  reporterId: string;
  reporterName: string;
  status: 'new' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedBy?: string;
  actionTaken?: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'comment' | 'report';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  preferences: string[]; // Categorical tags selected or "vsetko"
  consentGranted: boolean;
  createdAt: string;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent';
  sentAt?: string;
  audienceCount?: number;
}

export type AdFormat = 
  | 'partner_tyzdna' 
  | 'sponzorovana_karta' 
  | 'zvyraznena_udalost' 
  | 'zvyrazneny_profil' 
  | 'zvyraznena_ponuka';

export interface AdCampaign {
  id: string;
  title: string;
  businessId: string;
  businessName: string;
  format: AdFormat;
  image: string;
  text: string;
  link: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'ended';
  views: number;
  clicks: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface AppSetting {
  id: string;
  registrationEnabled: boolean;
  autoApproveEvents: boolean;
  autoApproveAnnouncements: boolean;
  filterSwearWords: boolean;
  contactEmail: string;
}
