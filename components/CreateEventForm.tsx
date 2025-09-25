import React, { useState } from 'react';
import { useAppData } from '../hooks/useAppData';
import { Event } from '../types';

interface CreateEventFormProps {
  eventToEdit?: Event;
  onSuccess: () => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ eventToEdit, onSuccess }) => {
  const { addEvent, updateEvent } = useAppData();
  const [formData, setFormData] = useState({
    title: eventToEdit?.title || '',
    description: eventToEdit?.description || '',
    date: eventToEdit?.date ? new Date(eventToEdit.date).toISOString().substring(0, 16) : '',
    location: eventToEdit?.location || '',
    price: eventToEdit?.price || 0,
    totalTickets: eventToEdit?.totalTickets || 100,
    imageUrl: eventToEdit?.imageUrl || 'https://picsum.photos/seed/event/1200/800'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'totalTickets') ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString()
    };
    if (eventToEdit) {
      updateEvent({
        ...eventToEdit,
        ...eventData
      });
    } else {
      addEvent(eventData);
    }
    onSuccess();
  };

  const inputClass = "w-full p-2 bg-secondary border border-gray-600 rounded-md focus:ring-primary focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Event Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClass} required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} className={inputClass} rows={4} required></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Date and Time</label>
          <input type="datetime-local" name="date" id="date" value={formData.date} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1">Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputClass} required />
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-text-secondary mb-1">Price ($)</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className={inputClass} required min="0" />
        </div>
        <div>
          <label htmlFor="totalTickets" className="block text-sm font-medium text-text-secondary mb-1">Total Tickets</label>
          <input type="number" name="totalTickets" id="totalTickets" value={formData.totalTickets} onChange={handleChange} className={inputClass} required min="1" />
        </div>
      </div>
      <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
          <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} required />
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-md hover:bg-primary-hover transition-colors">
          {eventToEdit ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};
