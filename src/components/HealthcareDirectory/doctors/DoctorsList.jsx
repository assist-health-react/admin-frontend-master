
import React, { useState } from "react";
import { FaEdit, FaTrash, FaUserMd } from "react-icons/fa";

export default function DoctorsList({
  doctors = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(null);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin w-6 h-6 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2">Loading doctors...</p>
      </div>
    );
  }

  if (!doctors.length) {
    return <p className="text-center text-gray-500 p-4">No doctors found</p>;
  }
  console.log(doctors);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {doctors.map((d) => (
        <div
          key={d._id}
          className="bg-white border rounded-xl shadow-md p-5 hover:shadow-lg transition"
        >
          {/* Header */}
          <div className="flex gap-4 border-b pb-3 mb-3">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {d.photoUrl ? (
                <img src={d.photoUrl} className="w-full h-full object-cover" />
              ) : (
                <FaUserMd className="text-4xl text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{d.name}</h3>
              <p className="text-sm text-gray-600">{d.email}</p>
              <p className="text-sm text-gray-600">{d.phone}</p>
            </div>
          </div>

          {/* Short Info */}
          <div className="text-sm text-gray-700 space-y-1">
            
        {d.specialty && (
          <p>
            <strong>Specialty:</strong> {Array.isArray(d.specialty) 
              ? d.specialty.join(", ") 
              : d.specialty}
          </p>
        )}
        {d.specializations && (
          <p>
            <strong>Sub-Specialty:</strong> {Array.isArray(d.specializations) 
              ? d.specializations.join(", ") 
              : d.specializations}
          </p>
        )}
           
            {/* <p><strong>Sub-Specialty:</strong> {d.subSpecialtyId?.name}</p> */}
            <p><strong>Experience:</strong> {d.experienceYears} yrs</p>
            <p><strong>Consultation:</strong> {d.serviceTypes?.join(", ")}</p>
            <p><strong>City:</strong> {d.offlineAddress?.city}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 border-t pt-3">
            <button
              onClick={() => onEdit(d)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded flex items-center gap-2"
            >
              <FaEdit size={14} /> Edit
            </button>

            <button
              onClick={() => onDelete(d._id)}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded flex items-center gap-2"
            >
              <FaTrash size={14} /> Delete
            </button>

            <button
              onClick={() => setExpanded(expanded === d._id ? null : d._id)}
              className="ml-auto text-gray-600 hover:text-gray-800 text-sm"
            >
              {expanded === d._id ? "Close" : "View"}
            </button>
          </div>

          {/* Expanded */}
          {expanded === d._id && (
            <div className="mt-3 pt-3 border-t text-sm text-gray-700 space-y-2 animate-fadeIn">
              <p><strong>Qualification:</strong> {d.qualification}</p>
              <p><strong>MCN:</strong> {d.medicalCouncilRegistrationNumber}</p>
              {/* <p><strong>Clinic:</strong> {d.clinicName}</p> */}
             {d.offlineAddress && (
              <p>
                <strong>Address:</strong>{" "}
                {[
                  d.offlineAddress.description,
                  d.offlineAddress.landmark,
                  d.offlineAddress.region,
                  d.offlineAddress.city,
                  d.offlineAddress.state,
                  d.offlineAddress.pinCode,
                  d.offlineAddress.country
                ].filter(Boolean).join(", ")}
              </p>
            )}

              {/* <p><strong>Bio:</strong> {d.bio}</p> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}