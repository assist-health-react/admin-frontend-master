// import { useState } from "react";
// import { FaPlus, FaTimes } from "react-icons/fa";

// export default function HomeVisitSection({ formData, setFormData }) {
//   const [locationData, setLocationData] = useState({
//     days: [],
//     fromTime: "",
//     toTime: "",
//     locationName: "",
//     city: "",
//     pincode: "",
//     radius: ""
//   });

//   const daysList = [
//     "Monday", "Tuesday", "Wednesday",
//     "Thursday", "Friday", "Saturday", "Sunday"
//   ];

//   // Toggle Days
//   const toggleDay = (day) => {
//     setLocationData((prev) => ({
//       ...prev,
//       days: prev.days.includes(day)
//         ? prev.days.filter((d) => d !== day)
//         : [...prev.days, day]
//     }));
//   };

//   // Add New Home Visit Location
//   const addHomeVisitLocation = () => {
//     const {
//       days, fromTime, toTime, locationName,
//       city, pincode
//     } = locationData;

//     if (
//       days.length === 0 ||
//       !fromTime ||
//       !toTime ||
//       !locationName.trim() ||
//       !city.trim() ||
//       pincode.length !== 6
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       homeVisitLocations: [...prev.homeVisitLocations, locationData]
//     }));

//     // Reset form
//     setLocationData({
//       days: [],
//       fromTime: "",
//       toTime: "",
//       locationName: "",
//       city: "",
//       pincode: "",
//       radius: ""
//     });
//   };

//   // Remove location
//   const removeLocation = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       homeVisitLocations: prev.homeVisitLocations.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
//       <h3 className="text-lg font-semibold mb-4">Home Visit</h3>

//       {/* ---------------------- Days Available ---------------------- */}
//       <label className="block text-sm font-medium mb-2">Days Available *</label>
//       <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
//         {daysList.map((day) => (
//           <label
//             key={day}
//             className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
//               locationData.days.includes(day)
//                 ? "bg-blue-100 border-blue-500"
//                 : "border-gray-300"
//             }`}
//           >
//             <input
//               type="checkbox"
//               checked={locationData.days.includes(day)}
//               onChange={() => toggleDay(day)}
//             />
//             {day}
//           </label>
//         ))}
//       </div>

//       {/* ---------------------- Time Selection ---------------------- */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="text-sm font-medium">From Time *</label>
//           <input
//             type="time"
//             className="w-full border rounded px-3 py-2"
//             value={locationData.fromTime}
//             onChange={(e) =>
//               setLocationData((prev) => ({ ...prev, fromTime: e.target.value }))
//             }
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">To Time *</label>
//           <input
//             type="time"
//             className="w-full border rounded px-3 py-2"
//             value={locationData.toTime}
//             onChange={(e) =>
//               setLocationData((prev) => ({ ...prev, toTime: e.target.value }))
//             }
//           />
//         </div>
//       </div>

//       {/* ---------------------- Location Info ---------------------- */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="text-sm font-medium">Location Name *</label>
//           <input
//             type="text"
//             className="w-full border rounded px-3 py-2"
//             value={locationData.locationName}
//             onChange={(e) =>
//               setLocationData((prev) => ({
//                 ...prev,
//                 locationName: e.target.value
//               }))
//             }
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">City *</label>
//           <input
//             type="text"
//             className="w-full border rounded px-3 py-2"
//             value={locationData.city}
//             onChange={(e) =>
//               setLocationData((prev) => ({ ...prev, city: e.target.value }))
//             }
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Pincode *</label>
//           <input
//             type="text"
//             maxLength="6"
//             className="w-full border rounded px-3 py-2"
//             value={locationData.pincode}
//             onChange={(e) =>
//               setLocationData((prev) => ({ ...prev, pincode: e.target.value }))
//             }
//           />
//         </div>

//         <div>
//           <label className="text-sm font-medium">Radius Coverage (km)</label>
//           <input
//             type="number"
//             className="w-full border rounded px-3 py-2"
//             value={locationData.radius}
//             onChange={(e) =>
//               setLocationData((prev) => ({ ...prev, radius: e.target.value }))
//             }
//           />
//         </div>
//       </div>

//       {/* ---------------------- Add Button ---------------------- */}
//       {/* <button
//         type="button"
//         onClick={addHomeVisitLocation}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//       >
//         <FaPlus /> Add Home Visit Location
//       </button> */}

//       {/* ---------------------- Added Locations ---------------------- */}
//       <div className="mt-6 space-y-3">
//         {formData.homeVisitLocations.map((item, index) => (
//           <div
//             key={index}
//             className="bg-gray-50 border rounded-lg p-4 flex justify-between items-start"
//           >
//             <div>
//               <p className="font-semibold text-lg">{item.locationName}</p>
//               <p>{item.city} - {item.pincode}</p>
//               <p>Days: {item.days.join(", ")}</p>
//               <p>{item.fromTime} - {item.toTime}</p>
//               {item.radius && <p>Radius: {item.radius} km</p>}
//             </div>

//             <button
//               type="button"
//               onClick={() => removeLocation(index)}
//               className="text-red-500 hover:text-red-700"
//             >
//               <FaTimes />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import Select from "react-select";

export default function HomeVisitSection({ formData, setFormData }) {
  const [locationData, setLocationData] = useState({
    days: [],
    fromTime: "",
    toTime: "",
    locationName: "",
    city: "",
    areas: [], // ⭐ NEW: MULTIPLE AREAS
  });

  const daysList = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Toggle days
  const toggleDay = (day) => {
    setLocationData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  // Add home visit location
  const addHomeVisitLocation = () => {
    if (
      locationData.days.length === 0 ||
      !locationData.fromTime ||
      !locationData.toTime ||
      !locationData.locationName.trim() ||
      locationData.areas.length === 0
    ) {
      alert("Please fill all required fields including at least one area.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      homeVisitLocations: [...prev.homeVisitLocations, locationData],
    }));

    // Reset
    setLocationData({
      days: [],
      fromTime: "",
      toTime: "",
      locationName: "",
      city: "",
      areas: [],
    });
  };

  // Remove home visit location
  const removeLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      homeVisitLocations: prev.homeVisitLocations.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------
  // AREA ADDING LOGIC
  // ----------------------------
  const [pincode, setPincode] = useState("");
  const [regionOptions, setRegionOptions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  const fetchRegions = async (pin) => {
    if (pin.length !== 6) return;

    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await res.json();

    if (data[0].Status !== "Success") {
      setRegionOptions([]);
      return;
    }

    const offices = data[0].PostOffice;

    setRegionOptions(
      offices.map((o) => ({
        value: o.Name,
        label: `${o.Name} (${o.District})`,
      }))
    );
  };

  const handleAddAreas = () => {
    if (pincode.length !== 6 || selectedRegions.length === 0) {
      alert("Please enter valid pincode and select region(s)");
      return;
    }

    const newAreas = selectedRegions.map((option) => ({
      pincode,
      region: option.value,
    }));

    setLocationData((prev) => ({
      ...prev,
      areas: [...prev.areas, ...newAreas],
    }));

    setSelectedRegions([]);
    setPincode("");
    setRegionOptions([]);
  };

  const removeArea = (index) => {
    setLocationData((prev) => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">Home Visit</h3>

      {/* Days */}
      <label className="block text-sm font-medium mb-2">Days Available *</label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {daysList.map((day) => (
          <label
            key={day}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              locationData.days.includes(day)
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={locationData.days.includes(day)}
              onChange={() => toggleDay(day)}
            />
            {day}
          </label>
        ))}
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">From Time *</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={locationData.fromTime}
            onChange={(e) =>
              setLocationData({ ...locationData, fromTime: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">To Time *</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={locationData.toTime}
            onChange={(e) =>
              setLocationData({ ...locationData, toTime: e.target.value })
            }
          />
        </div>
      </div>

      {/* Location Name */}
      <div className="mb-4">
        <label className="text-sm font-medium">Location Name *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={locationData.locationName}
          onChange={(e) =>
            setLocationData({ ...locationData, locationName: e.target.value })
          }
        />
      </div>

      {/* ---------------------- AREA ADD SECTION ---------------------- */}
      <h4 className="text-md font-semibold mb-2">Add Areas</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Pincode */}
        <div>
          <label className="text-sm font-medium">Pincode *</label>
          <input
            type="text"
            maxLength="6"
            className="w-full border rounded px-3 py-2"
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPincode(val);
              if (val.length === 6) fetchRegions(val);
            }}
          />
        </div>

        {/* Region Selector */}
        <div>
          <label className="text-sm font-medium">Regions *</label>
          <Select
            isMulti
            options={regionOptions}
            value={selectedRegions}
            onChange={setSelectedRegions}
          />
        </div>
      </div>

      <button
        onClick={handleAddAreas}
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Add Area
      </button>

      {/* Display selected areas */}
      {locationData.areas.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {locationData.areas.map((a, i) => (
              <div
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {a.pincode} - {a.region}
                <FaTimes
                  className="cursor-pointer"
                  onClick={() => removeArea(i)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Home Visit */}
      <button
        type="button"
        onClick={addHomeVisitLocation}
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FaPlus /> Add Home Visit Location
      </button>

      {/* Existing Locations */}
      <div className="mt-6 space-y-3">
        {formData.homeVisitLocations.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold text-lg">{item.locationName}</p>
              <p>Days: {item.days.join(", ")}</p>
              <p>{item.fromTime} - {item.toTime}</p>

              <p className="mt-2 font-medium">Areas:</p>
              <ul className="list-disc ml-5">
                {item.areas.map((a, idx) => (
                  <li key={idx}>
                    {a.pincode} - {a.region}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => removeLocation(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
