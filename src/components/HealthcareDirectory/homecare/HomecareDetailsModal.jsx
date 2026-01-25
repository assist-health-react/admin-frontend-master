// src/components/HealthcareDirectory/homecare/HomecareDetailsModal.jsx
import { FaTimes, FaUserCircle } from "react-icons/fa";

const HomecareDetailsModal = ({ isOpen, onClose, homecare }) => {
  if (!isOpen || !homecare) return null;

  const a = homecare.address || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <FaUserCircle className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{homecare.name}</h3>
              <p className="text-sm text-gray-500">{homecare.phone}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">

          {/* Basic Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Basic Info</h4>
            <p><strong>Email:</strong> {homecare.email || "—"}</p>
            <p><strong>Phone:</strong> {homecare.phone || "—"}</p>
            <p><strong>Service Type:</strong> {homecare.servicetype || "—"}</p>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
            <p>
              {[a.street, a.area, a.city, a.state, a.pincode]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-800 mb-2">Services</h4>
            <p>
              {(homecare.services && homecare.services.length > 0)
                ? homecare.services.join(", ")
                : "—"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomecareDetailsModal;
