export enum Role {
  Attendee = 'ATTENDEE',
  Organizer = 'ORGANIZER',
}

export enum Page {
    Home = 'HOME',
    EventDetails = 'EVENT_DETAILS',
    UserDashboard = 'USER_DASHBOARD',
    OrganizerDashboard = 'ORGANIZER_DASHBOARD',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  price: number;
  totalTickets: number;
  ticketsSold: number;
  organizerId: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  bookingDate: string;
}
