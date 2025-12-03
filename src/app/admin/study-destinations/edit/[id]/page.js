"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStudyDestinationById } from '@/lib/api';
import StudyDestinationForm from '@/components/admin/forms/StudyDestinationForm';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/admin/UI';

export default function EditStudyDestinationPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await getStudyDestinationById(id);
        if (response.success) {
          setDestination(response.data);
        } else {
          setError(response.error || 'Failed to load study destination');
          toast.error(response.error || 'Failed to load study destination');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
        toast.error(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  const handleSubmitSuccess = () => {
    // Navigate back to the list page after successful update
    router.push('/admin/study-destinations');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-blue-600">Loading destination details...</div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <h2 className="text-lg font-medium">Error</h2>
          <p>{error || 'Study destination not found'}</p>
          <div className="mt-4">
            <Link
              href="/admin/study-destinations"
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Return to List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={`Edit Study Destination: ${destination.display_name}`}
        description="Update details for this country study destination page"
        action={
          <Link
            href="/admin/study-destinations"
            className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </Link>
        }
      />
      
      <div className="bg-white shadow-sm rounded-md p-6">
        <StudyDestinationForm 
          initialData={destination}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => router.push('/admin/study-destinations')}
        />
      </div>
    </div>
  );
} 