import React, { useEffect, useState, useCallback } from "react";
import HospitalsList from "./HospitalsList";
import AddEditHospital from "./AddEditHospital";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { healthcareService } from "../../../services/healthcareService";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { FaPlus } from "react-icons/fa";
import DoctorsFilter from "./DoctorsFilter"; // reuse the doctors filter UI

export default function ShowHospital() {
  const { showSnackbar } = useSnackbar();

  // All hospitals fetched from API
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state (used by DoctorsFilter)
  const [filters, setFilters] = useState({});

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // Modal state
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Derived filtered hospitals
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // Fetch hospitals
  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await healthcareService.getHospitals();
      console.log(res);
       console.log(Array.isArray(res.data));
      if (res.status === "success") {
        setHospitals(res.data || []);
      } else {
        showSnackbar("Failed to fetch hospitals", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch hospitals", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchHospitals();
    console.log("TEST");
    
  }, []);

  // Apply filters to hospitals (client-side)
useEffect(() => {
  if (!filters || Object.keys(filters).length === 0) {
    setFilteredHospitals(hospitals);
    setPage(1);
    return;
  }

  const searchText =
    filters.search?.toLowerCase() ||
    filters.searchText?.toLowerCase() || "";

  const result = hospitals.filter((h) => {
    // -------------------------------
    // GLOBAL SEARCH (matches everything)
    // -------------------------------
    if (searchText) {
      const searchable = [
        h.hospitalName,
        h.email,
        h.phone,
        h.address,
        h.area,
        h.city,
        h.state,
        h.pincode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchable.includes(searchText)) return false;
    }

    // -------------------------------
    // Area (Region) filter
    // -------------------------------
    if (filters.area) {
      if (!h.area?.toLowerCase().includes(filters.area.toLowerCase()))
        return false;
    }

    // -------------------------------
    // City filter
    // -------------------------------
    if (filters.city) {
      if (!h.city?.toLowerCase().includes(filters.city.toLowerCase()))
        return false;
    }

    // -------------------------------
    // State filter
    // -------------------------------
    if (filters.state) {
      if (!h.state?.toLowerCase().includes(filters.state.toLowerCase()))
        return false;
    }

    // -------------------------------
    // Department filter
    // -------------------------------
    if (filters.department) {
      if (!h.department || !h.department.includes(filters.department))
        return false;
    }

    // -------------------------------
    // Service filter
    // -------------------------------
    if (filters.service) {
      if (!h.services || !h.services.includes(filters.service))
        return false;
    }

    // -------------------------------
    // Sub-service filter
    // -------------------------------
    if (filters.subService) {
      if (!h.subServices || !h.subServices.includes(filters.subService))
        return false;
    }

    return true;
  });

  setFilteredHospitals(result);
  setPage(1);
}, [filters, hospitals]);

  // Handlers
  const openAdd = () => {
    setSelectedHospital(null);
    setShowAddEdit(true);
  };

  const openEdit = (hospital) => {
    setSelectedHospital(hospital);
    setShowAddEdit(true);
  };

  const onSuccessSave = () => {
    setShowAddEdit(false);
    fetchHospitals();
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await healthcareService.deleteHospital(deleteId);
      if (res.status === "success") {
        showSnackbar("Deleted successfully", "success");
        fetchHospitals();
      } else {
        showSnackbar(res.message || "Delete failed", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil((filteredHospitals.length || 0) / limit));
  const paginated = filteredHospitals.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hospitals</h2>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Hospital
        </button>
      </div>

      {/* Filter (reusing DoctorsFilter) */}
      <div className="mb-4">
        <DoctorsFilter
          doctors={hospitals} // DoctorsFilter expects an array prop; it uses it to build filter lists — hospitals works similarly
          onApply={(newFilters) => setFilters(newFilters)}
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        <HospitalsList
          hospitals={paginated}
          isLoading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </div>

      {/* pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 pb-4">
          <button className="px-4 py-2 bg-gray-200 rounded" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-gray-600">Page {page} of {totalPages}</span>
          <button className="px-4 py-2 bg-gray-200 rounded" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* Add/Edit modal */}
      {showAddEdit && (
        <AddEditHospital
          initialData={selectedHospital}
          isEditing={!!selectedHospital}
          onClose={() => setShowAddEdit(false)}
          onSuccess={onSuccessSave}
        />
      )}

      {/* Delete confirm */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Hospital"
        message="Are you sure you want to delete this hospital? This action cannot be undone."
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}

