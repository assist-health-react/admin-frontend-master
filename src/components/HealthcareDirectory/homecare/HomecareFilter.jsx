import React, { useState } from "react";
import { FaSearch, FaFilter, FaUndo } from "react-icons/fa";
import { PHYSIOTHERAPY_SERVICES } from "../AddEditHomecare/PhysiotherapyData";

const HomecareFilter = ({ onApply }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");

  const resetAll = () => {
    setSearch("");
    setType("All");
    setService("");
    setCity("");
    setState("");
    setArea("");
    onApply({});
  };

  const applyFilters = () => {
    onApply({
      search: search.trim(),
      type,
      service,
      city: city.trim(),
      state: state.trim(),
      area: area.trim(),
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-3 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative w-full sm:w-[48%] lg:w-[260px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search homecare..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full sm:w-[48%] lg:w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="All">All Types</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Centre">Centre</option>
          <option value="Both">Both</option>
        </select>

        {/* Service */}
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full sm:w-[48%] lg:w-[220px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Services</option>
          {PHYSIOTHERAPY_SERVICES.map((srv) => (
            <option key={srv} value={srv}>
              {srv}
            </option>
          ))}
        </select>

        {/* City */}
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full sm:w-[48%] lg:w-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        {/* State */}
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="w-full sm:w-[48%] lg:w-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        {/* Area */}
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area"
          className="w-full sm:w-[48%] lg:w-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        {/* Buttons */}
        <div className="flex gap-2 w-full sm:w-auto mt-1">
          <button
            onClick={resetAll}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
          >
            <FaUndo /> Clear
          </button>
          <button
            onClick={applyFilters}
            className="flex items-center gap-2 bg-[#3ea767] text-white px-4 py-2 rounded-lg text-sm"
          >
            <FaFilter /> Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomecareFilter;
