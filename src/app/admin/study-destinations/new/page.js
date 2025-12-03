"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StudyDestinationForm from '@/components/admin/forms/StudyDestinationForm';
import Link from 'next/link';
import { PageHeader } from '@/components/admin/UI';

export default function NewStudyDestinationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSuccess = () => {
    setIsSubmitting(false);
    // Navigate back to the list page after successful creation
    router.push('/admin/study-destinations');
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Create New Study Destination"
        description="Add details for a new country study destination page"
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
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => router.push('/admin/study-destinations')}
        />
      </div>
    </div>
  );
} 