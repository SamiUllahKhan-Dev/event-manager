import React, { useState } from 'react';
import { Header } from './components/Header';
import { EventList } from './components/EventList';
import { EventDetails } from './components/EventDetails';
import { UserDashboard } from './components/UserDashboard';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { useAppData } from './hooks/useAppData';
import { Page } from './types';

const App: React.FC = () => {
  const { currentUser } = useAppData();
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setSelectedEventId(null); 
  };

  const viewEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage(Page.EventDetails);
  };

  const renderContent = () => {
    if (selectedEventId && currentPage === Page.EventDetails) {
      return <EventDetails eventId={selectedEventId} onBack={() => navigateTo(Page.Home)} />;
    }

    switch (currentPage) {
      case Page.Home:
        return <EventList onViewDetails={viewEventDetails} />;
      case Page.UserDashboard:
        return <UserDashboard />;
      case Page.OrganizerDashboard:
        return <OrganizerDashboard />;
      default:
        return <EventList onViewDetails={viewEventDetails} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <Header currentPage={currentPage} navigateTo={navigateTo} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
