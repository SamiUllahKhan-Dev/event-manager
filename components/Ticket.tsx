import React, { useEffect, useRef } from 'react';
import { Booking, Event, User } from '../types';
import { MapPinIcon, CalendarIcon } from './Icons';

declare const QRCode: any;

interface TicketProps {
  booking: Booking;
  event: Event;
  user: User;
}

export const Ticket: React.FC<TicketProps> = ({ booking, event, user }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrCodeData = JSON.stringify({
    bookingId: booking.id,
    eventId: event.id,
    userId: user.id,
    eventName: event.title,
    userName: user.name,
  });
  
  useEffect(() => {
    if (canvasRef.current && typeof QRCode !== 'undefined') {
      QRCode.toCanvas(canvasRef.current, qrCodeData, {
        width: 160,
        margin: 1,
        color: {
            dark: '#FFFFFF',
            light: '#1F2937'
        }
      }, (error: any) => {
        if (error) console.error(error);
      });
    }
  }, [qrCodeData]);
  
  const formattedDate = new Date(event.date).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-primary font-bold">EVENT TICKET</p>
                <h2 className="text-2xl font-bold text-text-primary mt-1">{event.title}</h2>
            </div>
            <p className="text-sm text-text-secondary hidden md:block">Booking ID: {booking.id}</p>
        </div>

        <div className="mt-4 space-y-3 text-text-secondary">
             <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span>{formattedDate}</span>
            </div>
             <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>{event.location}</span>
            </div>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-4">
            <p className="text-sm text-text-secondary">Ticket Holder</p>
            <p className="font-semibold text-text-primary">{user.name}</p>
        </div>
      </div>
      <div className="bg-secondary p-6 flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-2 border-dashed border-gray-600">
        <canvas ref={canvasRef} className="rounded-lg" />
        <p className="text-xs text-text-secondary mt-2">Scan at entry</p>
      </div>
    </div>
  );
};
