"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllTestimonials, deleteTestimonial } from "@/lib/api";
import {
  PageHeader,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  LinkButton,
  LoadingSpinner,
  ErrorAlert,
  DangerButton,
  SuccessAlert,
} from "@/components/admin/UI";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    try {
      setLoading(true);
      const { success, data, error } = await getAllTestimonials();
      if (success) {
        setTestimonials(data);
      } else {
        throw new Error(error || "Failed to load testimonials");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { success, error } = await deleteTestimonial(deleteId);
      if (success) {
        setSuccess("Testimonial deleted successfully");
        loadTestimonials();
      } else {
        throw new Error(error || "Failed to delete testimonial");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Archived</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Draft</span>;
    }
  };

  return (
    <div>
      <PageHeader
        title="Testimonials Management"
        description="Manage student testimonials and success stories"
        action={
          <LinkButton href="/admin/testimonials/new">
            Add New Testimonial
          </LinkButton>
        }
      />

      {error && (
        <ErrorAlert
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <SuccessAlert
          title="Success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {loading ? (
        <LoadingSpinner size="lg" className="py-10" />
      ) : (
        <Table>
          <TableHead>
            <TableHeadCell>Student</TableHeadCell>
            <TableHeadCell>University</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center py-10">
                  No testimonials found. Create your first testimonial.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium text-gray-900">
                    {testimonial.name}
                  </TableCell>
                  <TableCell>{testimonial.university || "-"}</TableCell>
                  <TableCell>{renderStatus(testimonial.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/testimonials/${testimonial.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(testimonial.id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this testimonial? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <DangerButton onClick={handleConfirmDelete}>
                Delete
              </DangerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 