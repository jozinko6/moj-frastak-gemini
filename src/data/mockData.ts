/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  AppSetting
} from '../types';

export const INITIAL_LOCATIONS = [
  'Hlohovec – centrum',
  'Sihoť',
  'Nová štvrť',
  'Peter',
  'Šulekovo',
  'Hlohovec – ostatné',
  'Leopoldov',
  'Červeník',
  'Okolie Hlohovca'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    email: 'jozinko66@gmail.com',
    name: 'Jozef Kováč',
    bio: 'Rodák z Hlohovca, nadšenec pre mestskú zeleň a poriadok vo verejnom priestore.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    verified: true,
    createdAt: '2026-01-10T11:22:00Z',
    bookmarks: ['e-1', 'i-2'],
    followedDiscussions: ['d-1'],
    followedEvents: ['e-1'],
    registeredOrganizations: ['org-1'],
    registeredBusinesses: ['biz-1']
  },
  {
    id: 'u-2',
    email: 'maria.smrekova@hlohovec.sk',
    name: 'Mária Smreková',
    bio: 'Hovorkyňa mesta Hlohovec a koordinátorka mestských komunitných projektov.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'organization',
    verified: true,
    createdAt: '2026-02-14T08:30:00Z',
    bookmarks: [],
    followedDiscussions: ['d-1', 'd-3'],
    followedEvents: [],
    registeredOrganizations: ['org-1'],
    registeredBusinesses: []
  },
  {
    id: 'u-3',
    email: 'peter.k@retrocafe.sk',
    name: 'Peter Kollár',
    bio: 'Prevádzkar Retro Café na pešej zóne. Milovník dobrej kávy a kultúrnych podujatí.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'business',
    verified: true,
    createdAt: '2026-03-01T15:10:00Z',
    bookmarks: [],
    followedDiscussions: [],
    followedEvents: [],
    registeredOrganizations: [],
    registeredBusinesses: ['biz-1']
  },
  {
    id: 'u-4',
    email: 'milos.stana@gmail.com',
    name: 'Miloš Staňa',
    bio: 'Aktívny občan a obyvateľ mestskej časti Šulekovo. Bývalý člen futbalového tímu.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'verified_citizen',
    verified: true,
    createdAt: '2026-04-12T19:05:00Z',
    bookmarks: ['i-1', 'i-3'],
    followedDiscussions: ['d-2'],
    followedEvents: [],
    registeredOrganizations: [],
    registeredBusinesses: []
  },
  {
    id: 'u-5',
    email: 'elena.v@centrum.sk',
    name: 'Elena Valachová',
    bio: 'Učiteľka na základnej škole v Hlohovci, zameraná na voľnočasové aktivity detí.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    role: 'moderator',
    verified: true,
    createdAt: '2026-02-28T09:44:00Z',
    bookmarks: [],
    followedDiscussions: [],
    followedEvents: [],
    registeredOrganizations: [],
    registeredBusinesses: []
  },
  {
    id: 'u-6',
    email: 'bezec88@hlohovec.sk',
    name: 'Lukáš Hrušovský',
    bio: 'Amatérsky športovec, zakladateľ bežeckého klubu Hlohovec.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    role: 'registered',
    verified: false,
    createdAt: '2026-05-18T10:14:00Z',
    bookmarks: [],
    followedDiscussions: [],
    followedEvents: [],
    registeredOrganizations: [],
    registeredBusinesses: []
  }
];

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Mesto Hlohovec',
    logo: 'https://images.unsplash.com/photo-1599305445671-ec2c6c64a6d5?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    description: 'Oficiálny profil samosprávy mesta Hlohovec. Zverejňujeme oznamy, dôležité výpadky a koordinujeme podnety občanov.',
    type: 'mesto',
    address: 'M. R. Štefánika 1, 920 01 Hlohovec',
    contact: '+421 33 736 8111, info@hlohovec.sk',
    website: 'https://www.hlohovec.sk',
    socials: { fb: 'https://facebook.com/mestohlohovec', ig: 'https://instagram.com/mestohlohovec' },
    admins: ['u-2'],
    verified: true,
    verifiedAt: '2026-02-15T12:00:00Z'
  },
  {
    id: 'org-2',
    name: 'Mestské kultúrne centrum Hlohovec (MKC)',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    description: 'Zabezpečujeme kultúrne podujatia, divadlo, koncerty, kino a historické akcie v meste Hlohovec.',
    type: 'mestské organizácie',
    address: 'Námestie sv. Michala 3, 920 01 Hlohovec',
    contact: '+421 33 730 1451, riaditel@mkc.sk',
    website: 'https://www.mkc.sk',
    socials: { fb: 'https://facebook.com/mkchlohovec' },
    admins: ['u-2'],
    verified: true,
    verifiedAt: '2026-02-20T10:30:00Z'
  },
  {
    id: 'org-3',
    name: 'Športový klub Slovan Hlohovec',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    description: 'Miestny futbalový a športový klub s bohatou tradíciou venujúci sa výchove mládeže a reprezentácii mesta.',
    type: 'športový klub',
    address: 'Zámocká 2, 920 01 Hlohovec',
    contact: 'sekretariat@slovánhlohovec.sk',
    website: 'https://www.slovánhlohovec.sk',
    socials: { fb: 'https://facebook.com/sk-slovan-hlohovec' },
    admins: ['u-6'],
    verified: true,
    verifiedAt: '2026-05-20T14:15:00Z'
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    name: 'Retro Café & Bistro',
    logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1000&q=80',
    description: 'Štýlová kaviareň a bistro priamo v centre Hlohovca. Ponúkame výberovú kávu, domáce koláče, fresh limonády a čerstvé teplé pannini. Miesto pre vaše stretnutia, prácu a komunitné večery.',
    category: 'Reštaurácie a kaviarne',
    address: 'Námestie sv. Michala 12, 920 01 Hlohovec',
    phone: '+421 905 123 456',
    email: 'info@retrocafe-hc.sk',
    website: 'https://www.retrocafe-hc.sk',
    openingHours: 'Po - Pia: 07:30 - 21:00, So - Ne: 09:00 - 22:00',
    services: ['Wi-Fi zdarma', 'Terasa', 'Detský kútik', 'Bezbariérový prístup', 'Platba kartou'],
    plan: 'partner',
    planExpiresAt: '2026-12-31T23:59:59Z',
    viewsCount: 342,
    clicksCount: 89,
    verified: true,
    admins: ['u-3']
  },
  {
    id: 'biz-2',
    name: 'Stavby a Remeslo – Peter Blaško',
    logo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1000&q=80',
    description: 'Miestny rodinný podnik s 15-ročnou tradíciou. Zameriavame sa na profesionálne rekonštrukcie bytov, murárske a sadrokartonárske práce, pokládku podláh a montáž okien pre rodiny v Hlohovci, Leopoldove a okolí.',
    category: 'Remeselníci',
    address: 'Jesenského 45, 920 01 Hlohovec',
    phone: '+421 911 334 556',
    email: 'blasko.remeslo@gmail.com',
    website: '',
    openingHours: 'Po - Pia: 08:00 - 17:00',
    services: ['Bezplatná cenová ponuka', 'Záruka na prácu', 'Odvoz odpadu'],
    plan: 'start',
    planExpiresAt: '2026-08-15T23:59:59Z',
    viewsCount: 120,
    clicksCount: 22,
    verified: true,
    admins: ['u-4']
  },
  {
    id: 'biz-3',
    name: 'Pekáreň Šulekovo',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    description: 'Tradičná remeselná pekáreň v Šulekove. Pečieme čerstvý kváskový chlieb, chrumkavé pečivo, moravské koláče a tradičné hlohovecké rožky podľa starej receptúry.',
    category: 'Obchody',
    address: 'Šulekovská 54, 920 03 Hlohovec – Šulekovo',
    phone: '+421 33 733 1122',
    email: 'pekar@pekaresulekovo.sk',
    website: 'https://www.pekaresulekovo.sk',
    openingHours: 'Po - Pia: 05:00 - 18:00, So: 05:00 - 11:00',
    services: ['Tradičná receptúra', 'Lokálne suroviny', 'Platba kartou'],
    plan: 'lokal',
    planExpiresAt: '2026-10-20T23:59:59Z',
    viewsCount: 215,
    clicksCount: 47,
    verified: true,
    admins: ['u-4']
  },
  {
    id: 'biz-4',
    name: 'Najlepšie Reality Hlohovec, s.r.o.',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&h=150&q=80',
    banner: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
    description: 'Komplexný realitný servis v regióne Hlohovec. Zabezpečíme pre vás bezpečný predaj, kúpu alebo prenájom nehnuteľností, právny servis a financovanie.',
    category: 'Reality',
    address: 'M. R. Štefánika 18, 920 01 Hlohovec',
    phone: '+421 948 999 888',
    email: 'info@realityhc.sk',
    website: 'https://www.realityhc.sk',
    openingHours: 'Po - Pia: 09:00 - 17:00 (alebo podľa dohody)',
    services: ['Právny servis v cene', 'Bezplatný odhad ceny', 'Hypotekárna poradňa'],
    plan: 'bezplatny',
    planExpiresAt: undefined,
    viewsCount: 45,
    clicksCount: 6,
    verified: false,
    admins: []
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'e-1',
    title: 'Letný jazzový koncert v Zámockej záhrade',
    shortDesc: 'Uvoľnené letné popoludnie s jazzovou a bluesovou hudbou v malebnom prostredí zámockého parku.',
    longDesc: 'Mestské kultúrne centrum vás pozýva na tretí ročník Letného jazzového festivalu "Jazzový Fraštak". Predstavia sa špičkoví slovenskí aj zahraniční hudobníci. Pre návštevníkov bude pripravená pekná chill-out zóna, lokálne vína, remeselné pivá a domáce občerstvenie. Vezmite si deky, rodinu a priateľov a vychutnajte si príjemné popoludnie a večer pod hviezdami. V prípade nepriaznivého počasia sa udalosť presúva do Empírového divadla.',
    category: 'Hudba',
    startDate: '2026-06-20',
    startTime: '17:00',
    endDate: '2026-06-20',
    location: 'Sihoť',
    address: 'Zámocká záhrada (plató pri jazierku), 920 01 Hlohovec',
    coordinates: { x: 58, y: 34 },
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80',
    organizerId: 'org-2',
    organizerType: 'organization',
    price: 5,
    isFree: false,
    regUrl: 'https://www.mkc.sk/vstupenky',
    contact: 'hudba@mkc.sk, +421 33 730 1451',
    status: 'published',
    createdAt: '2026-05-15T09:00:00Z',
    interested: ['u-4', 'u-6'],
    going: ['u-1', 'u-3'],
    viewsCount: 412,
    isSponsored: true,
    officialUrl: 'https://www.hlohovec.sk/kultura.html'
  },
  {
    id: 'e-2',
    title: 'Detské bábkové divadlo: Ružová rozprávka',
    shortDesc: 'Milé bábkové predstavenie pre najmenšie deti v historickom Empírovom divadle.',
    longDesc: 'Pozývame všetkých rodičov, starých rodičov a najmä deti od 3 rokov na autorské bábkové predstavenie plné pesničiek, humoru a farebných marionet. Rozprávka hovorí o dôležitosti kamarátstva, pomoci slabším a o tom, že s úsmevom ide všetko ľahšie. Predstavenie trvá približne 45 minút, po ňom nasleduje malý workshop s bábkovodičmi, kde si deti môžu bábky vyskúšať.',
    category: 'Deti a rodiny',
    startDate: '2026-06-21',
    startTime: '15:30',
    endDate: '2026-06-21',
    location: 'Hlohovec – centrum',
    address: 'Empírové divadlo HC, Zámocká 3, 920 01 Hlohovec',
    coordinates: { x: 60, y: 31 },
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    organizerId: 'org-2',
    organizerType: 'organization',
    price: 3,
    isFree: false,
    regUrl: '',
    contact: 'vstupenky@mkc.sk',
    status: 'published',
    createdAt: '2026-05-20T10:15:00Z',
    interested: ['u-1'],
    going: ['u-5'],
    viewsCount: 180,
    officialUrl: 'https://www.hlohovec.sk/kultura.html'
  },
  {
    id: 'e-3',
    title: 'Tradičný Hlohovecký farmársky jarmok',
    shortDesc: 'Predaj čerstvých lokálnych potravín, ovocia, poctivých syrov a ručne vyrobených remeselných výrobkov.',
    longDesc: 'Príďte podporiť lokálnych farmárov a remeselníkov! Na pešej zóne v Hlohovci nájdete stánky s čerstvou sezónnou zeleninou z okolitých záhrad, domáci med, ovčie syry zo slovenskej farmy, domáci kváskový chlieb, bylinkové čaje, drevené hračky, ručne šité tašky a keramiku. Súčasťou trhov bude aj vystúpenie hlohoveckých detských folklórnych súborov a ukážka tradičných techník pletenia prútia.',
    category: 'Trhy',
    startDate: '2026-06-25',
    startTime: '08:00',
    endDate: '2026-06-25',
    location: 'Hlohovec – centrum',
    address: 'Pešia zóna, Námestie sv. Michala, 920 01 Hlohovec',
    coordinates: { x: 45, y: 45 },
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80',
    organizerId: 'org-1',
    organizerType: 'organization',
    price: 0,
    isFree: true,
    regUrl: '',
    contact: 'trhy@hlohovec.sk',
    status: 'published',
    createdAt: '2026-05-22T08:00:00Z',
    interested: ['u-3', 'u-5'],
    going: ['u-1', 'u-4'],
    viewsCount: 520,
    officialUrl: 'https://www.hlohovec.sk/oznamy/tradicny-hlohovsky-jarmok.html'
  },
  {
    id: 'e-4',
    title: 'Fraštacký charitatívny beh za zdravie a pomoc rodinám',
    shortDesc: 'Bežecké podujatie pre každého – deti, dospelých aj seniorov, s cieľom pomôcť rodinám v núdzi.',
    longDesc: 'Športový klub Slovan spolu s komunitnými dobrovoľníkmi organizuje Charitatívny beh. Beží sa po krásnej asfaltovej trase pozdĺž rieky Váh. Trasy: detská (400 m), hobby (3 km) and hlavný beh (8 km). Celé štartovné bude venované trom vybraným hlohoveckým rodinám s telesne znevýhodnenými deťmi na úhradu rehabilitácií. Každý bežec dostane štartovné číslo, pamätnú medailu a občerstvenie v cieli. Príďte urobiť niečo pre svoje zdravie a dobrú vec!',
    category: 'Dobrovoľníctvo',
    startDate: '2026-06-28',
    startTime: '09:00',
    endDate: '2026-06-28',
    location: 'Sihoť',
    address: 'Hrádza pri Váhu (štart pri kine Úsmev), 920 01 Hlohovec',
    coordinates: { x: 34, y: 65 },
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=1000&q=80',
    organizerId: 'org-3',
    organizerType: 'organization',
    price: 10,
    isFree: false,
    regUrl: 'https://www.slovánhlohovec.sk/beh',
    contact: 'beh@slovanhc.sk, +421 908 444 333',
    status: 'published',
    createdAt: '2026-05-28T14:00:00Z',
    interested: ['u-1', 'u-4', 'u-5'],
    going: ['u-6'],
    viewsCount: 388,
    officialUrl: 'https://www.hlohovec.sk/kultura-a-sport.html'
  },
  {
    id: 'e-5',
    title: 'Večer spoločenských hier v Retro Café',
    shortDesc: 'Príjemný komunitný večer pre milovníkov stolových hier rôzneho druhu.',
    longDesc: 'Baví ťa Carcassonne, Catan, Krycie mená, Dixit alebo chceš ochutnať náročnejšie moderné doskovky? Príď sám alebo s partiou do Retro Café. Máme pripravených vyše 30 populárnych hier a skúsených vysvetľovačov pravidiel, takže sa nemusíš báť siahnuť aj po niečom novom. Skvelá káva, čaj, pivko a príjemná priateľská atmosféra sú zaručené. Vstup je úplne voľný.',
    category: 'Komunita',
    startDate: '2026-06-18',
    startTime: '18:00',
    endDate: '2026-06-18',
    location: 'Hlohovec – centrum',
    address: 'Retro Café, Námestie sv. Michala 12, 920 01 Hlohovec',
    coordinates: { x: 45, y: 46 },
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1000&q=80',
    organizerId: 'biz-1',
    organizerType: 'user',
    price: 0,
    isFree: true,
    regUrl: '',
    contact: 'info@retrocafe-hc.sk',
    status: 'published',
    createdAt: '2026-06-10T11:00:00Z',
    interested: ['u-1', 'u-5'],
    going: ['u-3', 'u-4'],
    viewsCount: 115,
    officialUrl: 'https://www.hlohovec.sk'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a-1',
    title: 'Plánovaná odstávka pitnej vody – ulica Jesenského a Bernolákova',
    shortDesc: 'Z dôvodu rekonštrukcie vodovodného potrubia bude dňa 23. júna prerušená dodávka pitnej vody.',
    fullText: 'Západoslovenská vodárenská spoločnosť, a.s. oznamuje obyvateľom na uliciach Jesenského, Bernolákova a časti Pribinovej, že z dôvodu plánovanej havarijnej rekonštrukcie prepojovacieho potrubia bude dňa 23.06.2026 (utorok) od 08:00 hod. do 16:00 hod. dočasne prerušená dodávka pitnej vody. Pre obyvateľov bude v dotknutej lokalite zabezpečené pristavenie mobilnej cisterny s pitnou vodou (Jesenského pred potravinami). Odporúčame občanom predzásobiť sa pitnou vodou. Ďakujeme za trpezlivosť a pochopenie.',
    category: 'Odstávky',
    type: 'Oficiálny oznam',
    importance: 'urgent',
    location: 'Hlohovec – centrum',
    startDate: '2026-06-18',
    endDate: '2026-06-23',
    image: 'https://images.unsplash.com/photo-1542013936693-8848e5740a7a?auto=format&fit=crop&w=600&q=80',
    authorId: 'org-1',
    authorName: 'Mesto Hlohovec (Mária S.)',
    status: 'published',
    createdAt: '2026-06-17T07:15:00Z',
    officialUrl: 'https://www.hlohovec.sk/oznamy.html'
  },
  {
    id: 'a-2',
    title: 'Uzávierka železničného priecestia v Leopoldove',
    shortDesc: 'Predĺženie obchádzkovej trasy z dôvodu opravy koľajiska. Sledujte náhradné značenie.',
    fullText: 'Slovenská správa ciest a ŽSR informujú vodičov, že železničné priecestie na ceste II/507 smer Leopoldov – Červeník bude v dňoch 26. júna až 28. júna úplne uzavreté pre cestnú dopravu z dôvodu rozsiahlej výmeny koľajového podložia a nového asfaltového krytu priecestia. Obchádzková trasa bude riadne vyznačená dočasným dopravným značením cez Hlohovec – Šulekovo – Madunice. Mestská hromadná doprava a prímestské autobusy budú premávať podľa upraveného cestovného poriadku uverejneného na stránkach dopravcu Arriva. Prosíme o zvýšenú opatrnosť.',
    category: 'Uzávierky',
    type: 'Oficiálny oznam',
    importance: 'normal',
    location: 'Leopoldov',
    startDate: '2026-06-18',
    endDate: '2026-06-28',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80',
    authorId: 'org-1',
    authorName: 'Mesto Hlohovec (Mária S.)',
    status: 'published',
    createdAt: '2026-06-18T09:00:00Z',
    officialUrl: 'https://www.hlohovec.sk/oznamy.html'
  },
  {
    id: 'a-3',
    title: 'Zber nebezpečného a veľkoobjemového odpadu v Šulekove',
    shortDesc: 'Informácia o rozmiestnení veľkoobjemových kontajnerov a zbere batérií, olejov a elektroniky.',
    fullText: 'Služby mesta Hlohovec oznamujú, že v dňoch 19. až 20. júna 2026 sa uskutoční v mestskej časti Šulekovo jesenný zber nebezpečného odpadu a pristavenie veľkoobjemových kontajnerov. Zberné nádoby pre komunálny objemný odpad (nábytok, koberce atď.) budú rozmiestnené na uliciach Sereďská (pri KD), Šulekovská (pri škole) a na križovatke ulíc Hájska/Školská. Auto na odber nebezpečného odpadu (motorové oleje, akumulátory, elektroodpad, farby) bude pristavené v sobotu 20.06. od 09:00 do 12:00 pred Kultúrnym domom v Šulekove. Do kontajnerov nepatrí stavebný odpad a bio-odpad!',
    category: 'Odpad',
    type: 'Oficiálny oznam',
    importance: 'normal',
    location: 'Šulekovo',
    startDate: '2026-06-18',
    endDate: '2026-06-20',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    authorId: 'org-1',
    authorName: 'Mesto Hlohovec (Mária S.)',
    status: 'published',
    createdAt: '2026-06-15T11:00:00Z',
    officialUrl: 'https://www.hlohovec.sk/odpady-obcan.html'
  },
  {
    id: 'a-4',
    title: 'Pozor na silné búrky cez víkend – výstraha SHMÚ pre HC okres',
    shortDesc: 'Výstraha 2. stupňa pred búrkami s krupobitím a silným nárazovým vetrom.',
    fullText: 'Slovenský hydrometeorologický ústav vydal výstrahu 2. stupňa pred nebezpečnými prírodnými javmi pre okres Hlohovec. Cez víkend (hlavne v sobotu popoludní a v noci na nedeľu) sa očakáva príchod studeného frontu spojeného s intenzívnymi búrkami, prudkým dažďom (úhrn až 35 mm za hodinu), krupobitím a silným vetrom s rýchlosťou v nárazoch až 80 km/h. Odporúčame zabezpečiť voľné predmety na balkónoch a záhradách, neparkovať vozidlá pod vysokými stromami a obmedziť pobyt v parkoch, najmä v Zámockej záhrade, kde hrozí padanie starých konárov.',
    category: 'Počasie',
    type: 'Neoverená informácia',
    importance: 'urgent',
    location: 'Okolie Hlohovca',
    startDate: '2026-06-18',
    endDate: '2026-06-21',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=600&q=80',
    authorId: 'u-1',
    authorName: 'Jozef Kováč',
    status: 'published',
    createdAt: '2026-06-18T13:45:00Z',
    officialUrl: 'https://www.hlohovec.sk'
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'i-1',
    title: 'Nefunkčné lampy verejného osvetlenia na Podzámskej ulici',
    description: 'Už viac ako týždeň nesvieti celý rad troch pouličných lámp hneď vedľa prechodu pre chodcov na Podzámskej ulici smerom k zámockému parku. Po zotmení je toto miesto veľmi tmavé a nebezpečné najmä pre deti, ktoré sa vracajú z krúžkov, aj pre starších ľudí. Autá idúce z kopca si chodcov na priechode všimnú až na poslednú chvíľu.',
    category: 'Osvetlenie',
    image: 'https://images.unsplash.com/photo-1508138221679-760a23a2285b?auto=format&fit=crop&w=600&q=80',
    location: 'Hlohovec – centrum',
    privateLocation: 'Podzámska ulica, pri lampe č. HC-241 pred trafostanicou',
    coordinates: { x: 55, y: 38 },
    authorId: 'u-4',
    authorName: 'Miloš Staňa',
    status: 'Rieši sa',
    supporters: ['u-1', 'u-6'],
    createdAt: '2026-06-10T21:10:00Z',
    history: [
      {
        status: 'Nový',
        note: 'Podnet bol úspešne zaregistrovaný občanom a čaká na kontrolu.',
        date: '2026-06-10T21:10:00Z',
        changedBy: 'Miloš Staňa'
      },
      {
        status: 'Overuje sa',
        note: 'Administrátor priradil podnet mestskej príspevkovej organizácii Bytový podnik Hlohovec na fyzické preverenie.',
        date: '2026-06-12T09:30:00Z',
        changedBy: 'Jozef Kováč (Admin)'
      },
      {
        status: 'Odoslaný mestu',
        note: 'Podnet prešiel kontrolou, sťažnosť bola formálne postúpená odboru výstavby samosprávy.',
        date: '2026-06-13T11:00:00Z',
        changedBy: 'Mária Smreková'
      },
      {
        status: 'Rieši sa',
        note: 'Technici identifikovali poškodený podpovrchový kábel. Oprava je naplánovaná spolu s revíziou rozvádzača v priebehu budúceho týždňa.',
        date: '2026-06-15T14:20:00Z',
        changedBy: 'Bytový podnik HC'
      }
    ]
  },
  {
    id: 'i-2',
    title: 'Hlboký výtlk na príjazdovom moste – nebezpečenstvo poškodenia kolesa',
    description: 'Hneď po zjazde z kruhového objazdu na Hlohovský most v smere z Leopoldova sa v pravom pruhu vytvoril hlboký a ostrý výtlk s rozmerom cca 40x50 cm a hĺbkou minimálne 15 cm. Vodiči, ktorí sa mu snažia v rýchlosti vyhnúť, prechádzajú prudko do protismeru, čím ohrozujú oprotiidúce autá, alebo riskujú prerazenie pneumatiky a poškodenie tlmičov.',
    category: 'Cesta',
    image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    location: 'Okolie Hlohovca',
    privateLocation: 'Napojenie mosta na II/513, pravý jazdný pruh, 15 metrov za značkou Hlohovec',
    coordinates: { x: 22, y: 70 },
    authorId: 'u-1',
    authorName: 'Jozef Kováč',
    status: 'Odoslaný mestu',
    supporters: ['u-4', 'u-3', 'u-6'],
    createdAt: '2026-06-14T08:24:00Z',
    history: [
      {
        status: 'Nový',
        note: 'Podnet bol podaný občanom Jozefom Kováčom.',
        date: '2026-06-14T08:24:00Z',
        changedBy: 'Jozef Kováč'
      },
      {
        status: 'Overuje sa',
        note: 'Podnet bol nahlásený ako mimoriadne nebezpečný pre plynulosť cestnej premávky.',
        date: '2026-06-14T10:00:00Z',
        changedBy: 'Mária Smreková'
      },
      {
        status: 'Odoslaný mestu',
        note: 'Samospráva postúpila sťažnosť Slovenskej správe ciest, nakoľko sa jedná o komunikáciu II. triedy v ich správe. Zároveň požiadala o núdzové dočasné vyplnenie studenou asfaltovou zmesou.',
        date: '2026-06-16T12:00:00Z',
        changedBy: 'Mária Smreková'
      }
    ]
  },
  {
    id: 'i-3',
    title: 'Preplnené nádoby na triedený komunálny odpad v Šulekove',
    description: 'Kontajnery na plasty, papier a sklo umiestnené na Sereďskej ulici pri starom kultúrnom dome sú už dva týždne úplne preplnené. Obyvatelia už začali ukladať vrecia s triedeným odpadom a kartóny na zem okolo nádob. Toulavé mačky a vietor odpadky roznášajú po celej ulici a priľahlom detskom ihrisku. Prosím o urýchlený odvoz a prípadné zvýšenie frekvencie vývozu triedeného odpadu.',
    category: 'Odpad',
    image: 'https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?auto=format&fit=crop&w=600&q=80',
    location: 'Šulekovo',
    privateLocation: 'Sereďská ulica 41, stojisko kontajnerov za parčíkom pri parnom mlyne',
    coordinates: { x: 15, y: 82 },
    authorId: 'u-4',
    authorName: 'Miloš Staňa',
    status: 'Vyriešený',
    supporters: ['u-1'],
    createdAt: '2026-06-05T14:40:00Z',
    history: [
      {
        status: 'Nový',
        note: 'Čaká na spracovanie.',
        date: '2026-06-05T14:40:00Z',
        changedBy: 'Miloš Staňa'
      },
      {
        status: 'Overuje sa',
        note: 'Prijaté od Služieb mesta Hlohovec.',
        date: '2026-06-06T09:12:00Z',
        changedBy: 'Služby mesta HC'
      },
      {
        status: 'Rieši sa',
        note: 'Zoradený mimoriadny odvoz plastov a papiera na deň 08.06.',
        date: '2026-06-07T11:00:00Z',
        changedBy: 'Služby mesta HC'
      },
      {
        status: 'Vyriešený',
        note: 'Stojisko odpadov bolo kompletne vyčistené. Odpad bol vyvezený a okolie bolo zametené zamestnancami verejnoprospešných služieb. Smetiarsky dvor analyzuje úpravu harmonogramu.',
        date: '2026-06-08T16:10:00Z',
        changedBy: 'Služby mesta HC'
      }
    ]
  },
  {
    id: 'i-4',
    title: 'Poškodené dosky a trčiace klince na lavičkách v zámockom parku',
    description: 'Na hlavnej vychádzkovej trase v Zámockej záhrade (neďaleko panského skleníka) sú tri lavičky v dezolátnom stave. Drevené dosky sú polámané, zahnívajú a z opierok trčia hrdzavé klince a skrutky. Hrozí poranenie detí alebo zničenie oblečenia. Radi by sme poprosili o ich opravu alebo výmenu za trvanlivejšie drevo.',
    category: 'Ihriská',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    location: 'Sihoť',
    privateLocation: 'Zámocká záhrada, trasa HC-Green, 50m severne od starej platanovej aleje',
    coordinates: { x: 52, y: 31 },
    authorId: 'u-5',
    authorName: 'Elena Valachová',
    status: 'Nový',
    supporters: ['u-1', 'u-4'],
    createdAt: '2026-06-18T10:11:00Z',
    history: [
      {
        status: 'Nový',
        note: 'Podnet bol podaný občanom a čaká na formálne overenie kompetentnými.',
        date: '2026-06-18T10:11:00Z',
        changedBy: 'Elena Valachová'
      }
    ]
  }
];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 'd-1',
    title: 'Katastrofálna situácia s parkovaním pri Hlohoveckej poliklinike',
    text: 'Chcem otvoriť diskusiu o vážnom stave s parkovaním pred našou poliklinikou. Zaparkovať tam v dopoludňajších hodinách (medzi 7:30 a 11:30) je absolútny zázrak. Pacienti, mnohokrát ťažko chorí, starší ľudia, mamičky s kočíkmi, musia parkovať o tri ulice ďalej a ísť pešo. Dochádza tam k obrovským kolíziám, autá stoja na chodníkoch, cúvajú naslepo na hlavnú cestu. Ako by to mesto malo podľa vás vyriešiť? Malo by sa zaviesť spoplatnenie s prvou hodinou zdarma, vybudovať parkovací dom, alebo obmedziť parkovanie zamestnancov zdravotníckeho zariadenia?',
    category: 'Doprava a parkovanie',
    type: 'Problém',
    authorId: 'u-4',
    authorName: 'Miloš Staňa',
    authorRole: 'verified_citizen',
    status: 'published',
    createdAt: '2026-06-15T09:12:00Z',
    reactions: {
      suhlasim: ['u-1', 'u-3', 'u-5', 'u-6'],
      nesuhlasim: [],
      uzitocne: ['u-2'],
      vysvetlenie: ['u-5'],
      podporujem: ['u-1', 'u-6']
    }
  },
  {
    id: 'd-2',
    title: 'Možnosti predĺženia cyklochodníka z Hlohovca do Leopoldova',
    text: 'Ahojte cyklisti a priatelia pohybu. Chcel by som navrhnúť mestským poslancom zváženie projektu bezpečného cyklochodníka, ktorý by prepojil Hlohovec priamo so stanicou v Leopoldove. Množstvo ľudí od nás dochádza do práce vlakom smer Blava či Žilina práve cez Leopoldov. Cesta autom/pešo cez most je extrémne nebezpečná a nekomfortná pre nevhodné krajnice a vysoký hluk kamiónov. Cyklotrasa popri Váhu by odľahčila dopravu a pomohla aj zdravému životnému štýlu. Kto by takúto trasu aktívne využíval na dennej báze?',
    category: 'Výstavba a rozvoj',
    type: 'Návrh',
    authorId: 'u-6',
    authorName: 'Lukáš Hrušovský',
    authorRole: 'registered',
    status: 'published',
    createdAt: '2026-06-16T18:24:00Z',
    reactions: {
      suhlasim: ['u-1', 'u-4', 'u-5'],
      nesuhlasim: ['u-3'],
      uzitocne: ['u-1'],
      vysvetlenie: [],
      podporujem: ['u-1', 'u-4', 'u-5']
    }
  },
  {
    id: 'd-3',
    title: 'Tipy na rodinné výlety pre deti okolo Hlohovca počas prázdnin',
    text: 'Máte nejaké tajné, neopozerané tipy na miesta v HC a najbližšom okolí, kde sa dá stráviť pekné popoludnie s deťmi (vek 5 a 8 rokov)? Poznáme klasiku ako detské ihrisko na Sihoti, Vyhliadka Šianec a zámockú záhradu. Chceli by sme však spoznať niečo nové – nejaké farmičky so zvieratkami, lesné chodníčky alebo skryté zákutia v Seredi, Leopoldove či Červeníku. Budem vďačná za akékoľvek rady!',
    category: 'Rodiny a deti',
    type: 'Otázka',
    authorId: 'u-5',
    authorName: 'Elena Valachová',
    authorRole: 'moderator',
    status: 'pinned',
    createdAt: '2026-06-17T11:45:00Z',
    reactions: {
      suhlasim: ['u-1', 'u-4'],
      nesuhlasim: [],
      uzitocne: ['u-4', 'u-6'],
      vysvetlenie: [],
      podporujem: []
    }
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    entityType: 'discussion',
    entityId: 'd-1',
    text: 'Súhlasím, je to katastrofa. Sám som minule viezol 80-ročného dedka na vyšetrenie srdca a musel som ho vyložiť na ceste v krupobití a ísť hľadať parkovisko k železnici. Podľa mňa by pomohla rampa s parkovacím lístkom, bezplatná prvá hodina pre pacientov a potom vysoká sadzba, aby tam ľudia nenechávali odparkované autá na pol dňa, keď cestujú vlakom preč.',
    authorId: 'u-1',
    authorName: 'Jozef Kováč',
    authorRole: 'admin',
    createdAt: '2026-06-15T10:14:00Z',
    reactions: {
      like: ['u-4', 'u-6'],
      dislike: []
    }
  },
  {
    id: 'c-2',
    entityType: 'discussion',
    entityId: 'd-1',
    text: 'Dobrý deň všem. Tento problém intenzívne riešime na mestskom zastupiteľstve. Aktuálne spracovávame projektovú dokumentáciu na reorganizáciu parkovania v okolí polikliniky. Riešením by mohlo byť jednosmerné zokruhovanie ulice, čo vytvorí zhruba 18 nových šikmých parkovacích miest a zmena tarifného pásma. Na septembrovom zastupiteľstve budeme schvaľovať prostriedky na realizáciu.',
    authorId: 'u-2',
    authorName: 'Mária Smreková',
    authorRole: 'organization',
    createdAt: '2026-06-15T14:30:00Z',
    reactions: {
      like: ['u-1', 'u-4', 'u-5'],
      dislike: []
    }
  },
  {
    id: 'c-3',
    entityType: 'discussion',
    entityId: 'd-1',
    text: 'Skvelá správa, pani Smreková! Dúfam, že sa to naozaj podarí zrealizovať ešte pred zimou a neostane to len pri predvolebných návrhoch. Držíme palce, aby poslanci hlasovali za ľudí.',
    authorId: 'u-4',
    authorName: 'Miloš Staňa',
    authorRole: 'verified_citizen',
    createdAt: '2026-06-15T15:20:00Z',
    parentId: 'c-2', // Nested
    reactions: {
      like: ['u-1'],
      dislike: []
    }
  },
  {
    id: 'c-4',
    entityType: 'discussion',
    entityId: 'd-2',
    text: 'Cyklochodník by bol splnený sen. Cesta do Leopoldova na bicykli je dnes čistá samovražda. Rýchle autá, kamióny a úzky most. Keby existoval cyklochodník, polovica ľudí by v pohode prešla do Leopoldova na vlak za 10 minút na bicykli namiesto zapĺňania ciest autami.',
    authorId: 'u-4',
    authorName: 'Miloš Staňa',
    authorRole: 'verified_citizen',
    createdAt: '2026-06-16T19:05:00Z',
    reactions: {
      like: ['u-6', 'u-1'],
      dislike: []
    }
  },
  {
    id: 'c-5',
    entityType: 'discussion',
    entityId: 'd-2',
    text: 'Ja by som takýto cyklochodník určite nevyužíval a peniaze mesta by sa mali radšej naliať do opravy havarijného stavu našich ciest v centre, napríklad ulice Fraštackej a Hviezdoslavovej. Kto chce bicyklovať, má predsa k dispozícii krásny zámocký park a hrádzu.',
    authorId: 'u-3',
    authorName: 'Peter Kollár',
    authorRole: 'business',
    createdAt: '2026-06-17T08:12:00Z',
    reactions: {
      like: [],
      dislike: ['u-6', 'u-1', 'u-4']
    }
  },
  {
    id: 'c-6',
    entityType: 'discussion',
    entityId: 'd-3',
    text: 'Odporúčam návštevu Včelárskeho skanzenu v Kráľovej pri Senci, je to síce trochu ďalej (cca 25 min autom), ale pre deti mimoriadne pútavé a naučné. Priamo v HC je skvelá prechádzka na Soroš po lesnom chodníku, na jar tam kvitne nádherný divoký cesnak. Naša škola tam organizuje pravidelné prírodovedné výlety.',
    authorId: 'u-1',
    authorName: 'Jozef Kováč',
    authorRole: 'admin',
    createdAt: '2026-06-17T13:00:00Z',
    reactions: {
      like: ['u-5'],
      dislike: []
    }
  },
  {
    id: 'c-7',
    entityType: 'issue',
    entityId: 'i-1',
    text: 'Naozaj odporúčam tento problém vyriešiť čo najrýchlejšie. Syn sa tade vracia večer o deviatej z tréningu a už viackrát mi volal, že musel bežať, lebo sa tam potulovali divné partie a nič nebolo vidieť.',
    authorId: 'u-5',
    authorName: 'Elena Valachová',
    authorRole: 'moderator',
    createdAt: '2026-06-12T14:40:00Z',
    reactions: {
      like: ['u-4'],
      dislike: []
    }
  }
];

export const INITIAL_JOBS: JobOffer[] = [
  {
    id: 'j-1',
    title: 'Samostatný Barista / Čašník',
    businessId: 'biz-1',
    businessName: 'Retro Café & Bistro',
    businessLogo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&h=150&q=80',
    location: 'Hlohovec – pešia zóna',
    type: 'Trvalý pracovný pomer',
    salary: '1 100 € - 1 350 €',
    description: 'Do nášho tímu hľadáme šikovného, usmievavého a komunikatívneho kolegu, ktorého baví káva a gastronómia. Tvojou hlavnou náplňou bude príprava špičkových kávových nápojov, miešaných drinkov, obsluha hostí, práca s pokladňou a udržiavanie pohody a čistoty v našom milom bistre.',
    requirements: 'Skúsenosť s prácou baristu alebo čašníka je veľkou výhodou, ale radi ťa všetko od základu naučíme. Vyžadujeme spoľahlivosť, príjemné reprezentatívne vystupovanie, chuť učiť sa nové veci a platný zdravotný preukaz pre prácu s potravinami.',
    benefits: 'Práca v mladom tíme na rodinnej pešej zóne, zamestnanecká zľava na celé menu, spoločné teambuildingy, možnosť baristických kurzov hradených našou kaviarňou a férové ohodnotenie vrátane preplácania nadčasov.',
    contact: 'peter.k@retrocafe.sk, +421 905 123 456',
    expiresAt: '2026-07-31',
    isSponsored: true,
    createdAt: '2026-06-10T11:20:00Z',
    status: 'active'
  },
  {
    id: 'j-2',
    title: 'Pekár – nočná zmena',
    businessId: 'biz-3',
    businessName: 'Pekáreň Šulekovo',
    businessLogo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&h=150&q=80',
    location: 'Hlohovec – Šulekovo',
    type: 'Trvalý pracovný pomer',
    salary: '1 400 € - 1 800 €',
    description: 'Do zavedenej remeselnej pekárne v Šulekove prijmeme šikovného pekára na celú nočnú zmenu. Zodpovednosť za samostatnú rannú prípravu kváskových chlebov, kysnutie sladkého pečiva, hnietenie ciest podľa osvedčených receptúr a obsluhu rotačných pecí.',
    requirements: 'Vyučenie v odbore pekár/cukrár alebo minimálne 2-ročná preukázateľná prax v reálnej výrobe. Fyzická zdatnosť (práca s vrecami múky), spoľahlivosť, presnosť a vysoká miera zodpovednosti.',
    benefits: 'Nadštandardné nočné príplatky, čerstvé chrumkavé pečivo denne zdarma domov pre rodinu, stabilné zázemie úspešnej lokálnej firmy s istotou výplaty vždy načas.',
    contact: 'pekar@pekaresulekovo.sk',
    expiresAt: '2026-07-20',
    isSponsored: false,
    createdAt: '2026-06-12T15:00:00Z',
    status: 'active'
  },
  {
    id: 'j-3',
    title: 'Hodinový brigádnik – rozvoz jedla na e-bicykli',
    businessId: 'biz-1',
    businessName: 'Retro Café & Bistro',
    businessLogo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=150&h=150&q=80',
    location: 'Hlohovec a okolie',
    type: 'Brigáda',
    salary: '6,50 € / hod + tringelty',
    description: 'Hľadáme študenta na flexibilnú výpomoc s rozvozom obedového menu a objednávok na našom firemnom elektrickom bicykli po Hlohovci. Rozvoz prebieha denne v rozmedzí od 11:00 do 14:00 hod. Práca je vhodná pre aktívnych športovcov s dobrou znalosťou mesta Hlohovec.',
    requirements: 'Vek od 16 rokov, zodpovedný prístup k bicyklu, príjemná komunikácia pri odovzdávaní jedla zákazníkom, vlastný smartfón s navigáciou.',
    benefits: 'Zapožičanie moderného elektrobicykla, obedy v našom bistre len za 1,50 €, tringelty od spokojných zákazníkov ti v plnej miere zostávajú.',
    contact: 'peter.k@retrocafe.sk',
    expiresAt: '2026-07-15',
    isSponsored: false,
    createdAt: '2026-06-14T09:30:00Z',
    status: 'active'
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    contentType: 'comment',
    contentId: 'c-5',
    contentSnapshot: 'Ja by som takýto cyklochodník určite nevyužíval...',
    reason: 'Zavádzajúce informácie',
    note: 'Autor úmyselne zľahčuje bezpečnosť cesty a snaží sa presadiť záujmy opráv cesty pri jeho vlastnej kaviarni.',
    reporterId: 'u-6',
    reporterName: 'Lukáš Hrušovský',
    status: 'new',
    createdAt: '2026-06-17T09:10:00Z'
  }
];

export const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad-1',
    title: 'Partner týždňa: Najlepšia káva v Retro Café',
    businessId: 'biz-1',
    businessName: 'Retro Café & Bistro',
    format: 'partner_tyzdna',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    text: 'Navštívte najlepšiu kaviareň s letnou terasou na námestí. Výborná výberová káva, lahodné koláče a perfektná rodinná atmosféra pre prácu aj oddych.',
    link: 'https://www.retrocafe-hc.sk',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    status: 'active',
    views: 1245,
    clicks: 184
  },
  {
    id: 'ad-2',
    title: 'Sponzoring: Hlohovecké chrumkavé rožky u nás',
    businessId: 'biz-3',
    businessName: 'Pekáreň Šulekovo',
    format: 'sponzorovana_karta',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    text: 'Spoznajte legendárnu chuť a vôňu pravých kváskových rožkov pečených v kamennej peci. Príďte ráno a odneste si kúsok poctivého pekárskeho remesla.',
    link: 'https://www.pekaresulekovo.sk',
    startDate: '2026-06-10',
    endDate: '2026-06-30',
    status: 'active',
    views: 840,
    clicks: 92
  }
];

export const INITIAL_AUDIT_LOG: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'u-1',
    userName: 'Jozef Kováč (Admin)',
    action: 'Zmena nastavení aplikácie',
    details: 'Spustenie komunitného portálu, aktivácia filtrovania vulgárnych slov',
    createdAt: '2026-06-18T10:00:00Z'
  },
  {
    id: 'log-2',
    userId: 'u-2',
    userName: 'Mária Smreková',
    action: 'Zverejnenie dôležitého oznamu',
    details: 'Odstávka pitnej vody - ulica Jesenského (a-1)',
    createdAt: '2026-06-17T07:15:00Z'
  }
];

export const INITIAL_APP_SETTINGS: AppSetting = {
  id: 'settings-1',
  registrationEnabled: true,
  autoApproveEvents: false,
  autoApproveAnnouncements: true,
  filterSwearWords: true,
  contactEmail: 'spravca@mojfrastak.sk'
};

export const BUSINESS_PACKAGE_INFO = [
  {
    id: 'bezplatny',
    name: 'Bezplatný profil',
    price: '0 €',
    period: 'navždy',
    features: [
      'Zobrazenie názvu a kategórie',
      'Základná adresa a kontakt',
      'Základné otváracie hodiny',
      'Predvolený krátky opis'
    ],
    bgClass: 'bg-white border-slate-200'
  },
  {
    id: 'start',
    name: 'Štart',
    price: '9 €',
    period: 'mesačne',
    features: [
      'Rozšírený profil s logom',
      'Galéria obrázkov (max 5)',
      'Odkaz na vlastnú webstránku',
      'Možnosť pridať 1 akciu mesačne',
      'Základné anonymné štatistiky'
    ],
    bgClass: 'bg-white border-amber-200'
  },
  {
    id: 'lokal',
    name: 'Lokál',
    price: '19 €',
    period: 'mesačne',
    features: [
      'Zvýraznené umiestnenie v zozname',
      'Galéria bez obmedzení',
      'Možnosť pridať 4 akcie mesačne',
      'Publikovanie vlastných udalostí',
      'Pripnutá zmienka v newsletteri'
    ],
    bgClass: 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-300/35'
  },
  {
    id: 'partner',
    name: 'Partner',
    price: '39 €',
    period: 'mesačne',
    features: [
      'Platný sponzorovaný baner',
      'Zvýraznenie vašich podujatí',
      'Publikovanie pracovných ponúk',
      'Priorita pred ostatnými firmatmi',
      'Kompletný grafický dashboard'
    ],
    bgClass: 'bg-wine-50/30 border-wine-300 ring-2 ring-wine-300/40'
  },
  {
    id: 'hlavny',
    name: 'Hlavný partner',
    price: '99 €',
    period: 'mesačne',
    features: [
      'Logo v záhlaví a päte portálu',
      'Plná reklamná integrácia',
      'Týždenná prioritná kampaň',
      'Rozhovor v newsletteri',
      'Garantovaný limitovaný počet firiem'
    ],
    bgClass: 'bg-slate-900 text-white border-slate-900 shadow-xl'
  }
];
