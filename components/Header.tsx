import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { Role, Page, User } from '../types';
import { TicketIcon, CalendarDaysIcon, HomeIcon, UserCircleIcon, AdjustmentsHorizontalIcon } from './Icons';

interface HeaderProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, navigateTo }) => {
  const { currentUser, users, setCurrentUser } = useAppData();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(u => u.id === e.target.value);
    if (selectedUser) {
      setCurrentUser(selectedUser);
      navigateTo(Page.Home); // Navigate to home on role change
    }
  };

  const navLinkClasses = (page: Page) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentPage === page 
      ? 'bg-primary text-white' 
      : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
    }`;
  
  return (
    <header className="bg-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <TicketIcon className="h-8 w-8" />
              <span className="text-xl font-bold text-text-primary">EventHive</span>
            </div>
            <nav className="hidden md:flex items-center gap-2">
              <button onClick={() => navigateTo(Page.Home)} className={navLinkClasses(Page.Home)}>
                <HomeIcon className="h-5 w-5" />
                Events
              </button>
              {currentUser.role === Role.Attendee && (
                <button onClick={() => navigateTo(Page.UserDashboard)} className={navLinkClasses(Page.UserDashboard)}>
                   <UserCircleIcon className="h-5 w-5" />
                   My Tickets
                </button>
              )}
              {currentUser.role === Role.Organizer && (
                <button onClick={() => navigateTo(Page.OrganizerDashboard)} className={navLinkClasses(Page.OrganizerDashboard)}>
                   <AdjustmentsHorizontalIcon className="h-5 w-5" />
                   Organizer Dashboard
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                value={currentUser.id}
                onChange={handleRoleChange}
                className="bg-secondary border border-gray-600 text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 appearance-none"
              >
                <option value="" disabled>Switch Role...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <span className="hidden sm:block text-text-secondary text-sm">Welcome, {currentUser.name.split(' ')[0]}</span>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-center gap-4 py-2 border-t border-gray-700">
            <button onClick={() => navigateTo(Page.Home)} className={navLinkClasses(Page.Home)}>
                <HomeIcon className="h-5 w-5" />
                <span className="sr-only">Events</span>
            </button>
            {currentUser.role === Role.Attendee && (
            <button onClick={() => navigateTo(Page.UserDashboard)} className={navLinkClasses(Page.UserDashboard)}>
                <UserCircleIcon className="h-5 w-5" />
                <span className="sr-only">My Tickets</span>
            </button>
            )}
            {currentUser.role === Role.Organizer && (
            <button onClick={() => navigateTo(Page.OrganizerDashboard)} className={navLinkClasses(Page.OrganizerDashboard)}>
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
            </button>
            )}
        </div>
      </div>
    </header>
  );
};
