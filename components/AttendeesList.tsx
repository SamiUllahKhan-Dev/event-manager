import React from 'react';
import { useAppData } from '../hooks/useAppData';

interface AttendeesListProps {
  eventId: string;
}

export const AttendeesList: React.FC<AttendeesListProps> = ({ eventId }) => {
  const { getAttendeesForEvent } = useAppData();
  const attendees = getAttendeesForEvent(eventId);

  return (
    <div className="max-h-96 overflow-y-auto">
      {attendees.length === 0 ? (
        <p className="text-center text-text-secondary py-8">No attendees have booked tickets yet.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {attendees.map(({ user, booking }) => (
            <li key={booking.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-text-primary">{user.name}</p>
                <p className="text-sm text-text-secondary">{user.email}</p>
              </div>
              <div className="text-right">
                 <p className="text-sm text-text-secondary">Booked on</p>
                 <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
