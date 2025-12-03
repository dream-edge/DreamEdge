"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsultations } from "@/lib/api";
import { format } from 'date-fns';

const AdminConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      const response = await getConsultations(true);
      if (response.success) {
        setConsultations(response.data);
      } else {
        setError(response.error);
      }
      setLoading(false);
    };
    fetchConsultations();
  }, []);

  const sortedConsultations = [...consultations].sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    // Handle date sorting for preferred_date
    if (sortConfig.key === 'preferred_date') {
      valA = new Date(a.preferred_date + 'T' + a.preferred_time).getTime();
      valB = new Date(b.preferred_date + 'T' + b.preferred_time).getTime();
    } else if (sortConfig.key === 'created_at') {
      valA = new Date(a.created_at).getTime();
      valB = new Date(b.created_at).getTime();
    }

    if (valA < valB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valA > valB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const consultationStatusColors = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    rescheduled: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800",
  };

  if (loading) return <p>Loading consultations...</p>;
  if (error) return <p className="text-red-500">Error loading consultations: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Consultations</h1>
      </div>

      {consultations.length === 0 ? (
        <p>No consultations found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => requestSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Name{getSortIndicator('name')}</th>
                <th onClick={() => requestSort('email')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Email{getSortIndicator('email')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th onClick={() => requestSort('preferred_date')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Preferred Date/Time{getSortIndicator('preferred_date')}</th>
                <th onClick={() => requestSort('study_interest')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Study Interest{getSortIndicator('study_interest')}</th>
                <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Status{getSortIndicator('status')}</th>
                <th onClick={() => requestSort('created_at')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Date Booked{getSortIndicator('created_at')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedConsultations.map((consultation) => {
                let formattedPreferredDate = "N/A";
                try {
                  if (consultation.preferred_date && consultation.preferred_time) {
                    const preferredDateTime = new Date(consultation.preferred_date + 'T' + consultation.preferred_time);
                    if (!isNaN(preferredDateTime.getTime())) {
                      formattedPreferredDate = format(preferredDateTime, 'PPpp');
                    }
                  }
                } catch (e) {
                  console.error("Error formatting preferred date:", e);
                }

                let formattedCreatedAt = "N/A";
                try {
                  if (consultation.created_at) {
                    const createdAtDate = new Date(consultation.created_at);
                    if (!isNaN(createdAtDate.getTime())) {
                      formattedCreatedAt = format(createdAtDate, 'PPpp');
                    }
                  }
                } catch (e) {
                  console.error("Error formatting created_at date:", e);
                }

                return (
                  <tr key={consultation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consultation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consultation.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consultation.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formattedPreferredDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consultation.study_interest}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${consultationStatusColors[consultation.status] || consultationStatusColors.default }`}>
                         {consultation.status ? consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formattedCreatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/admin/consultations/edit/${consultation.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View/Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminConsultationsPage; 