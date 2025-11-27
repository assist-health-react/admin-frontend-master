import React, { useState } from "react";
import { FaSearch, FaFilter, FaUndo } from "react-icons/fa";
import { healthcareService } from "../../../../services/healthcareService";
import { useEffect } from "react";

export default function DiagnosticsFilter({ onApply }) {
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [area, setArea] = useState("");

  const [servicesList, setServicesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // Load DB-based metadata
  useEffect(() => {
    healthcareService.getDiagnosticServices().then((res) =>
      setServicesList(res.data || [])
    );
    healthcareService.getDiagnosticCities().then((res) =>
      setCitiesList(res.data || [])
    );
  }, []);

  const resetAll = () => {
    setSearch("");
    setService("");
    setCity("");
    setState("");
    setArea("");
    onApply({});
  };

  const applyFilters = () =>
    onApply({
      search: search.trim(),
      service,
      city: city.trim(),
      state: state.trim(),
      area: area.trim(),
    });

  return (
    <div className="bg-white shadow-sm rounded-xl p-3 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        
        {/* Search Box */}
        <div className="relative w-full sm:w-[48%] lg:w-[300px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diagnostics..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        {/* Services Dropdown */}
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="
            w-full sm:w-[48%] lg:w-[300px]
            border border-gray-200 rounded-lg px-3 py-2 text-sm
          "
        >
          <option value="">Services</option>
          {servicesList.map((srv) => (
            <option key={srv._id} value={srv.name}>
              {srv.name}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full sm:w-[48%] lg:w-[300px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">City</option>
          {citiesList.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* State */}
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="
            w-full sm:w-[48%] lg:w-[300px]
            border border-gray-200 rounded-lg px-3 py-2 text-sm
          "
        />

        {/* Area */}
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area"
          className="
            w-full sm:w-[48%] lg:w-[300px]
            border border-gray-200 rounded-lg px-3 py-2 text-sm
          "
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
}
