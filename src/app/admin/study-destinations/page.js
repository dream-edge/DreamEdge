'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudyDestinations, deleteStudyDestination } from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/admin/UI';
import { format } from 'date-fns';

export default function StudyDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await getStudyDestinations(true); // Admin view to get all destinations
      if (response.success) {
        setDestinations(response.data);
      } else {
        toast.error(response.error || 'Failed to load study destinations');
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study destination? This action cannot be undone.')) {
      return;
    }

    const toastId = toast.loading('Deleting...');
    try {
      const response = await deleteStudyDestination(id);
      if (response.success) {
        toast.success('Study destination deleted successfully', { id: toastId });
        fetchDestinations(); // Refresh the list
      } else {
        toast.error(response.error || 'Failed to delete study destination', { id: toastId });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Study Destinations"
        description="Manage country study destination pages"
        action={
          <Link
            href="/admin/study-destinations/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add New Destination
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse text-blue-600">Loading...</div>
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white p-6 text-center rounded-md shadow-sm">
          <p className="text-gray-500 mb-4">No study destinations found.</p>
          <Link
            href="/admin/study-destinations/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Create Your First Destination
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country Slug
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {destinations.map((destination) => (
                <tr key={destination.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{destination.display_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">{destination.country_slug}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      destination.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {destination.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(destination.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {destination.display_order || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/study-destinations/edit/${destination.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(destination.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <Link
                        href={`/study-abroad/${destination.country_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900 font-medium text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 