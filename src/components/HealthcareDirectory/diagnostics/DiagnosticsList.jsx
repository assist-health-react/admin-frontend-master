import { FaTrash, FaEdit, FaUserCircle } from "react-icons/fa";
import AddEditDiagnostics from "./AddEditDiagnostics";
import { useState } from "react";
import { healthcareService } from "../../../services/healthcareService";
import DiagnosticsDetailsModal from "./DiagnosticsDetailsModal";

export default function DiagnosticsList({
  items,
  isLoading,
  pagination,
  currentPage,
  setCurrentPage,
  refresh,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
   const [selectedDiagnostic, setSelectedDiagnostic] = useState(null);//2026

  // Delete record
  const handleDelete = async (id) => {
    await healthcareService.deleteDiagnostics(id);
    refresh();
    setShowDelete(false);
  };

  const paginatedItems = items.slice(
    (currentPage - 1) * pagination.limit,
    currentPage * pagination.limit
  );

  return (
    <>
      <div className="flex-1 overflow-auto px-2">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            Loading diagnostics...
          </div>
        )}

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {paginatedItems.map((item) => (
            // <div
            //   key={item._id}
            //   className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100"
            // >
            //   <div className="p-6 flex flex-col h-full">
            //     {/* Header */}
            //     <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
            //       {item.image ? (
            //         <img
            //           src={item.image}
            //           className="w-20 h-20 rounded-full object-cover"
            //         />
            //       ) : (
            //         <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            //           <FaUserCircle className="w-12 h-12 text-gray-400" />
            //         </div>
            //       )}

            //       <div className="flex-1 min-w-0">
            //         <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            //         <p className="text-sm text-gray-600">{item.email}</p>
            //         <p className="text-sm text-gray-600">{item.phone}</p>
            //       </div>
            //     </div>

            //     {/* Services */}
            //     <div className="mb-4">
            //       <strong className="text-sm">Services:</strong>
            //       <div className="flex flex-wrap gap-2 mt-2">
            //         {(item.services || []).map((s, index) => (
            //           <span
            //             key={index}
            //             className="bg-blue-50 text-blue-700 px-2.5 py-1 text-xs rounded-md"
            //           >
            //             {s}
            //           </span>
            //         ))}
            //       </div>
            //     </div>

            //     {/* Address */}
            //     <div className="text-sm text-gray-700 mb-4">
            //       <p>
            //         <strong>Address:</strong>{" "}
            //         {item.address?.street}, {item.address?.area},{" "}
            //         {item.address?.city} - {item.address?.pincode}
            //       </p>
            //     </div>

            //     {/* Actions */}
            //     <div className="flex gap-3 mt-auto pt-4 border-t border-gray-200">
            //       <button
            //         onClick={() => {
            //           setSelected(item);
            //           setIsEditing(true);
            //         }}
            //         className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
            //       >
            //         <FaEdit /> Edit
            //       </button>

            //       <button
            //         onClick={() => {
            //           setSelected(item);
            //           setShowDelete(true);
            //         }}
            //         className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm flex items-center gap-2"
            //       >
            //         <FaTrash /> Delete
            //       </button>
            //     </div>
            //   </div>
            // </div>
            <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
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

                  {/* Services */}
                  <div className="text-sm text-gray-600 mb-4 truncate">
                    <strong>Services:</strong>{" "}
                    {(item.services || []).slice(0, 2).join(", ")}
                    {item.services?.length > 2 && " +more"}
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
                        setShowDelete(true);
                      }}
                      className="px-3 py-1.5 text-sm bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setSelectedDiagnostic(item)}
                      className="ml-auto px-3 py-1.5 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
        <DiagnosticsDetailsModal
            isOpen={!!selectedDiagnostic}
            diagnostic={selectedDiagnostic}
            onClose={() => setSelectedDiagnostic(null)}
          />

        {/* Pagination */}
        {/* {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center text-sm text-gray-600">
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
        <AddEditDiagnostics
          initialData={selected}
          isEditing={true}
          onClose={() => {
            setIsEditing(false);
            setSelected(null);
          }}
          onSuccess={() => {
            setIsEditing(false);
            refresh();
          }}
        />
      )}

      {/* Simple Delete Popup */}
      {showDelete && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              Delete Diagnostics Center?
            </h3>
            <p className="mb-6 text-gray-600">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selected._id)}
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
}
