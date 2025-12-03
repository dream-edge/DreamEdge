"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TestPrepForm from "@/components/admin/TestPrepForm";
import { PageHeader } from "@/components/admin/UI";
import { createTestPrepCourse } from "@/lib/api";

export default function NewTestPrepCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, error } = await createTestPrepCourse(formData);
      
      if (success) {
        setSuccess("Test preparation course created successfully!");
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/test-prep");
        }, 1500);
      } else {
        throw new Error(error || "Failed to create test preparation course");
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
        title="Add New Test Preparation Course"
        description="Create a new test preparation course"
      />
      
      <TestPrepForm
        onSubmit={handleSubmit}
        isLoading={loading}
        error={error}
        success={success}
      />
    </div>
  );
} 