"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import UniversityForm from "@/components/admin/UniversityForm";
import { PageHeader, LoadingSpinner, ErrorAlert } from "@/components/admin/UI";
import { getUniversityById, updateUniversity } from "@/lib/api";

export default function EditUniversityPage({ params }) {
  const id = React.use(params).id;
  const router = useRouter();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadUniversity() {
      try {
        const { success, data, error } = await getUniversityById(id);
        
        if (success && data) {
          setUniversity(data);
        } else {
          throw new Error(error || "Failed to load university");
        }
      } catch (err) {
        console.error("Error loading university:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUniversity();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      console.log("Submitting university update with ID:", id);
      console.log("University form data:", formData);
      
      if (!id || !formData) {
        throw new Error("Missing university ID or form data");
      }
      
      const { success, error, data } = await updateUniversity(id, formData);
      
      if (success) {
        setSuccess("University updated successfully!");
        
        const { data: refreshedData } = await getUniversityById(id);
        if (refreshedData) {
          setUniversity(refreshedData);
        }
      } else {
        throw new Error(error || "Failed to update university");
      }
    } catch (err) {
      console.error("Error updating university:", err);
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

  if (error && !university) {
    return (
      <div className="p-6">
        <ErrorAlert 
          title="Error Loading University" 
          message={error}
        />
        <div className="mt-4">
          <button
            onClick={() => router.push("/admin/universities")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Universities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit University"
        description={university?.name ? `Edit details for ${university.name}` : "Edit university details"}
      />
      
      {university && (
        <UniversityForm
          university={university}
          onSubmit={handleSubmit}
          isLoading={saving}
          error={error}
          success={success}
        />
      )}
    </div>
  );
} 