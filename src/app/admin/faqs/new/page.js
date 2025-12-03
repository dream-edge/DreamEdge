"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FAQForm from "@/components/admin/FAQForm";
import { PageHeader } from "@/components/admin/UI";
import { createFaq } from "@/lib/api";

export default function NewFAQPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await createFaq(formData);
      
      if (success) {
        setSuccess("FAQ created successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/faqs");
        }, 1500);
      } else {
        throw new Error(error || "Failed to create FAQ");
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
        title="Add New FAQ"
        description="Create a new frequently asked question"
      />
      
      <FAQForm
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
        success={success}
      />
    </div>
  );
} 