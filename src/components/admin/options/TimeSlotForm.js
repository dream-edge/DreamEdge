'use client';

import { useState, useEffect } from 'react';
import { createConsultationTimeSlot, updateConsultationTimeSlot } from '@/lib/api';
import toast from 'react-hot-toast';

export default function TimeSlotForm({ initialData, onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    time_range_display: '',
    is_active: true,
    display_order: '' 
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        time_range_display: initialData.time_range_display || '',
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        display_order: initialData.display_order !== null ? String(initialData.display_order) : ''
      });
    } else {
      // Reset for new entry
      setFormData({
        time_range_display: '',
        is_active: true,
        display_order: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading(formData.id ? 'Updating time slot...' : 'Creating time slot...');

    const dataToSave = {
      ...formData,
      display_order: formData.display_order === '' ? null : parseInt(formData.display_order, 10),
    };

    try {
      let response;
      if (formData.id) {
        response = await updateConsultationTimeSlot(formData.id, dataToSave);
      } else {
        response = await createConsultationTimeSlot(dataToSave);
      }

      if (response.success) {
        toast.success(`Time slot ${formData.id ? 'updated' : 'created'} successfully!`, { id: toastId });
        if (onSubmitSuccess) onSubmitSuccess(response.data);
      } else {
        toast.error(response.error || 'Failed to save time slot.', { id: toastId });
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`, { id: toastId });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="time_range_display" className="block text-sm font-medium text-brand-dark">Time Range Display*</label>
        <input 
          type="text" 
          name="time_range_display" 
          id="time_range_display" 
          value={formData.time_range_display}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-brand-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary-400 focus:border-brand-primary sm:text-sm"
          required 
          placeholder="e.g., 10:00 AM - 11:00 AM"
        />
      </div>
      <div>
        <label htmlFor="display_order" className="block text-sm font-medium text-brand-dark">Display Order</label>
        <input 
          type="number"
          name="display_order"
          id="display_order"
          value={formData.display_order}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-brand-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary-400 focus:border-brand-primary sm:text-sm"
          placeholder="e.g., 1 (optional, for sorting)"
        />
      </div>
      <div className="flex items-center">
        <input 
          id="is_active" 
          name="is_active" 
          type="checkbox" 
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-brand-primary border-brand-secondary-300 rounded focus:ring-brand-primary-400"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-brand-dark">Active</label>
      </div>
      <div className="flex justify-end space-x-3 pt-3">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-brand-dark bg-brand-secondary-100 rounded-md hover:bg-brand-secondary-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary-400 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : (formData.id ? 'Update' : 'Create') + ' Time Slot'}
        </button>
      </div>
    </form>
  );
} 