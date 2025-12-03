"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FAQForm from "@/components/admin/FAQForm";
import { PageHeader, LoadingSpinner, ErrorAlert } from "@/components/admin/UI";
import { getFaqById, updateFaq } from "@/lib/api";

export default function EditFAQPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadFaq() {
      try {
        const { success, data, error } = await getFaqById(id);
        
        if (success && data) {
          setFaq(data);
        } else {
          throw new Error(error || "Failed to load FAQ");
        }
      } catch (err) {
        console.error("Error loading FAQ:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFaq();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      console.log("Submitting FAQ update with ID:", id);
      console.log("FAQ form data:", formData);
      
      const { success, error } = await updateFaq(id, formData);
      
      if (success) {
        setSuccess("FAQ updated successfully!");
        
        // Refresh the FAQ data
        const { data } = await getFaqById(id);
        if (data) {
          setFaq(data);
        }
      } else {
        throw new Error(error || "Failed to update FAQ");
      }
    } catch (err) {
      console.error("Error updating FAQ:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !faq) {
    return (
      <div className="p-6">
        <ErrorAlert 
          title="Error Loading FAQ" 
          message={error}
        />
        <div className="mt-4">
          <button
            onClick={() => router.push("/admin/faqs")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to FAQs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit FAQ"
        description="Update an existing frequently asked question"
      />
      
      {faq && (
        <FAQForm
          faq={faq}
          onSubmit={handleSubmit}
          isLoading={saving}
          error={error}
          success={success}
        />
      )}
    </div>
  );
} 