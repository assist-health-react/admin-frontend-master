// import React from "react";
// import { DIAGNOSTIC_CITIES } from "./PhysiotherapyData";
// import { FaPlus, FaTrash } from "react-icons/fa";

// const HomecareAddressSection = ({ formData, setFormData }) => {
//   const addAddress = () => {
//     setFormData((prev) => ({
//       ...prev,
//       addresses: [
//         ...prev.addresses,
//         {
//           locationName: "",
//           addressStreet: "",
//           area: "",
//           city: "",
//           pincode: "",
//         },
//       ],
//     }));
//   };

//   const removeAddress = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       addresses: prev.addresses.filter((_, i) => i !== index),
//     }));
//   };

//   const updateAddress = (index, field, value) => {
//     setFormData((prev) => {
//       const updated = [...prev.addresses];
//       updated[index][field] = value;
//       return { ...prev, addresses: updated };
//     });
//   };

//   return (
//     <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">
//           Service Coverage (Address) *
//         </h3>

//         <button
//           type="button"
//           className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
//           onClick={addAddress}
//         >
//           <FaPlus /> Add Location
//         </button>
//       </div>

//       {formData.addresses.map((addr, index) => (
//         <div
//           key={index}
//           className="border rounded-xl p-4 mb-4 bg-gray-50 shadow-sm"
//         >
//           <div className="flex justify-between items-center">
//             <h4 className="font-semibold text-gray-700">
//               Location #{index + 1}
//             </h4>

//             {formData.addresses.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => removeAddress(index)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <FaTrash />
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Location Name *
//               </label>
//               <input
//                 value={addr.locationName}
//                 onChange={(e) =>
//                   updateAddress(index, "locationName", e.target.value)
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Area *
//               </label>
//               <input
//                 value={addr.area}
//                 onChange={(e) =>
//                   updateAddress(index, "area", e.target.value)
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1">
//                 Address *
//               </label>
//               <textarea
//                 value={addr.addressStreet}
//                 onChange={(e) =>
//                   updateAddress(index, "addressStreet", e.target.value)
//                 }
//                 className="w-full border rounded-lg px-3 py-2 h-20"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 City *
//               </label>
//               <select
//                 value={addr.city}
//                 onChange={(e) =>
//                   updateAddress(index, "city", e.target.value)
//                 }
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="">-- Select City --</option>
//                 {DIAGNOSTIC_CITIES.map((city) => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Pincode *
//               </label>
//               <input
//                 maxLength={6}
//                 value={addr.pincode}
//                 onChange={(e) => {
//                   const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
//                   updateAddress(index, "pincode", pin);
//                 }}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default HomecareAddressSection;
import React, { useState } from "react";
import { DIAGNOSTIC_CITIES } from "./PhysiotherapyData";
import { FaPlus, FaTrash } from "react-icons/fa";

const HomecareAddressSection = ({ formData, setFormData }) => {
  const [regionOptionsList, setRegionOptionsList] = useState({}); // store regions per index

  // -------------------------------
  //  Add Location
  // -------------------------------
  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          locationName: "",
          addressStreet: "",
          region: "",
          city: "",
          state: "",
          country: "India",
          pincode: "",
        },
      ],
    }));
  };

  const removeAddress = (index) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  // -------------------------------
  // Update field
  // -------------------------------
  const updateAddress = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.addresses];
      updated[index][field] = value;
      return { ...prev, addresses: updated };
    });
  };

  // -------------------------------
  // PINCODE API Handler
  // -------------------------------
  const handlePincodeAPI = async (index, pincode) => {
    if (pincode.length !== 6) {
      updateAddress(index, "region", "");
      updateAddress(index, "city", "");
      updateAddress(index, "state", "");

      setRegionOptionsList((prev) => ({
        ...prev,
        [index]: []
      }));

      return;
    }

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status !== "Success") {
        updateAddress(index, "region", "");
        updateAddress(index, "city", "");
        updateAddress(index, "state", "");

        setRegionOptionsList((prev) => ({ ...prev, [index]: [] }));
        return;
      }

      const officeList = data[0].PostOffice;
      const first = officeList[0];

      // Set region options (Area Names)
      setRegionOptionsList((prev) => ({
        ...prev,
        [index]: officeList.map((item) => item.Name),
      }));

      // Auto-fill city & state
      updateAddress(index, "city", first.District);
      updateAddress(index, "state", first.State);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Address *
        </h3>

        {/* <button
          type="button"
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
          onClick={addAddress}
        >
          <FaPlus /> Add Location
        </button> */}
        {/* <button
          type="button"
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
          onClick={addAddress}
        >
          <FaPlus /> Add Location
        </button> */}
      </div>

      {formData.addresses.map((addr, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 mb-4 bg-gray-50 shadow-sm"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-700">
              Location 
            </h4>
            {/* <h4 className="font-semibold text-gray-700">
              Location #{index + 1}
            </h4> */}

            {formData.addresses.length > 1 && (
              <button
                type="button"
                onClick={() => removeAddress(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">

            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Location Name *
              </label>
              <input
                value={addr.locationName}
                onChange={(e) =>
                  updateAddress(index, "locationName", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Pincode *
              </label>
              <input
                maxLength={6}
                value={addr.pincode}
                onChange={(e) => {
                  const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                  updateAddress(index, "pincode", pin);
                  handlePincodeAPI(index, pin);
                }}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Region (Dropdown) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Region *
              </label>
              <select
                value={addr.region}
                onChange={(e) =>
                  updateAddress(index, "region", e.target.value)
                }
                disabled={!regionOptionsList[index]?.length}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="">-- Select Region --</option>
                {(regionOptionsList[index] || []).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                value={addr.city}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                value={addr.state}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <input
                value="India"
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              />
            </div>

            {/* Full Address / Street */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address *
              </label>
              <textarea
                value={addr.addressStreet}
                onChange={(e) =>
                  updateAddress(index, "addressStreet", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 h-20"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomecareAddressSection;
