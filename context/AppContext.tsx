import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { User, Role, Event, Booking } from '../types';

// --- MOCK USERS ---
const MOCK_USERS: User[] = [
  { id: 'user_attendee_1', name: 'Alex Johnson', email: 'alex@example.com', role: Role.Attendee },
  { id: 'user_organizer_1', name: 'Tech Events Inc.', email: 'contact@techevents.com', role: Role.Organizer },
];

// --- MOCK DATA ---
const INITIAL_EVENTS: Event[] = [
    {
        id: 'evt_1',
        title: 'React Conference 2024',
        description: 'Join the world\'s leading React experts for a two-day conference full of insightful talks, hands-on workshops, and networking opportunities. Learn about the latest trends, tools, and techniques in the React ecosystem.',
        imageUrl: 'https://picsum.photos/seed/reactconf/1200/800',
        date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        location: 'San Francisco, CA',
        price: 499,
        totalTickets: 250,
        ticketsSold: 128,
        organizerId: 'user_organizer_1',
    },
    {
        id: 'evt_2',
        title: 'Vue.js Global Summit',
        description: 'An online summit for the global Vue.js community. Featuring core team members and industry leaders sharing their knowledge on everything from Vue 3 and Vite to Nuxt.js and state management patterns.',
        imageUrl: 'https://picsum.photos/seed/vueconf/1200/800',
        date: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
        location: 'Online',
        price: 99,
        totalTickets: 1000,
        ticketsSold: 450,
        organizerId: 'user_organizer_1',
    },
    {
        id: 'evt_3',
        title: 'AI in Web Development',
        description: 'Explore the intersection of Artificial Intelligence and modern web development. This workshop covers everything from using AI-powered coding assistants to integrating large language models into your applications.',
        imageUrl: 'https://picsum.photos/seed/aiconf/1200/800',
        date: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
        location: 'New York, NY',
        price: 750,
        totalTickets: 100,
        ticketsSold: 25,
        organizerId: 'user_organizer_1',
    },
    {
        id: 'evt_4',
        title: 'Indie Music Fest',
        description: 'A three-day outdoor festival showcasing the best up-and-coming indie bands from around the country. Enjoy great music, food trucks, and art installations in a beautiful park setting.',
        imageUrl: 'https://picsum.photos/seed/musicfest/1200/800',
        date: new Date(new Date().setDate(new Date().getDate() + 75)).toISOString(),
        location: 'Austin, TX',
        price: 150,
        totalTickets: 5000,
        ticketsSold: 4120,
        organizerId: 'user_organizer_1',
    },
];

interface AppContextType {
  currentUser: User;
  users: User[];
  events: Event[];
  bookings: Booking[];
  setCurrentUser: (user: User) => void;
  addEvent: (event: Omit<Event, 'id' | 'organizerId' | 'ticketsSold'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  bookTicket: (eventId: string) => Booking | null;
  getAttendeesForEvent: (eventId: string) => { user: User; booking: Booking }[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'organizerId' | 'ticketsSold'>) => {
    if (currentUser.role !== Role.Organizer) return;
    const newEvent: Event = {
      ...eventData,
      id: `evt_${Date.now()}`,
      organizerId: currentUser.id,
      ticketsSold: 0,
    };
    setEvents(prev => [newEvent, ...prev]);
  }, [currentUser]);

  const updateEvent = useCallback((updatedEvent: Event) => {
    if (currentUser.role !== Role.Organizer || updatedEvent.organizerId !== currentUser.id) return;
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  }, [currentUser]);

  const deleteEvent = useCallback((eventId: string) => {
    if (currentUser.role !== Role.Organizer) return;
    setEvents(prev => prev.filter(e => e.id !== eventId || e.organizerId !== currentUser.id));
    setBookings(prev => prev.filter(b => b.eventId !== eventId));
  }, [currentUser]);

  const bookTicket = useCallback((eventId: string): Booking | null => {
    if (currentUser.role !== Role.Attendee) return null;
    const event = events.find(e => e.id === eventId);
    if (!event || event.ticketsSold >= event.totalTickets) return null;

    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      eventId,
      userId: currentUser.id,
      bookingDate: new Date().toISOString(),
    };
    
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ticketsSold: e.ticketsSold + 1 } : e));
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, [currentUser, events]);
  
  const getAttendeesForEvent = useCallback((eventId: string) => {
      const eventBookings = bookings.filter(b => b.eventId === eventId);
      return eventBookings.map(booking => ({
          user: users.find(u => u.id === booking.userId)!,
          booking: booking,
      })).filter(item => !!item.user);
  }, [bookings, users]);

  const contextValue = {
    currentUser,
    users,
    events,
    bookings,
    setCurrentUser,
    addEvent,
    updateEvent,
    deleteEvent,
    bookTicket,
    getAttendeesForEvent,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
