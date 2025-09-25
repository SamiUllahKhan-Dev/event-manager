import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Role } from '../types';
import { MapPinIcon, CalendarIcon, TicketIcon, ArrowLeftIcon, CheckCircleIcon } from './Icons';

interface EventDetailsProps {
  eventId: string;
  onBack: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onBack }) => {
  const { events, currentUser, bookTicket } = useAppData();
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return <div className="text-center text-text-secondary">Event not found.</div>;
  }

  const ticketsLeft = event.totalTickets - event.ticketsSold;
  const isSoldOut = ticketsLeft <= 0;
  const canBook = currentUser.role === Role.Attendee && !isSoldOut;

  const handleBookTicket = () => {
    setBookingStatus('booking');
    setTimeout(() => {
        const result = bookTicket(event.id);
        if (result) {
            setBookingStatus('success');
        } else {
            setBookingStatus('error');
        }
    }, 1000);
  };
  
  const formattedDate = new Date(event.date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-primary mb-6 hover:underline">
            <ArrowLeftIcon className="h-5 w-5"/>
            Back to all events
        </button>

        <div className="bg-card rounded-lg shadow-2xl overflow-hidden">
            <img className="w-full h-64 md:h-96 object-cover" src={event.imageUrl} alt={event.title} />
            <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">{event.title}</h1>
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-text-secondary mb-6">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-primary" />
                        <span>{event.location}</span>
                    </div>
                </div>

                <p className="text-text-secondary leading-relaxed mb-8">{event.description}</p>

                <div className="bg-secondary rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <span className="text-3xl font-bold text-primary">${event.price}</span>
                        <div className={`flex items-center text-sm mt-2 ${isSoldOut ? 'text-red-400' : 'text-green-400'}`}>
                            <TicketIcon className="w-4 h-4 mr-2" />
                            <span>{isSoldOut ? 'Sold Out' : `${ticketsLeft} of ${event.totalTickets} tickets remaining`}</span>
                        </div>
                    </div>
                    
                    {currentUser.role === Role.Attendee && (
                        <div>
                            {bookingStatus === 'success' ? (
                                <div className="flex items-center gap-2 text-green-400 font-bold p-3 rounded-md bg-green-500/20">
                                    <CheckCircleIcon className="h-6 w-6" />
                                    <span>Ticket Booked!</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleBookTicket}
                                    disabled={!canBook || bookingStatus === 'booking'}
                                    className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {bookingStatus === 'booking' ? 'Booking...' : 'Book Ticket'}
                                </button>
                            )}
                        </div>
                    )}

                    {currentUser.role === Role.Organizer && (
                        <div className="p-3 rounded-md bg-yellow-500/20 text-yellow-400 text-sm font-semibold">
                            Organizers cannot book tickets.
                        </div>
                    )}
                </div>
                {bookingStatus === 'error' && <p className="text-red-400 mt-2 text-center sm:text-right">Failed to book ticket. Please try again.</p>}
            </div>
        </div>
    </div>
  );
};
