import api from './api';

export const studentsService = {
  /* =========================
     GET ALL STUDENTS
  ========================== */
  getStudents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append('page', params.page || 1);
      queryParams.append('limit', params.limit || 10);
      queryParams.append('sortBy', params.sortBy || 'createdAt');
      queryParams.append('sortOrder', params.sortOrder || 'asc');

      if (params.search) queryParams.append('search', params.search);
      if (params.schoolId) queryParams.append('schoolId', params.schoolId);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.section) queryParams.append('section', params.section);

      const url = `/api/v1/students?${queryParams.toString()}`;
      console.log('Fetching students:', url);

      const response = await api.get(url);

      if (response?.status === 'success') {
        return {
          status: 'success',
          data: response.data || [],
          pagination: response.pagination || {
            total: 0,
            page: 1,
            pages: 1,
            limit: params.limit || 10
          }
        };
      }

      throw new Error(response?.message || 'Failed to fetch students');
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  /* =========================
     GET STUDENT BY ID
  ========================== */
  getStudentById: async (id) => {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await api.get(`/api/v1/students/${id}`);

      if (response?.status === 'success' && response?.data) {
        return {
          status: 'success',
          data: response.data
        };
      }

      throw new Error('No data received from API');
    } catch (error) {
      console.error('Error fetching student:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  },

  /* =========================
     CREATE STUDENT
     - Common password: student
  ========================== */
  createStudent: async (data) => {
    try {
      console.log('Creating student:', data);

      const requestData = {
        ...data,
        phone: data.phone?.startsWith('+91')
          ? data.phone
          : `+91${data.phone?.replace(/\D/g, '')}`,
        emergencyContact: data.emergencyContact
          ? {
              ...data.emergencyContact,
              phone: data.emergencyContact.phone?.startsWith('+91')
                ? data.emergencyContact.phone
                : `+91${data.emergencyContact.phone?.replace(/\D/g, '')}`
            }
          : undefined,
        active: true
      };

      const response = await api.post('/api/v1/students', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response?.status === 'success') {
        return response;
      }

      throw new Error(response?.message || 'Failed to create student');
    } catch (error) {
      console.error('Error creating student:', error);
      throw error.response?.data || error;
    }
  },

  /* =========================
     UPDATE STUDENT
  ========================== */
  updateStudent: async (id, data) => {
    try {
      if (!id) throw new Error('Student ID is required');

      const submitData = {
        ...data,
        phone: data.phone?.startsWith('+91')
          ? data.phone
          : `+91${data.phone?.replace(/\D/g, '')}`
      };

      const response = await api.put(`/api/v1/students/${id}`, submitData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response?.status === 'success') {
        return response;
      }

      throw new Error(response?.message || 'Failed to update student');
    } catch (error) {
      console.error('Error updating student:', error);
      throw error.response?.data || error;
    }
  },

  /* =========================
     DELETE (SOFT) STUDENT
  ========================== */
  deleteStudent: async (id) => {
    try {
      if (!id) throw new Error('Student ID is required');

      const response = await api.delete(`/api/v1/students/${id}`);

      if (response?.status === 'success') {
        return response;
      }

      throw new Error(response?.message || 'Failed to delete student');
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error.response?.data || error;
    }
  },

  /* =========================
   ADD SUB STUDENT
========================= */
addSubStudent: async (parentStudentId, data) => {
  try {
    const response = await api.post(
      `/api/v1/students/${parentStudentId}/sub-student`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
},

/* =========================
   GET SUB STUDENTS
========================= */
getSubStudents: async (studentId) => {
  try {
    const response = await api.get(
      `/api/v1/students/${studentId}/sub-students`
    );
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
},
getSubProfilesByParent: async (parentId) => {
  const res = await api.get(`/api/v1/students/sub-profiles/${parentId}`);
  return res.data;
},


};

export default studentsService;
