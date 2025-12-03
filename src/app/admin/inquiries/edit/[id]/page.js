"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getContactInquiryById, updateContactInquiry } from "@/lib/api";
import { format } from "date-fns";

const EditContactInquiryPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [inquiry, setInquiry] = useState(null);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const inquiryStatusOptions = ["new", "contacted", "resolved"];

  useEffect(() => {
    if (id) {
      const fetchInquiry = async () => {
        setLoading(true);
        const response = await getContactInquiryById(id);
        if (response.success) {
          setInquiry(response.data);
          setStatus(response.data.status || "new");
          setAdminNotes(response.data.admin_notes || "");
        } else {
          setError(response.error || "Failed to fetch inquiry details.");
          if (response.notFound) {
            // Optionally redirect or show a more specific not found message
            router.push("/admin/inquiries");
          }
        }
        setLoading(false);
      };
      fetchInquiry();
    }
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage("");

    const updatedData = {
      status,
      admin_notes: adminNotes,
    };

    const response = await updateContactInquiry(id, updatedData);

    if (response.success) {
      setInquiry(response.data[0]); // Assuming update returns an array with the updated item
      setStatus(response.data[0].status);
      setAdminNotes(response.data[0].admin_notes || "");
      setSuccessMessage("Inquiry updated successfully!");
    } else {
      setError(response.error || "Failed to update inquiry.");
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3s
  };

  if (loading) return <p className="text-center mt-8">Loading inquiry details...</p>;
  if (error && !inquiry) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;
  if (!inquiry) return <p className="text-center mt-8">Inquiry not found.</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Contact Inquiry</h1>
      {error && <p className="mb-4 text-red-500">Error: {error}</p>}
      {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{inquiry.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{inquiry.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-gray-900">{inquiry.phone || "N/A"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Submitted</label>
            <p className="mt-1 text-gray-900">{format(new Date(inquiry.created_at), "PPpp")}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Interest/Subject</label>
          <p className="mt-1 text-gray-900">{inquiry.interest || "N/A"}</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{inquiry.message}</p>
        </div>
        
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
            {inquiryStatusOptions.map(option => (
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
            placeholder="Add internal notes here..."
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
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContactInquiryPage; 