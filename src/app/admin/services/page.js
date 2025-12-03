"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getServices } from "@/lib/api";
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
import { deleteService } from "@/lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      const { success, data, error } = await getServices();
      if (success) {
        setServices(data);
      } else {
        throw new Error(error || "Failed to load services");
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
      const { success, error } = await deleteService(deleteId);
      if (success) {
        setSuccess("Service deleted successfully");
        loadServices();
      } else {
        throw new Error(error || "Failed to delete service");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div>
      <PageHeader
        title="Services Management"
        description="Manage services offered by your consultancy"
        action={
          <LinkButton href="/admin/services/new">
            Add New Service
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
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Short Description</TableHeadCell>
            <TableHeadCell>Order</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center py-10">
                  No services found. Create your first service.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-gray-900">
                    {service.name}
                  </TableCell>
                  <TableCell>
                    {service.short_description?.substring(0, 50)}
                    {service.short_description?.length > 50 && "..."}
                  </TableCell>
                  <TableCell>{service.display_order || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(service.id)}
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
              Are you sure you want to delete this service? This action cannot be
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