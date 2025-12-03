"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { PageHeader, LoadingSpinner, ErrorAlert } from "@/components/admin/UI";
import { getTestimonialById, updateTestimonial } from "@/lib/api";

export default function EditTestimonialPage({ params }) {
  const id = React.use(params).id;
  const router = useRouter();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadTestimonial() {
      try {
        const { success, data, error } = await getTestimonialById(id);
        
        if (success && data) {
          setTestimonial(data);
        } else {
          throw new Error(error || "Failed to load testimonial");
        }
      } catch (err) {
        console.error("Error loading testimonial:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTestimonial();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      console.log("Submitting testimonial update with ID:", id);
      console.log("Testimonial form data:", formData);
      
      const { success, error } = await updateTestimonial(id, formData);
      
      if (success) {
        setSuccess("Testimonial updated successfully!");
        
        // Refresh the testimonial data
        const { data: refreshedData } = await getTestimonialById(id);
        if (refreshedData) {
          setTestimonial(refreshedData);
        }
      } else {
        throw new Error(error || "Failed to update testimonial");
      }
    } catch (err) {
      console.error("Error updating testimonial:", err);
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

  if (error && !testimonial) {
    return (
      <div className="p-6">
        <ErrorAlert 
          title="Error Loading Testimonial" 
          message={error}
        />
        <div className="mt-4">
          <button
            onClick={() => router.push("/admin/testimonials")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Testimonials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Testimonial"
        description={testimonial?.name ? `Edit testimonial from ${testimonial.name}` : "Edit testimonial"}
      />
      
      {testimonial && (
        <TestimonialForm
          testimonial={testimonial}
          onSubmit={handleSubmit}
          isLoading={saving}
          error={error}
          success={success}
        />
      )}
    </div>
  );
} 