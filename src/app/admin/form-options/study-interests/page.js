'use client';

import { useEffect, useState } from 'react';
import { getStudyInterestOptions, deleteStudyInterestOption } from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import StudyInterestForm from '@/components/admin/options/StudyInterestForm'; // To be created

// Basic Modal Component (copied from other option pages)
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

export default function ManageStudyInterestsPage() {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  const fetchOptions = async () => {
    setIsLoading(true);
    try {
      const response = await getStudyInterestOptions(true); // Fetch all for admin
      if (response.success) {
        setOptions(response.data);
      } else {
        toast.error(response.error || 'Failed to load study interests.');
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleAddNew = () => {
    setEditingOption(null);
    setShowFormModal(true);
  };

  const handleEdit = (option) => {
    setEditingOption(option);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this study interest?')) {
      const toastId = toast.loading('Deleting...');
      try {
        const response = await deleteStudyInterestOption(id);
        if (response.success) {
          toast.success('Study interest deleted!', { id: toastId });
          fetchOptions();
        } else {
          toast.error(response.error || 'Failed to delete.', { id: toastId });
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`, { id: toastId });
      }
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowFormModal(false);
    setEditingOption(null);
    fetchOptions();
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading study interests...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Manage Study Interests</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center shadow-sm whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add New Study Interest
        </button>
      </div>

      {options.length === 0 && !isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No study interests found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md overflow-hidden sm:rounded-lg">
          <ul role="list" className="divide-y divide-gray-200">
            {options.map((option) => (
              <li key={option.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{option.interest_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order: <span className="font-medium">{option.display_order !== null ? option.display_order : 'N/A'}</span> | 
                      Status: <span className={`font-medium ${option.is_active ? 'text-green-600' : 'text-red-600'}`}>{option.is_active ? 'Active' : 'Inactive'}</span>
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(option)} 
                      className="p-2 rounded-md text-indigo-600 hover:bg-indigo-100 hover:text-indigo-900 transition-colors duration-150"
                      title="Edit Study Interest"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(option.id)} 
                      className="p-2 rounded-md text-red-600 hover:bg-red-100 hover:text-red-900 transition-colors duration-150"
                      title="Delete Study Interest"
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

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); setEditingOption(null); }}>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editingOption?.id ? 'Edit' : 'Add New'} Study Interest
        </h2>
        <StudyInterestForm 
          initialData={editingOption}
          onSubmitSuccess={handleFormSubmitSuccess}
          onCancel={() => { setShowFormModal(false); setEditingOption(null); }}
        />
      </Modal>
    </div>
  );
} 