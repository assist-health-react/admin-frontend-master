import { useState } from "react";
import { FaTrash, FaEdit, FaUserCircle } from "react-icons/fa";
import { healthcareService } from "../../../services/healthcareService";
import AddEditDoctor from './AddEditDiagnostics'
import PhysiotherapyDetailsModal from './PhysiotherapyDetailsModal'

export default function PhysiotherapyList({
  items,
  isLoading,
  pagination,
  currentPage,
  setCurrentPage,
  refresh,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPhysio, setSelectedPhysio] = useState(null);

  const paginatedItems = items.slice(
    (currentPage - 1) * pagination.limit,
    currentPage * pagination.limit
  );

  const handleDelete = async () => {
    if (!selected?._id) return;
    await healthcareService.deletePhysiotherapy(selected._id);
    setShowDeleteConfirm(false);
    setSelected(null);
    refresh();
  };

  return (
    <>
      <div className="flex-1 overflow-auto px-2">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2" />
            Loading physiotherapy centers...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            > 
            <div className="p-5 flex flex-col h-full">

                  {/* Header */}
                  <div className="flex gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                      <FaUserCircle className="w-8 h-8 text-blue-400" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.phone}</p>
                      <p className="text-sm text-gray-500">
                        {item.address?.city}, {item.address?.area}
                      </p>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="text-sm text-gray-600 mb-4">
                    <p><strong>Type:</strong> {item.servicetype}</p>
                    <p className="truncate">
                      <strong>Services:</strong>{" "}
                      {(item.services || []).slice(0, 2).join(", ")}
                      {item.services?.length > 2 && " +more"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2 pt-3 border-t">
                    <button
                      onClick={() => {
                        setSelected(item);
                        setIsEditing(true);
                      }}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelected(item);
                        setShowDeleteConfirm(true);
                      }}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setSelectedPhysio(item)}
                      className="ml-auto px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>

              
            </div>
          ))}
        </div>

        {/* Pagination */}
        {/* {!isLoading && items.length > 0 && (
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            Page {currentPage} of {pagination.pages}
          </div>
        )} */}
         {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-600">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {pagination.pages}
              </span>

              <button
                onClick={() =>
                  currentPage < pagination.pages &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage >= pagination.pages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
      </div>

      {/* Edit Modal */}
      {isEditing && selected && (
        <AddEditDoctor
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

      {/* Delete Confirm (simple) */}
      {showDeleteConfirm && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Delete Physiotherapy?
            </h3>
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
      <PhysiotherapyDetailsModal
          isOpen={!!selectedPhysio}
          physio={selectedPhysio}
          onClose={() => setSelectedPhysio(null)}
        />

    </>
  );
}
