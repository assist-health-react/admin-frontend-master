// import api from './api';

// export const healthcareService = {
//   getAllHealthcareProviders: async (page = 1) => {
//     try {
//       const response = await api.get(`/api/v1/hc-providers?page=${page}`);
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   },

//   getHealthcareProviderById: async (id) => {
//     try {
//       const response = await api.get(`/api/v1/hc-providers/${id}`);
//       if (response?.status === 'success' && response?.data) {
//         return response;
//       } else {
//         throw new Error('Invalid response structure from API');
//       }
//     } catch (error) {
//       throw error;
//     }
//   },

//   createHealthcareProvider: async (data) => {
//     try {
//       // Remove any MongoDB specific fields if they exist
//       const { _id, __v, ...cleanData } = data;
      
//       const response = await api.post('/api/v1/hc-providers', cleanData);
      
//       if (response?.status === 'success') {
//         return response;
//       } else {
//         throw new Error(response?.message || 'Failed to create healthcare provider');
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
//       throw error;
//     }
//   },

//   updateHealthcareProvider: async (id, data) => {
//     try {
//       // Remove any MongoDB specific fields if they exist
//       const { _id, __v, createdAt, updatedAt, ...cleanData } = data;
      
//       // Clean up nested objects
//       if (cleanData.address) {
//         delete cleanData.address._id;
//       }
//       if (cleanData.operationHours) {
//         cleanData.operationHours = cleanData.operationHours.map(({ _id, ...day }) => day);
//       }

//       const response = await api.put(`/api/v1/hc-providers/${id}`, cleanData);
      
//       if (response?.status === 'success') {
//         return response;
//       } else {
//         throw new Error(response?.message || 'Failed to update healthcare provider');
//       }
//     } catch (error) {
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       }
//       throw error;
//     }
//   },

//   deleteHealthcareProvider: async (id) => {
//     try {
//       await api.delete(`/api/v1/hc-providers/${id}`);
//       // For DELETE operations, we consider any non-error response as successful
//       return { status: 'success' };
//     } catch (error) {
//       if (error.response?.status === 404) {
//         // If the provider is not found, we consider it as already deleted
//         return { status: 'success' };
//       }
//       // For other errors, throw them
//       throw new Error(error.response?.data?.message || 'Failed to delete healthcare provider');
//     }
//   },

//   getRegionsByPincode: async (pincode) => {
//     try {
//       // Using India Post pincode API
//       const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//       const data = await response.json();
      
//       if (data && data[0] && data[0].Status === 'Success') {
//         const postOffices = data[0].PostOffice;
//         return {
//           status: 'success',
//           data: {
//             regions: postOffices.map(office => ({
//               value: office.Name,
//               label: office.Name
//             })),
//             state: postOffices[0].State,
//             city: postOffices[0].District
//           }
//         };
//       } else {
//         throw new Error('Invalid pincode or no data found');
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
// }; 
//OLD
// import axios from "axios";
// import api from './api';
// // const api = axios.create({
// //   baseURL: `${import.meta.env.VITE_API_URL}/api/v1/healthcare`,
// //   headers: { "Content-Type": "application/json" }
// // });
// // const api2 = axios.create({
// //   baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
// //   headers: { "Content-Type": "application/json" }
// // });
// // ✅ COMMON PREFIX (ONLY HERE)
// const HEALTHCARE_BASE = `${api}/api/v1/healthcare`;
// //${HEALTHCARE_BASE}
// export const healthcareService = {
//   getDepartments: () => api.get(`/departments`).then(res => res.data),
//   getServicesByDepartment: (deptId) => api.get(`/services/${deptId}`).then(res => res.data),
//   getSubServicesByService: (serviceId) => api.get(`/subservices/${serviceId}`).then(res => res.data),

//   createHospital: (data) => api.post(`${HEALTHCARE_BASE}/hospitals`, data).then(res => res.data),
//   updateHospital: (id, data) => api.put(`${HEALTHCARE_BASE}/hospitals/${id}`, data).then(res => res.data),
//   deleteHospital: (id) => api.delete(`${HEALTHCARE_BASE}/hospitals/${id}`).then(res => res.data),
//   getHospitals: () => api.get("/hospitals").then(res => res.data),
//   getHospitalById: (id) => api.get(`${HEALTHCARE_BASE}/hospitals/${id}`).then(res => res.data),

//   //25.11.25
//   // Diagnostics Metadata
// getDiagnosticServices: () => api2.get("/diagnostics-meta/services").then(res => res.data),
// getDiagnosticCities: () => api2.get("/diagnostics-meta/cities").then(res => res.data),

// // Diagnostics CRUD
// getDiagnostics: () => api2.get(`${HEALTHCARE_BASE}/diagnostics`).then(res => res.data),
// getDiagnosticsById: (id) => api2.get(`${HEALTHCARE_BASE}/diagnostics/${id}`).then(res => res.data),
// createDiagnostics: (data) => api2.post(`${HEALTHCARE_BASE}/diagnostics`, data).then(res => res.data),
// updateDiagnostics: (id, data) => api2.put(`${HEALTHCARE_BASE}/diagnostics/${id}`, data).then(res => res.data),
// deleteDiagnostics: (id) => api2.delete(`${HEALTHCARE_BASE}/diagnostics/${id}`).then(res => res.data),

// // Physiotherapy CRUD
// getPhysiotherapy: () => api2.get(`${HEALTHCARE_BASE}/physiotherapy`).then(res => res.data),
// getPhysiotherapyById: (id) => api2.get(`${HEALTHCARE_BASE}/physiotherapy/${id}`).then(res => res.data),
// createPhysiotherapy: (data) => api2.post(`${HEALTHCARE_BASE}/physiotherapy`, data).then(res => res.data),
// updatePhysiotherapy: (id, data) => api2.put(`${HEALTHCARE_BASE}/physiotherapy/${id}`, data).then(res => res.data),
// deletePhysiotherapy: (id) => api2.delete(`${HEALTHCARE_BASE}/physiotherapy/${id}`).then(res => res.data),

//  // Homecare CRUD
//   getHomecare: () => api2.get(`${HEALTHCARE_BASE}/homecare`).then(res => res.data),
//   getHomecareById: (id) => api2.get(`${HEALTHCARE_BASE}/homecare/${id}`).then(res => res.data),
//   createHomecare: (data) => api2.post(`${HEALTHCARE_BASE}/homecare`, data).then(res => res.data),
//   updateHomecare: (id, data) => api2.put(`${HEALTHCARE_BASE}/homecare/${id}`, data).then(res => res.data),
//   deleteHomecare: (id) => api2.delete(`${HEALTHCARE_BASE}/homecare/${id}`).then(res => res.data),

// };
import api from "./api";

// ✅ STRING PREFIX ONLY (NOT api object)
const HEALTHCARE_BASE = "/api/v1/healthcare";

export const healthcareService = {
  // Departments
  getDepartments: () =>
    api.get(`${HEALTHCARE_BASE}/departments`).then(res => res),

  getServicesByDepartment: (deptId) =>
    api.get(`${HEALTHCARE_BASE}/services/${deptId}`).then(res => res),

  getSubServicesByService: (serviceId) =>
    api.get(`${HEALTHCARE_BASE}/subservices/${serviceId}`).then(res => res),

  // Hospitals
  getHospitals: () =>
    api.get(`${HEALTHCARE_BASE}/hospitals`).then(res => res),

  getHospitalById: (id) =>
    api.get(`${HEALTHCARE_BASE}/hospitals/${id}`).then(res => res),

  createHospital: (data) =>
    api.post(`${HEALTHCARE_BASE}/hospitals`, data).then(res => res),

  updateHospital: (id, data) =>
    api.put(`${HEALTHCARE_BASE}/hospitals/${id}`, data).then(res => res),

  deleteHospital: (id) =>
    api.delete(`${HEALTHCARE_BASE}/hospitals/${id}`).then(res => res),

  // Diagnostics
  getDiagnosticServices: () =>
    api.get("/api/v1/diagnostics-meta/services").then(res => res),

  getDiagnosticCities: () =>
    api.get("/api/v1/diagnostics-meta/cities").then(res => res),

  getDiagnostics: () =>
    api.get("/api/v1/diagnostics").then(res => res),

  getDiagnosticsById: (id) =>
    api.get(`/api/v1/diagnostics/${id}`).then(res => res),

  createDiagnostics: (data) =>
    api.post("/api/v1/diagnostics", data).then(res => res),

  updateDiagnostics: (id, data) =>
    api.put(`/api/v1/diagnostics/${id}`, data).then(res => res),

  deleteDiagnostics: (id) =>
    api.delete(`/api/v1/diagnostics/${id}`).then(res => res),

  // Physiotherapy
  getPhysiotherapy: () =>
    api.get("/api/v1/physiotherapy").then(res => res),

  getPhysiotherapyById: (id) =>
    api.get(`/api/v1/physiotherapy/${id}`).then(res => res),

  createPhysiotherapy: (data) =>
    api.post("/api/v1/physiotherapy", data).then(res => res),

  updatePhysiotherapy: (id, data) =>
    api.put(`/api/v1/physiotherapy/${id}`, data).then(res => res),

  deletePhysiotherapy: (id) =>
    api.delete(`/api/v1/physiotherapy/${id}`).then(res => res),

  // Homecare
  getHomecare: () =>
    api.get("/api/v1/homecare").then(res => res),//

  getHomecareById: (id) =>
    api.get(`/api/v1/homecare/${id}`).then(res => res),

  createHomecare: (data) =>
    api.post("/api/v1/homecare", data).then(res => res),

  updateHomecare: (id, data) =>
    api.put(`/api/v1/homecare/${id}`, data).then(res => res),

  deleteHomecare: (id) =>
    api.delete(`/api/v1/homecare/${id}`).then(res => res),
};