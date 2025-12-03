'use client';

import { useEffect, useState } from 'react';
// import Link from 'next/link'; // Link might not be needed directly on this page if navigation is handled elsewhere
import { getConsultationTimeSlots, deleteConsultationTimeSlot } from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; 
import TimeSlotForm from '@/components/admin/options/TimeSlotForm'; // Corrected import path

// Basic Modal Component (can be moved to a shared components folder later)
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Placeholder for TimeSlotForm - REMOVED as it's now imported
// const TimeSlotForm = ({ initialData, onSubmitSuccess, onCancel }) => { ... };

export default function ManageTimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null); // null for new, object for editing

  const fetchTimeSlots = async () => {
    setIsLoading(true);
    try {
      const response = await getConsultationTimeSlots(true); // Fetch all for admin
      if (response.success) {
        setTimeSlots(response.data);
      } else {
        toast.error(response.error || 'Failed to load time slots.');
      }
    } catch (error) {
      toast.error(`An error occurred while fetching time slots: ${error.message}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const handleAddNew = () => {
    setEditingSlot(null); // Clear any editing state
    setShowFormModal(true);
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      const toastId = toast.loading('Deleting time slot...');
      try {
        const response = await deleteConsultationTimeSlot(id);
        if (response.success) {
          toast.success('Time slot deleted successfully!', { id: toastId });
          fetchTimeSlots(); // Refresh list
        } else {
          toast.error(response.error || 'Failed to delete time slot.', { id: toastId });
        }
      } catch (error) {
        toast.error(`An error occurred during deletion: ${error.message}`, { id: toastId });
      }
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowFormModal(false);
    setEditingSlot(null); // Reset editing state
    fetchTimeSlots(); // Refresh the list
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading time slots...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Manage Consultation Time Slots</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add New Time Slot
        </button>
      </div>

      {timeSlots.length === 0 && !isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No time slots found. Add some to get started!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {timeSlots.map((slot) => (
              <li key={slot.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{slot.time_range_display}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order: <span className="font-medium">{slot.display_order !== null ? slot.display_order : 'N/A'}</span> | 
                      Status: <span className={`font-medium ${slot.is_active ? 'text-green-600' : 'text-red-600'}`}>{slot.is_active ? 'Active' : 'Inactive'}</span>
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(slot)} 
                      className="p-2 rounded-md text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900 transition-colors duration-150"
                      title="Edit Time Slot"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(slot.id)} 
                      className="p-2 rounded-md text-red-600 hover:bg-red-100 hover:text-red-900 transition-colors duration-150"
                      title="Delete Time Slot"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); setEditingSlot(null); }}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editingSlot?.id ? 'Edit' : 'Add New'} Consultation Time Slot
        </h2>
        <TimeSlotForm 
          initialData={editingSlot}
          onSubmitSuccess={handleFormSubmitSuccess}
          onCancel={() => { setShowFormModal(false); setEditingSlot(null); }}
        />
      </Modal>
    </div>
  );
} 