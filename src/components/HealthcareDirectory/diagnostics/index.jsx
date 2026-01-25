// export default ShowDiagnostics
import { useState, useEffect } from "react";
import { healthcareService } from "../../../services/healthcareService";

import DiagnosticsList from "./DiagnosticsList";
import DiagnosticsFilter from "./filters/DiagnosticsFilter";
import AddEditDiagnostics from "./AddEditDiagnostics";

export default function ShowDiagnostics() {
  const itemsPerPage = 8;

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: itemsPerPage,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // =============================
  // FETCH Diagnostics
  // =============================
  const fetchDiagnostics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await healthcareService.getDiagnostics();

      if (response.status === "success") {
        setItems(response.data || []);
        setFiltered(response.data || []);

        setPagination({
          total: response.data.length,
          pages: Math.ceil(response.data.length / itemsPerPage),
          page: currentPage,
          limit: itemsPerPage,
        });
      } else {
        setError("Failed to fetch diagnostics");
      }
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
      setError("Failed to fetch diagnostics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  // =============================
  // FILTERING LOGIC
  // =============================
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFiltered(items);
      return;
    }

    const f = items.filter((x) => {
      const search = filters.search?.toLowerCase() || "";

      if (
        search &&
        ![
          x.name,
          x.email,
          x.phone,
          x.address?.street,
          x.address?.area,
          x.address?.city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search)
      )
        return false;

      if (filters.service && !(x.services || []).includes(filters.service))
        return false;

      if (
        filters.city &&
        !x.address?.city?.toLowerCase().includes(filters.city.toLowerCase())
      )
        return false;

      if (
        filters.state &&
        !x.address?.state?.toLowerCase().includes(filters.state.toLowerCase())
      )
        return false;

      if (
        filters.area &&
        !x.address?.area?.toLowerCase().includes(filters.area.toLowerCase())
      )
        return false;

      return true;
    });

    setFiltered(f);
  }, [filters, items]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Add Button + Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Diagnostics
          </button>
        </div>

        <DiagnosticsFilter onApply={handleFilterChange} />
      </div>

      {/* Diagnostics List */}
      <DiagnosticsList
        items={filtered}
        isLoading={isLoading}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        refresh={fetchDiagnostics}
      />

      {/* Add / Edit Form */}
      {showAddForm && (
        <AddEditDiagnostics
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchDiagnostics();
          }}
        />
      )}

      {error && <div className="text-red-500 text-center py-4">{error}</div>}
    </div>
  );
}
