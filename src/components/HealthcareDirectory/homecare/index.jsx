import { useState, useEffect } from 'react'
import { healthcareService } from '../../../services/healthcareService'
import DoctorsList from './DoctorsList'
import DoctorDetail from './DoctorDetail'
import AddEditDoctor from './AddEditDiagnostics'
import AssignedMembersModal from './AssignedMembersModal'
import HomecareFilter from "./filters/HomecareFilter";
import HomecareList from "./HomecareList";
const ShowHomecare = () => {
  const itemsPerPage = 9 // Show 9 doctors per page (3x3 grid)
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [filters, setFilters] = useState({})

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: itemsPerPage
  })

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAssignedMembers, setShowAssignedMembers] = useState(false)

  // ✅ Fetch all doctors from API
   const fetchHomecare = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await healthcareService.getHomecare();

      if (response.status === "success") {
        const data = response.data || [];
        setItems(data);
        setFiltered(data);
        setPagination({
          total: data.length,
          pages: Math.ceil(data.length / itemsPerPage),
          page: currentPage,
          limit: itemsPerPage,
        });
      } else {
        setError("Failed to fetch homecare data.");
      }
    } catch (err) {
      console.error("Error fetching homecare:", err);
      setError("Failed to fetch homecare data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomecare();
  }, []);

  // ✅ When filters change, apply them to doctors list
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

      if (filters.type && filters.type !== "All") {
        if (filters.type === "Both") {
          if (x.servicetype !== "Both") return false;
        } else {
          if (x.servicetype !== filters.type && x.servicetype !== "Both") {
            return false;
          }
        }
      }

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

  // ✅ View Profile
  const handleViewProfile = async (doctor) => {
    try {
      const response = await doctorsService.getDoctorById(doctor._id)
      if (response.status === 'success' && response.data) {
        setSelectedDoctor(response.data)
      } else {
        setError('Failed to fetch doctor details.')
      }
    } catch (err) {
      setError('Failed to fetch doctor details.')
      console.error('Error fetching doctor details:', err)
    }
  }

  // ✅ View Members
  const handleViewMembers = async (doctor) => {
    try {
      const response = await doctorsService.getDoctorById(doctor.id)
      if (response.status === 'success' && response.data) {
        setSelectedDoctor(response.data)
        setShowAssignedMembers(true)
      } else {
        setError('Failed to fetch doctor details.')
      }
    } catch (err) {
      setError('Failed to fetch doctor details.')
      console.error('Error fetching doctor details:', err)
    }
  }

  return (
    // <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
    //   <DoctorsList
    //     doctors={filteredDoctors}
    //     isLoading={isLoading}
    //     onViewProfile={handleViewProfile}
    //     onViewMembers={handleViewMembers}
    //     onAddDoctor={() => setShowAddForm(true)}
    //     pagination={pagination}
    //     currentPage={currentPage}
    //     setCurrentPage={setCurrentPage}
    //     onFilterChange={handleFilterChange}
    //   />

    //   {showAddForm && (
    //     <AddEditDoctor
    //       onClose={() => setShowAddForm(false)}
    //       onSuccess={() => {
    //         setShowAddForm(false)
    //         fetchDoctors() // Refresh list after adding
    //       }}
    //     />
    //   )}

    //   {selectedDoctor && !showAssignedMembers && (
    //     <DoctorDetail
    //       doctor={selectedDoctor}
    //       onClose={() => setSelectedDoctor(null)}
    //       onDeleteSuccess={() => {
    //         setSelectedDoctor(null)
    //         fetchDoctors()
    //       }}
    //     />
    //   )}

    //   {showAssignedMembers && selectedDoctor && (
    //     <AssignedMembersModal
    //       isOpen={showAssignedMembers}
    //       onClose={() => {
    //         setShowAssignedMembers(false)
    //         setSelectedDoctor(null)
    //       }}
    //       doctor={selectedDoctor}
    //     />
    //   )}

    //   {error && <div className="text-red-500 text-center py-4">{error}</div>}
    // </div>
       <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            + Add Homecare
          </button>
        </div>

        <HomecareFilter onApply={handleFilterChange} />
      </div>

      <HomecareList
        items={filtered}
        isLoading={isLoading}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        refresh={fetchHomecare}
      />

      {showAddForm && (
        <AddEditDoctor
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchHomecare();
          }}
        />
      )}

      {error && <div className="text-red-500 text-center py-4">{error}</div>}
    </div>
  
  )
}

export default ShowHomecare
