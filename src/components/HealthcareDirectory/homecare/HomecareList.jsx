import { useState } from "react";
import { FaTrash, FaEdit, FaUserCircle } from "react-icons/fa";
import { healthcareService } from "../../../services/healthcareService";
import AddEditDiagnostics from "./AddEditDiagnostics";

const HomecareList = ({
  items,
  isLoading,
  pagination,
  currentPage,
  setCurrentPage,
  refresh,
}) => {
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const paginatedItems = items.slice(
    (currentPage - 1) * pagination.limit,
    currentPage * pagination.limit
  );

  const handleDelete = async () => {
    if (!selected?._id) return;
    try {
      await healthcareService.deleteHomecare(selected._id);
      setShowDeleteConfirm(false);
      setSelected(null);
      refresh();
    } catch (err) {
      console.error("Error deleting homecare:", err);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto px-2">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            Loading homecare...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {paginatedItems.map((hc) => (
            <div
              key={hc._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                  {hc.image ? (
                    <img
                      src={hc.image}
                      alt={hc.name}
                      className="w-20 h-20 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUserCircle className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {hc.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">{hc.email}</p>
                    <p className="text-gray-600 text-sm mb-1">{hc.phone}</p>
                    {hc.servicetype && (
                      <p className="text-xs font-medium text-blue-600 mt-1">
                        Service Type: {hc.servicetype}
                      </p>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <strong className="text-sm">Services:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(hc.services || []).map((s, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2.5 py-1 text-xs rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className="text-sm text-gray-700 mb-4">
                  <p>
                    <strong>Address:</strong>{" "}
                    {hc.address?.street}, {hc.address?.area},{" "}
                    {hc.address?.city} - {hc.address?.pincode}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelected(hc);
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelected(hc);
                      setShowDeleteConfirm(true);
                    }}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && items.length > 0 && (
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            Page {currentPage} of {pagination.pages}
          </div>
        )}
      </div>

      {isEditing && selected && (
        <AddEditDiagnostics
          initialData={selected}
          isEditing={true}
          onClose={() => {
            setIsEditing(false);
            setSelected(null);
          }}
          onSuccess={() => {
            setIsEditing(false);
            setSelected(null);
            refresh();
          }}
        />
      )}

      {showDeleteConfirm && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Homecare?</h3>
            <p className="mb-6 text-gray-600">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelected(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomecareList;
