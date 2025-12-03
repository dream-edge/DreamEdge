"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import ServiceForm from "@/components/admin/ServiceForm";
import { PageHeader, LoadingSpinner, ErrorAlert } from "@/components/admin/UI";
import { getServiceById, updateService } from "@/lib/api";

export default function EditServicePage({ params }) {
  const id = React.use(params).id;
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadService() {
      try {
        const { success, data, error } = await getServiceById(id);
        
        if (success && data) {
          setService(data);
        } else {
          throw new Error(error || "Failed to load service");
        }
      } catch (err) {
        console.error("Error loading service:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      console.log("Submitting service update with ID:", id);
      console.log("Service form data:", formData);
      
      const { success, error } = await updateService(id, formData);
      
      if (success) {
        setSuccess("Service updated successfully!");
        
        // Refresh the service data
        const { data } = await getServiceById(id);
        if (data) {
          setService(data);
        }
      } else {
        throw new Error(error || "Failed to update service");
      }
    } catch (err) {
      console.error("Error updating service:", err);
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

  if (error && !service) {
    return (
      <div className="p-6">
        <ErrorAlert 
          title="Error Loading Service" 
          message={error}
        />
        <div className="mt-4">
          <button
            onClick={() => router.push("/admin/services")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Service"
        description={service?.name ? `Edit details for ${service.name}` : "Edit service details"}
      />
      
      {service && (
        <ServiceForm
          service={service}
          onSubmit={handleSubmit}
          isLoading={saving}
          error={error}
          success={success}
        />
      )}
    </div>
  );
} 