"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UniversityForm from "@/components/admin/UniversityForm";
import { PageHeader } from "@/components/admin/UI";
import { createUniversity } from "@/lib/api";

export default function NewUniversityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await createUniversity(formData);
      
      if (success) {
        setSuccess("University created successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/universities");
        }, 1500);
      } else {
        throw new Error(error || "Failed to create university");
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
        title="Add New University"
        description="Create a new university profile"
      />
      
      <UniversityForm
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
        success={success}
      />
    </div>
  );
} 