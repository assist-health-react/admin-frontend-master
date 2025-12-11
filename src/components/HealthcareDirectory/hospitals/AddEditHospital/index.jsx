// import { useState, useEffect } from "react";
// import { FaTimes } from "react-icons/fa";
// import { useSnackbar } from "../../../../contexts/SnackbarContext";
// import { healthcareService } from "../../../../services/healthcareService";
// import DepartmentServiceSection from "./DepartmentServiceSection";

// const AddEditHospital = ({ onClose, initialData, isEditing, onSuccess }) => {
//   const { showSnackbar } = useSnackbar();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // -------------------------------
//   // FORM DATA (Correct Keys)
//   // -------------------------------
//   const [formData, setFormData] = useState({
//     hospitalName: initialData?.hospitalName || "",
//     email: initialData?.email || "",
//     phone: initialData?.phone || "",
//     website: initialData?.website || "",
//     address: initialData?.address || "",
//     area: initialData?.area || "",
//     city: initialData?.city || "",
//     state: initialData?.state || "",
//     pincode: initialData?.pincode || "",
//     gstNumber: initialData?.gstNumber || "",

//     // Required
//     department: initialData?.department || [],
//     services: initialData?.services || [],
//     subServices: initialData?.subServices || []
//   });

//   // ============================
//   // Input Handler
//   // ============================
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "phone") {
//       const phoneValue = value.replace(/\D/g, "").slice(0, 10);
//       setFormData((prev) => ({ ...prev, phone: phoneValue }));
//       return;
//     }

//     if (name === "pincode") {
//       const pin = value.replace(/\D/g, "").slice(0, 6);
//       setFormData((prev) => ({ ...prev, pincode: pin }));
//       return;
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ============================
//   // SUBMIT HANDLER (Final Clean)
//   // ============================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // BASIC REQUIRED FIELDS
//     const requiredFields = [
//       ["hospitalName", "Hospital Name is required"],
//       ["email", "Email is required"],
//       ["phone", "Valid 10-digit phone required"],
//       ["address", "Address required"],
//       ["area", "Area required"],
//       ["city", "City required"],
//       ["state", "State required"],
//       ["pincode", "Valid 6-digit pincode"],
//     ];

//     for (const [field, message] of requiredFields) {
//       if (!formData[field] || formData[field].trim() === "") {
//         showSnackbar(message, "error");
//         return;
//       }
//       if (field === "phone" && formData.phone.length !== 10) {
//         showSnackbar("Valid 10-digit phone required", "error");
//         return;
//       }
//       if (field === "pincode" && formData.pincode.length !== 6) {
//         showSnackbar("Valid 6-digit pincode required", "error");
//         return;
//       }
//     }

//     // DROPDOWN VALIDATION
//     if (formData.department.length === 0) {
//       showSnackbar("Select Department", "error");
//       return;
//     }
//     if (formData.services.length === 0) {
//       showSnackbar("Select Service", "error");
//       return;
//     }
//     if (formData.subServices.length === 0) {
//       showSnackbar("Select Sub Service", "error");
//       return;
//     }

//     // PREPARE PAYLOAD
//     const payload = {
//       ...formData,
//       phone: "+91" + formData.phone
//     };

//     try {
//       let res;

//       if (isEditing) {
//         res = await healthcareService.updateHospital(initialData._id, payload);
//       } else {
//         res = await healthcareService.createHospital(payload);
//       }

//       if (res.status === "success") {
//         showSnackbar("Saved successfully", "success");
//         onSuccess?.();
//         onClose?.();
//       } else {
//         showSnackbar("Failed to save", "error");
//       }
//     } catch (err) {
//       showSnackbar("Failed to save", "error");
//     }
//   };

//   // ============================
//   // FORM UI
//   // ============================
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div
//         className="bg-white rounded-xl p-6 lg:p-8 w-[95%] max-w-5xl mx-4 max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-start mb-6">
//           <h3 className="text-2xl font-semibold text-gray-800">
//             {isEditing ? "Edit Hospital" : "Add New Hospital"}
//           </h3>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//             <FaTimes className="text-gray-500" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* -----------------------------------------
//                HOSPITAL DETAILS
//           ----------------------------------------- */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {[
//               ["hospitalName", "Hospital Name *"],
//               ["email", "Email *"],
//               ["phone", "Phone *"],
//               ["website", "Website"],
//               ["area", "Area *"],
//               ["city", "City *"],
//               ["state", "State *"],
//               ["pincode", "Pincode *"],
//             ].map(([name, label]) => (
//               <div key={name}>
//                 <label className="text-sm font-medium">{label}</label>
//                 <input
//                   type="text"
//                   name={name}
//                   value={formData[name]}
//                   onChange={handleInputChange}
//                   className="border rounded-lg w-full px-3 py-2"
//                 />
//               </div>
//             ))}

//             <div className="md:col-span-2">
//               <label className="text-sm font-medium">Address *</label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="border rounded-lg w-full px-3 py-2 h-20"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="text-sm font-medium">GST Number</label>
//               <input
//                 type="text"
//                 name="gstNumber"
//                 value={formData.gstNumber}
//                 onChange={handleInputChange}
//                 className="border rounded-lg w-full px-3 py-2"
//               />
//             </div>
//           </div>

//           {/* -----------------------------------------
//                DEPARTMENT / SERVICES SECTION
//           ----------------------------------------- */}
//           <DepartmentServiceSection formData={formData} setFormData={setFormData} />

//           {/* -----------------------------------------
//                ACTION BUTTONS
//           ----------------------------------------- */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-100 rounded-lg"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Hospital"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEditHospital;
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { healthcareService } from "../../../../services/healthcareService";
import DepartmentServiceSection from "./DepartmentServiceSection";

const AddEditHospital = ({ onClose, initialData, isEditing, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------------
  // FORM DATA
  // -------------------------------
  const [formData, setFormData] = useState({
    hospitalName: initialData?.hospitalName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    address: initialData?.address || "",
    area: initialData?.area || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    country: "India",
    gstNumber: initialData?.gstNumber || "",
    department: initialData?.department || [],
    services: initialData?.services || [],
    subServices: initialData?.subServices || [],
  });

  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);

  // ============================
  // PINCODE API
  // ============================
  const handlePincodeAPI = async (pincode) => {
    if (pincode.length !== 6) {
      setRegionOptions([]);
      setFormData((prev) => ({ ...prev, city: "", state: "" }));
      return;
    }

    setIsLoadingRegions(true);

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status === "Success") {
        const PO = data[0].PostOffice;

        const regionList = PO.map((x) => ({
          value: x.Name,
          label: x.Name,
        }));

        setRegionOptions(regionList);

        setFormData((prev) => ({
          ...prev,
          city: PO[0].District,
          state: PO[0].State,
        }));
      } else {
        showSnackbar("Invalid PIN code", "error");
        setRegionOptions([]);

        setFormData((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (e) {
      showSnackbar("Error fetching pincode details", "error");
    } finally {
      setIsLoadingRegions(false);
    }
  };

  // ============================
  // INPUT HANDLER
  // ============================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: phoneValue }));
      return;
    }

    if (name === "pincode") {
      const pin = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, pincode: pin }));
      handlePincodeAPI(pin);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // SUBMIT HANDLER
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      ["hospitalName", "Hospital Name is required"],
      ["email", "Email is required"],
      ["phone", "Valid 10-digit phone required"],
      ["address", "Address required"],
      ["area", "Region required"],
      ["city", "City required"],
      ["state", "State required"],
      ["pincode", "Valid 6-digit pincode required"],
    ];

    for (const [field, message] of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        showSnackbar(message, "error");
        return;
      }
      if (field === "phone" && formData.phone.length !== 10) {
        showSnackbar("Valid 10-digit phone required", "error");
        return;
      }
      if (field === "pincode" && formData.pincode.length !== 6) {
        showSnackbar("Valid 6-digit pincode required", "error");
        return;
      }
    }

    if (formData.department.length === 0) {
      showSnackbar("Select Department", "error");
      return;
    }
    if (formData.services.length === 0) {
      showSnackbar("Select Service", "error");
      return;
    }
    if (formData.subServices.length === 0) {
      showSnackbar("Select Sub Service", "error");
      return;
    }

    const payload = {
      ...formData,
      phone: "+91" + formData.phone,
    };

    try {
      let res;

      if (isEditing) {
        res = await healthcareService.updateHospital(initialData._id, payload);
      } else {
        res = await healthcareService.createHospital(payload);
      }

      if (res.status === "success") {
        showSnackbar("Saved successfully", "success");
        onSuccess?.();
        onClose?.();
      } else {
        showSnackbar("Failed to save", "error");
      }
    } catch (err) {
      showSnackbar("Failed to save", "error");
    }
  };

  // ============================
  // FORM UI
  // ============================
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl p-6 lg:p-8 w-[95%] max-w-5xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Hospital" : "Add New Hospital"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* -----------------------------------------
               HOSPITAL DETAILS
          ----------------------------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Hospital Name, Email, Phone, Website */}
            {[
              ["hospitalName", "Hospital Name *"],
              ["email", "Email *"],
              ["phone", "Phone *"],
              ["website", "Website"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="text-sm font-medium">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="border rounded-lg w-full px-3 py-2"
                />
              </div>
            ))}

            {/* ---------- PINCODE → REGION → CITY → STATE → COUNTRY ---------- */}

            {/* Pincode */}
            <div>
              <label className="text-sm font-medium">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength="6"
                className="border rounded-lg w-full px-3 py-2"
                placeholder="Enter 6-digit pincode"
              />
            </div>

            {/* Region */}
            <div>
              <label className="text-sm font-medium">Region *</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                disabled={regionOptions.length === 0}
                className="border rounded-lg w-full px-3 py-2"
              >
                <option value="">Select Region</option>
                {regionOptions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                readOnly
                className="border rounded-lg w-full px-3 py-2 bg-gray-100"
                placeholder="Auto-filled"
              />
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                readOnly
                className="border rounded-lg w-full px-3 py-2 bg-gray-100"
                placeholder="Auto-filled"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-sm font-medium">Country *</label>
              <input
                type="text"
                name="country"
                value="India"
                readOnly
                className="border rounded-lg w-full px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2 h-20"
              />
            </div>

            {/* GST */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>
          </div>

          {/* -----------------------------------------
               DEPARTMENT / SERVICES SECTION
          ----------------------------------------- */}
          <DepartmentServiceSection formData={formData} setFormData={setFormData} />

          {/* -----------------------------------------
               ACTION BUTTONS
          ----------------------------------------- */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Hospital"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEditHospital;
