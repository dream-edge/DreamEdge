"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getConsultationById, updateConsultation } from "@/lib/api";
import { format } from 'date-fns';

const EditConsultationPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [consultation, setConsultation] = useState(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const consultationStatusOptions = ['scheduled', 'completed', 'canceled', 'rescheduled'];

  useEffect(() => {
    if (id) {
      const fetchConsultation = async () => {
        setLoading(true);
        const response = await getConsultationById(id);
        if (response.success) {
          setConsultation(response.data);
          setStatus(response.data.status || 'scheduled');
          setAdminNotes(response.data.notes || ''); // `notes` field is used for admin notes in consultations
        } else {
          setError(response.error || 'Failed to fetch consultation details.');
          if (response.notFound) {
            router.push('/admin/consultations');
          }
        }
        setLoading(false);
      };
      fetchConsultation();
    }
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    const updatedData = {
      status,
      notes: adminNotes, // `notes` field for consultations
    };

    const response = await updateConsultation(id, updatedData);

    if (response.success) {
      setConsultation(response.data[0]); 
      setStatus(response.data[0].status);
      setAdminNotes(response.data[0].notes || '');
      setSuccessMessage('Consultation updated successfully!');
    } else {
      setError(response.error || 'Failed to update consultation.');
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) return <p className="text-center mt-8">Loading consultation details...</p>;
  if (error && !consultation) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  if (!consultation) return <p className="text-center mt-8">Consultation not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Consultation</h1>
      {error && <p className="mb-4 text-red-500">Error: {error}</p>}
      {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{consultation.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{consultation.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-gray-900">{consultation.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Booked</label>
            <p className="mt-1 text-gray-900">{format(new Date(consultation.created_at), 'PPpp')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Date & Time</label>
            <p className="mt-1 text-gray-900">
              {format(new Date(consultation.preferred_date), 'PPP')} at {consultation.preferred_time}
            </p>
          </div>
          {consultation.alt_date && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Alternative Date & Time</label>
              <p className="mt-1 text-gray-900">
                {format(new Date(consultation.alt_date), 'PPP')} at {consultation.alt_time}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Education Level</label>
            <p className="mt-1 text-gray-900">{consultation.education_level}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Study Interest</label>
            <p className="mt-1 text-gray-900">{consultation.study_interest}</p>
          </div>
        </div>

        {consultation.message && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Message/Requirements</label>
            <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{consultation.message}</p>
          </div>
        )}
        
        <hr className="my-6" />

        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {consultationStatusOptions.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">Admin Notes</label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            rows={4}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add internal notes for this consultation..."
          />
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditConsultationPage; 