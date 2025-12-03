"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { PageHeader } from "@/components/admin/UI";
import { createTestimonial } from "@/lib/api";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await createTestimonial(formData);
      
      if (success) {
        setSuccess("Testimonial created successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/testimonials");
        }, 1500);
      } else {
        throw new Error(error || "Failed to create testimonial");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Testimonial"
        description="Create a new student testimonial"
      />
      
      <TestimonialForm
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
        success={success}
      />
    </div>
  );
} 