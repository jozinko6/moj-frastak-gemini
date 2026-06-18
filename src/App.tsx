/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { EventsView } from './views/EventsView';
import { EventDetailView } from './components/EventDetailView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { IssuesView } from './views/IssuesView';
import { DiscussionsView } from './views/DiscussionsView';
import { DirectoryView } from './views/DirectoryView';
import { JobsView } from './views/JobsView';
import { UserProfileView } from './views/UserProfileView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [currentView, setView] = useState<string>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);

  const handleSetView = (newView: string) => {
    setView(newView);
    // Auto scroll to top on tab change for great UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
      case 'domov':
        return (
          <HomeView 
            setView={handleSetView} 
            setSelectedEventId={setSelectedEventId}
            setSelectedIssueId={setSelectedIssueId}
            setSelectedAnnId={setSelectedAnnId}
            setSelectedDiscussionId={setSelectedDiscussionId}
          />
        );
      case 'kalendar_podujati':
      case 'udalosti':
        return (
          <EventsView 
            setView={handleSetView} 
            setSelectedEventId={setSelectedEventId} 
          />
        );
      case 'detail_udalosti':
        return (
          <EventDetailView 
            eventId={selectedEventId} 
            setView={handleSetView}
            setSelectedEventId={setSelectedEventId}
          />
        );
      case 'oznamy_a_vystrahy':
      case 'oznamy':
        return (
          <AnnouncementsView 
            setView={handleSetView} 
            selectedAnnId={selectedAnnId}
            setSelectedAnnId={setSelectedAnnId}
          />
        );
      case 'obcianske_podnety':
      case 'podnety':
      case 'detail_podnetu':
        return (
          <IssuesView 
            setView={handleSetView} 
            selectedIssueId={selectedIssueId}
            setSelectedIssueId={setSelectedIssueId}
          />
        );
      case 'komunitne_forum':
      case 'diskusie':
      case 'detail_diskusie':
        return (
          <DiscussionsView 
            setView={handleSetView} 
            selectedDiscussionId={selectedDiscussionId}
            setSelectedDiscussionId={setSelectedDiscussionId}
          />
        );
      case 'katalog_sluzieb':
      case 'adresar':
        return (
          <DirectoryView 
            setView={handleSetView} 
          />
        );
      case 'kariera_hlohovec':
      case 'prace':
        return (
          <JobsView 
            setView={handleSetView} 
          />
        );
      case 'moj_profil':
      case 'profil':
        return (
          <UserProfileView 
            setView={handleSetView} 
            setSelectedEventId={setSelectedEventId}
            setSelectedIssueId={setSelectedIssueId}
            setSelectedAnnId={setSelectedAnnId}
            setSelectedDiscussionId={setSelectedDiscussionId}
          />
        );
      case 'riadiaca_centrala':
      case 'administracia':
        return (
          <AdminView />
        );
      default:
        return (
          <HomeView 
            setView={handleSetView} 
            setSelectedEventId={setSelectedEventId}
            setSelectedIssueId={setSelectedIssueId}
            setSelectedAnnId={setSelectedAnnId}
            setSelectedDiscussionId={setSelectedDiscussionId}
          />
        );
    }
  };

  return (
    <AppProvider>
      <Layout setView={handleSetView} currentView={currentView}>
        {renderActiveView()}
      </Layout>
    </AppProvider>
  );
}
