"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTestPrepCourseById, updateTestPrepCourse } from '@/lib/api';
import TestPrepForm from '@/components/admin/TestPrepForm';
import { PageHeader, LoadingSpinner, ErrorAlert, SuccessAlert } from "@/components/admin/UI";
import React from 'react';

export default function EditTestPrepCoursePage({ params }) {
  const router = useRouter();
  const id = React.use(params).id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getTestPrepCourseById(id);
          if (response.success) {
            setCourse(response.data);
          } else {
            setError(response.error || 'Failed to fetch course details.');
          }
        } catch (err) {
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setFormSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await updateTestPrepCourse(id, formData);
      if (response.success) {
        setSuccess('Course updated successfully! Redirecting...');
        // Optionally refetch or update local state if not redirecting immediately
        // setCourse(response.data); 
        setTimeout(() => {
          router.push('/admin/test-prep');
        }, 2000);
      } else {
        setError(response.error || 'Failed to update course.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during update.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !course) { // Show error prominently if course couldn't be fetched
    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Edit Test Preparation Course" />
        <ErrorAlert title="Error Loading Course" message={error} />
         <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
            Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader 
        title={course ? `Edit: ${course.test_name}` : "Edit Test Preparation Course"}
        parentBreadcrumb={{ href: "/admin/test-prep", name: "Test Prep Courses" }}
      />
      <div className="container mx-auto px-4 py-8">
        {error && <ErrorAlert title="Update Error" message={error} onClose={() => setError(null)} className="mb-4" />}
        {success && <SuccessAlert title="Success" message={success} onClose={() => setSuccess(null)} className="mb-4" />}
        
        {course ? (
          <TestPrepForm
            course={course}
            onSubmit={handleSubmit}
            isLoading={formSubmitting}
            // error={error} // Pass error related to form submission if TestPrepForm handles it
            // success={success} // Pass success related to form submission if TestPrepForm handles it
          />
        ) : (
          <p>Course data is not available. It might have been deleted or there was an issue loading it.</p>
        )}
      </div>
    </div>
  );
} 