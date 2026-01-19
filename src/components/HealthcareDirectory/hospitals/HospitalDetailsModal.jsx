import { FaTimes, FaUserCircle } from "react-icons/fa";

const HospitalDetailsModal = ({ isOpen, onClose, hospital }) => {
  if (!isOpen || !hospital) return null;

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
              <h3 className="text-xl font-semibold">{hospital.hospitalName}</h3>
              <p className="text-sm text-gray-500">
                {hospital.area}, {hospital.city}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          {/* Basic Info */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Basic Info</h4>
            <div className="space-y-1 text-gray-600">
              <div><strong>Phone:</strong> {hospital.phone}</div>
              <div><strong>Email:</strong> {hospital.email}</div>
              <div><strong>Website:</strong> {hospital.website || "—"}</div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
            <div className="space-y-1 text-gray-600">
              <div>{hospital.address}</div>
              <div>{hospital.area}, {hospital.city}</div>
              <div>{hospital.state} - {hospital.pincode}</div>
            </div>
          </div>

          {/* Medical */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-800 mb-2">Medical Services</h4>
            <div className="text-gray-600 space-y-1">
              <div><strong>Departments:</strong> {hospital.department?.join(", ")}</div>
              <div><strong>Services:</strong> {hospital.services?.join(", ")}</div>
              <div><strong>Sub Services:</strong> {hospital.subServices?.join(", ")}</div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Legal</h4>
            <div className="text-gray-600">
              <strong>GST:</strong> {hospital.gstNumber || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetailsModal;
