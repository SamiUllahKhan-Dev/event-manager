import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { EventCard } from './EventCard';

interface EventListProps {
  onViewDetails: (eventId: string) => void;
}

export const EventList: React.FC<EventListProps> = ({ onViewDetails }) => {
  const { events } = useAppData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center text-text-primary">Upcoming Events</h1>
      {events.length === 0 ? (
        <p className="text-center text-text-secondary">No events found. Check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};
