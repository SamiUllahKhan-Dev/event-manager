import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Role, Event } from '../types';
import { Modal } from './Modal';
import { CreateEventForm } from './CreateEventForm';
import { AttendeesList } from './AttendeesList';
import { PlusIcon, PencilIcon, TrashIcon, UsersIcon, XMarkIcon } from './Icons';

export const OrganizerDashboard: React.FC = () => {
  const { currentUser, events, deleteEvent } = useAppData();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAttendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (currentUser.role !== Role.Organizer) {
    return <div>Access Denied.</div>;
  }

  const organizerEvents = events.filter(e => e.organizerId === currentUser.id);

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedEvent(null);
    setEditModalOpen(false);
  };
  
  const openAttendeesModal = (event: Event) => {
    setSelectedEvent(event);
    setAttendeesModalOpen(true);
  };
  const closeAttendeesModal = () => {
    setSelectedEvent(null);
    setAttendeesModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">My Events</h1>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-hover transition-colors">
          <PlusIcon className="h-5 w-5" />
          Create Event
        </button>
      </div>

      <div className="bg-card shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-secondary">
            <tr>
              <th className="p-4 font-semibold">Event</th>
              <th className="p-4 font-semibold">Tickets Sold</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizerEvents.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-8 text-text-secondary">You have not created any events yet.</td>
              </tr>
            ) : (
              organizerEvents.map(event => (
                <tr key={event.id} className="border-t border-gray-700 hover:bg-secondary">
                  <td className="p-4 font-medium">{event.title}</td>
                  <td className="p-4">
                    {event.ticketsSold} / {event.totalTickets}
                    <div className="w-full bg-gray-600 rounded-full h-1.5 mt-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => openAttendeesModal(event)} className="p-2 text-text-secondary hover:text-primary transition-colors"><UsersIcon className="h-5 w-5"/></button>
                        <button onClick={() => openEditModal(event)} className="p-2 text-text-secondary hover:text-primary transition-colors"><PencilIcon className="h-5 w-5"/></button>
                        <button onClick={() => window.confirm('Are you sure?') && deleteEvent(event.id)} className="p-2 text-text-secondary hover:text-red-500 transition-colors"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Create New Event</h2>
            <button onClick={closeCreateModal} className="p-1 rounded-full hover:bg-gray-700"><XMarkIcon className="h-6 w-6"/></button>
        </div>
        <CreateEventForm onSuccess={closeCreateModal} />
      </Modal>

      {/* Edit Event Modal */}
      {selectedEvent && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit Event</h2>
            <button onClick={closeEditModal} className="p-1 rounded-full hover:bg-gray-700"><XMarkIcon className="h-6 w-6"/></button>
          </div>
          <CreateEventForm eventToEdit={selectedEvent} onSuccess={closeEditModal} />
        </Modal>
      )}

      {/* Attendees Modal */}
      {selectedEvent && (
        <Modal isOpen={isAttendeesModalOpen} onClose={closeAttendeesModal}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Attendees for {selectedEvent.title}</h2>
            <button onClick={closeAttendeesModal} className="p-1 rounded-full hover:bg-gray-700"><XMarkIcon className="h-6 w-6"/></button>
          </div>
          <AttendeesList eventId={selectedEvent.id} />
        </Modal>
      )}

    </div>
  );
};
