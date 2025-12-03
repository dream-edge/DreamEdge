"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUniversities, deleteUniversity } from "@/lib/api";
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

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadUniversities();
  }, []);

  async function loadUniversities() {
    try {
      setLoading(true);
      const { success, data, error } = await getUniversities();
      if (success) {
        setUniversities(data);
      } else {
        throw new Error(error || "Failed to load universities");
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
      const { success, error } = await deleteUniversity(deleteId);
      if (success) {
        setSuccess("University deleted successfully");
        loadUniversities();
      } else {
        throw new Error(error || "Failed to delete university");
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
        title="Universities Management"
        description="Manage university listings and information"
        action={
          <LinkButton href="/admin/universities/new">
            Add New University
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
            <TableHeadCell>Location</TableHeadCell>
            <TableHeadCell>Ranking</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody>
            {universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center py-10">
                  No universities found. Create your first university.
                </TableCell>
              </TableRow>
            ) : (
              universities.map((university) => (
                <TableRow key={university.id}>
                  <TableCell className="font-medium text-gray-900">
                    {university.name}
                  </TableCell>
                  <TableCell>{university.location || "-"}</TableCell>
                  <TableCell>{university.ranking || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/universities/${university.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(university.id)}
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
              Are you sure you want to delete this university? This action cannot be
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