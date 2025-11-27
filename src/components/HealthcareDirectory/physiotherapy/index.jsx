import { useState, useEffect } from 'react'
import { doctorsService } from '../../../services/doctorsService'
import PhysiotherapyList from './PhysiotherapyList'
import DoctorDetail from './DoctorDetail'
import AddEditDoctor from './AddEditDiagnostics'
import AssignedMembersModal from './AssignedMembersModal'
import PhysiotherapyFilter from './filters/PhysiotherapyFilter'
import { healthcareService } from "../../../services/healthcareService";
const ShowPhysiotherapy = () => {
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
  const fetchPhysiotherapy = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await healthcareService.getPhysiotherapy();

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
        setError("Failed to fetch physiotherapy centers.");
      }
    } catch (err) {
      console.error("Error fetching physiotherapy:", err);
      setError("Failed to fetch physiotherapy centers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhysiotherapy();
  }, []);

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

      // service type filter
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
  // ✅ Run fetchDoctors on mount + when page changes
  useEffect(() => {
    fetchPhysiotherapy()
  }, [currentPage])

  // // ✅ When filters change, apply them to doctors list
  // useEffect(() => {
  //   if (!filters || Object.keys(filters).length === 0) {
  //     setFilteredDoctors(doctors)
  //     return
  //   }

  //   const filtered = doctors.filter((doc) => {
  //     const search = filters.search?.toLowerCase() || ''

  //     if (
  //       search &&
  //       ![doc.name, doc.email, doc.phone]
  //         .filter(Boolean)
  //         .join(' ')
  //         .toLowerCase()
  //         .includes(search)
  //     )
  //       return false

  //     if (filters.department && doc.departmentDetails?.department !== filters.department)
  //       return false

  //     if (filters.service && !(doc.departmentDetails?.services || []).includes(filters.service))
  //       return false

  //     if (
  //       filters.subService &&
  //       !(doc.departmentDetails?.subServices || []).includes(filters.subService)
  //     )
  //       return false

  //     if (
  //       filters.consultationType &&
  //       !(doc.serviceTypes || []).includes(filters.consultationType)
  //     )
  //       return false

  //     if (
  //       filters.city &&
  //       !doc.offlineAddress?.city?.toLowerCase().includes(filters.city.toLowerCase())
  //     )
  //       return false

  //     if (
  //       filters.state &&
  //       !doc.offlineAddress?.state?.toLowerCase().includes(filters.state.toLowerCase())
  //     )
  //       return false

  //     return true
  //   })

  //   setFilteredDoctors(filtered)
  // }, [filters, doctors])

  // // ✅ Receive filters from DoctorsFilter.jsx
  // const handleFilterChange = (newFilters) => {
  //   console.log('Received Filters:', newFilters)
  //   setFilters(newFilters)
  //   setCurrentPage(1)
  // }

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
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">

          {/* Add Button + Filters */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  + Add Physiotherapy
                </button>
              </div>
      
              <PhysiotherapyFilter onApply={handleFilterChange} />
            </div>
      
      {/* <DoctorsList
        doctors={filteredDoctors}
        isLoading={isLoading}
        onViewProfile={handleViewProfile}
        onViewMembers={handleViewMembers}
        onAddDoctor={() => setShowAddForm(true)}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onFilterChange={handleFilterChange}
      /> */}

         <PhysiotherapyList
        items={filtered}
        isLoading={isLoading}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        refresh={fetchPhysiotherapy}
      />


      {showAddForm && (
        <AddEditDoctor
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            fetchPhysiotherapy() // Refresh list after adding
          }}
        />
      )}

      {selectedDoctor && !showAssignedMembers && (
        <DoctorDetail
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onDeleteSuccess={() => {
            setSelectedDoctor(null)
            fetchDoctors()
          }}
        />
      )}

      {showAssignedMembers && selectedDoctor && (
        <AssignedMembersModal
          isOpen={showAssignedMembers}
          onClose={() => {
            setShowAssignedMembers(false)
            setSelectedDoctor(null)
          }}
          doctor={selectedDoctor}
        />
      )}

      {error && <div className="text-red-500 text-center py-4">{error}</div>}
    </div>
  )
}

export default ShowPhysiotherapy
