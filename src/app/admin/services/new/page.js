"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { PageHeader } from "@/components/admin/UI";
import { createService } from "@/lib/api";

export default function NewServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await createService(formData);
      
      if (success) {
        setSuccess("Service created successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/services");
        }, 1500);
      } else {
        throw new Error(error || "Failed to create service");
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
        title="Add New Service"
        description="Create a new service for your consultancy"
      />
      
      <ServiceForm
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
        success={success}
      />
    </div>
  );
} 