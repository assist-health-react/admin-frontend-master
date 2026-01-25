import { FaTimes, FaUserMd } from "react-icons/fa";

const DoctorDetailsModal = ({ isOpen, onClose, doctor }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <FaUserMd className="text-blue-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-sm text-gray-500">{doctor.specialty}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          {/* Basic */}
          <div>
            <h4 className="font-semibold mb-2">Basic Info</h4>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
          </div>

          {/* Professional */}
          <div>
            <h4 className="font-semibold mb-2">Professional</h4>
            <p><strong>Qualification:</strong> {doctor.qualification}</p>
            <p><strong>Experience:</strong> {doctor.experienceYears} yrs</p>
            <p><strong>MCN:</strong> {doctor.medicalCouncilRegistrationNumber}</p>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-2">Services</h4>
            <p><strong>Consultation:</strong> {doctor.serviceTypes?.join(", ")}</p>
            <p>
                <strong>Sub-Specialties:</strong>{" "}
                {doctor.specializations?.map(s => s.name || s.label).join(", ") || "—"}
                </p>
          </div>

          {/* Address */}
          {doctor.offlineAddress && (
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-2">Clinic Address</h4>
              <p>
                {[
                  doctor.offlineAddress.description,
                  doctor.offlineAddress.region,
                  doctor.offlineAddress.city,
                  doctor.offlineAddress.state,
                  doctor.offlineAddress.pinCode,
                ].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsModal;
