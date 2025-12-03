'use client';

import { useState, useEffect } from 'react';
import { createStudyInterestOption, updateStudyInterestOption } from '@/lib/api';
import toast from 'react-hot-toast';

export default function StudyInterestForm({ initialData, onSubmitSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    interest_name: '',
    is_active: true,
    display_order: '' 
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        interest_name: initialData.interest_name || '',
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        display_order: initialData.display_order !== null ? String(initialData.display_order) : ''
      });
    } else {
      setFormData({
        interest_name: '',
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
    const toastId = toast.loading(formData.id ? 'Updating...' : 'Creating...');

    const dataToSave = {
      ...formData,
      display_order: formData.display_order === '' ? null : parseInt(formData.display_order, 10),
    };

    try {
      let response;
      if (formData.id) {
        response = await updateStudyInterestOption(formData.id, dataToSave);
      } else {
        response = await createStudyInterestOption(dataToSave);
      }

      if (response.success) {
        toast.success(`Study Interest ${formData.id ? 'updated' : 'created'}!`, { id: toastId });
        if (onSubmitSuccess) onSubmitSuccess(response.data);
      } else {
        toast.error(response.error || 'Failed to save.', { id: toastId });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="interest_name" className="block text-sm font-medium text-gray-700">Interest Name*</label>
        <input 
          type="text" 
          name="interest_name" 
          id="interest_name" 
          value={formData.interest_name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required 
        />
      </div>
      <div>
        <label htmlFor="display_order" className="block text-sm font-medium text-gray-700">Display Order</label>
        <input 
          type="number"
          name="display_order"
          id="display_order"
          value={formData.display_order}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="e.g., 1 (optional)"
        />
      </div>
      <div className="flex items-center">
        <input 
          id="is_active" 
          name="is_active" 
          type="checkbox" 
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
      </div>
      <div className="flex justify-end space-x-3 pt-3">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : (formData.id ? 'Update' : 'Create') + ' Interest'}
        </button>
      </div>
    </form>
  );
} 