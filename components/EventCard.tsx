import React from 'react';
import { Event } from '../types';
import { MapPinIcon, CalendarIcon, TicketIcon } from './Icons';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const ticketsLeft = event.totalTickets - event.ticketsSold;
  const isSoldOut = ticketsLeft <= 0;
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-primary/20 flex flex-col">
      <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.title} />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-text-primary mb-2 truncate">{event.title}</h3>
        
        <div className="flex items-center text-text-secondary text-sm mb-2">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center text-text-secondary text-sm mb-4">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>

        <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">${event.price}</span>
                <div className={`flex items-center text-sm px-2 py-1 rounded-full ${isSoldOut ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    <TicketIcon className="w-4 h-4 mr-1" />
                    <span>{isSoldOut ? 'Sold Out' : `${ticketsLeft} left`}</span>
                </div>
            </div>

            <button
            onClick={() => onViewDetails(event.id)}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-hover focus:ring-opacity-50"
            >
            View Details
            </button>
        </div>
      </div>
    </div>
  );
};
