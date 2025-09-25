import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { Ticket } from './Ticket';
import { TicketIcon } from './Icons';

export const UserDashboard: React.FC = () => {
  const { currentUser, bookings, events } = useAppData();
  const userBookings = bookings.filter(b => b.userId === currentUser.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-text-primary">My Tickets</h1>
      {userBookings.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
            <TicketIcon className="h-16 w-16 mx-auto text-text-secondary" />
            <p className="mt-4 text-text-secondary">You haven't booked any tickets yet.</p>
            <p className="text-sm text-gray-500">Explore events and book your first ticket!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {userBookings.map(booking => {
            const event = events.find(e => e.id === booking.eventId);
            if (!event) return null;
            return <Ticket key={booking.id} booking={booking} event={event} user={currentUser} />;
          })}
        </div>
      )}
    </div>
  );
};
