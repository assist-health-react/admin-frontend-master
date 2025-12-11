
// import React, { useEffect, useState } from "react";
// import {
//   HOSPITAL_DEPARTMENTS,
//   HOSPITAL_SERVICES,
//   HOSPITAL_SUBSERVICES
// } from "../doctorsData";

// export default function DepartmentServiceSection({ formData, setFormData }) {
//   const [departments, setDepartments] = useState(formData.departments || []);
//   const [services, setServices] = useState(formData.services || []);
//   const [subServices, setSubServices] = useState(formData.subServices || []);

//   // Sync with global form
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       departments,
//       services,
//       subServices,
//     }));
//   }, [departments, services, subServices]);

//   // Toggle Department
//   const toggleDepartment = (dept) => {
//     setDepartments((prev) =>
//       prev.includes(dept)
//         ? prev.filter((d) => d !== dept)
//         : [...prev, dept]
//     );
//   };

//   // Toggle Service
//   const toggleService = (srv) => {
//     setServices((prev) => {
//       const updated = prev.includes(srv)
//         ? prev.filter((s) => s !== srv)
//         : [...prev, srv];

//       // Remove sub-services of removed service
//       const validSubs = updated.flatMap((s) => HOSPITAL_SUBSERVICES[s] || []);
//       setSubServices((prevSubs) =>
//         prevSubs.filter((ss) => validSubs.includes(ss))
//       );

//       return updated;
//     });
//   };

//   // Toggle Sub-service
//   const toggleSubService = (sub) => {
//     setSubServices((prev) =>
//       prev.includes(sub)
//         ? prev.filter((s) => s !== sub)
//         : [...prev, sub]
//     );
//   };

//   // Available sub-services
//   const availableSubServices = services.flatMap(
//     (srv) => HOSPITAL_SUBSERVICES[srv] || []
//   );

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
//       <h3 className="text-lg font-semibold mb-4">Departments, Services & Sub-Services</h3>

//       {/* ---------------------------
//           Departments (Independent)
//       ---------------------------- */}
//       <label className="block text-sm font-medium mb-2">Departments *</label>
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
//         {HOSPITAL_DEPARTMENTS.map((dept) => (
//           <label
//             key={dept}
//             className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
//               departments.includes(dept)
//                 ? "bg-purple-100 border-purple-500"
//                 : "border-gray-300"
//             }`}
//           >
//             <input
//               type="checkbox"
//               checked={departments.includes(dept)}
//               onChange={() => toggleDepartment(dept)}
//             />
//             {dept}
//           </label>
//         ))}
//       </div>

//       {/* ---------------------------
//           Services (Independent)
//       ---------------------------- */}
//       <label className="block text-sm font-medium mb-2">Services *</label>
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
//         {HOSPITAL_SERVICES.map((srv) => (
//           <label
//             key={srv}
//             className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
//               services.includes(srv)
//                 ? "bg-green-100 border-green-500"
//                 : "border-gray-300"
//             }`}
//           >
//             <input
//               type="checkbox"
//               checked={services.includes(srv)}
//               onChange={() => toggleService(srv)}
//             />
//             {srv}
//           </label>
//         ))}
//       </div>

//       {/* ---------------------------
//           Sub-Services (Dependent)
//       ---------------------------- */}
//       {services.length > 0 && (
//         <>
//           <label className="block text-sm font-medium mb-2">Sub-Services</label>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//             {availableSubServices.map((sub) => (
//               <label
//                 key={sub}
//                 className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
//                   subServices.includes(sub)
//                     ? "bg-blue-100 border-blue-500"
//                     : "border-gray-300"
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={subServices.includes(sub)}
//                   onChange={() => toggleSubService(sub)}
//                 />
//                 {sub}
//               </label>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  HOSPITAL_DEPARTMENTS,
  HOSPITAL_SERVICES,
  HOSPITAL_SUBSERVICES
} from "../doctorsData";

export default function DepartmentServiceSection({ formData, setFormData }) {
  // IMPORTANT: Use singular keys to match AddEditHospital
  const [department, setDepartment] = useState(formData.department || []);
  const [services, setServices] = useState(formData.services || []);
  const [subServices, setSubServices] = useState(formData.subServices || []);

  // Sync to parent form correctly
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      department,    // FIXED ✔
      services,
      subServices,
    }));
  }, [department, services, subServices]);

  const toggleDepartment = (dept) => {
    setDepartment((prev) =>
      prev.includes(dept)
        ? prev.filter((d) => d !== dept)
        : [...prev, dept]
    );
  };

  const toggleService = (srv) => {
    setServices((prev) => {
      const updated = prev.includes(srv)
        ? prev.filter((s) => s !== srv)
        : [...prev, srv];

      const validSubs = updated.flatMap((s) => HOSPITAL_SUBSERVICES[s] || []);
      setSubServices((prevSubs) =>
        prevSubs.filter((ss) => validSubs.includes(ss))
      );

      return updated;
    });
  };

  const toggleSubService = (sub) => {
    setSubServices((prev) =>
      prev.includes(sub)
        ? prev.filter((s) => s !== sub)
        : [...prev, sub]
    );
  };

  const availableSubServices = services.flatMap(
    (srv) => HOSPITAL_SUBSERVICES[srv] || []
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Departments, Services & Sub-Services
      </h3>

      {/* Departments */}
      <label className="block text-sm font-medium mb-2">Departments *</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {HOSPITAL_DEPARTMENTS.map((dept) => (
          <label
            key={dept}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              department.includes(dept)
                ? "bg-purple-100 border-purple-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={department.includes(dept)}
              onChange={() => toggleDepartment(dept)}
            />
            {dept}
          </label>
        ))}
      </div>

      {/* Services */}
      <label className="block text-sm font-medium mb-2">Services *</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {HOSPITAL_SERVICES.map((srv) => (
          <label
            key={srv}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              services.includes(srv)
                ? "bg-green-100 border-green-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={services.includes(srv)}
              onChange={() => toggleService(srv)}
            />
            {srv}
          </label>
        ))}
      </div>

      {/* Sub-Services */}
      {services.length > 0 && (
        <>
          <label className="block text-sm font-medium mb-2">Sub-Services</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSubServices.map((sub) => (
              <label
                key={sub}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
                  subServices.includes(sub)
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={subServices.includes(sub)}
                  onChange={() => toggleSubService(sub)}
                />
                {sub}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
