// ========================================
// API SERVICE - Frontend/src/services/api.js
// Centralized API calls for ICTAK Frontend
// ========================================

import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://arjun-ictak.vercel.app/api',
  TIMEOUT: 10000,
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle auth errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      // Redirect to login handled in components
    }
    return Promise.reject(error);
  }
);

// ========================================
// AUTHENTICATION API
// ========================================

export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await apiClient.post('/salman/login', { email, password });
    return response.data;
  },

  // Register new user
  signup: async (name, email, password, phone, batch) => {
    const response = await apiClient.post('/salman/signup', { 
      name, email, password, phone, batch 
    });
    return response.data;
  }
};

// ========================================
// STUDENT API
// ========================================

export const studentAPI = {
  // Get student course data (Princy routes)
  getStudentCourse: async (studentId) => {
    const response = await apiClient.get(`/princy/studentCourse/${studentId}`);
    return response.data;
  },

  // Get student course data (Salman routes - alternative)
  getStudentCourseSalman: async (studentId) => {
    const response = await apiClient.get(`/salman/studentCourse/${studentId}`);
    return response.data;
  },

  // Get students with projects data
  getStudentsWithProjects: async (studentId) => {
    const response = await apiClient.get(`/princy/studentswithprojects/${studentId}`);
    return response.data;
  },

  // Get students with projects (Salman routes - alternative)
  getStudentsWithProjectsSalman: async (studentId) => {
    const response = await apiClient.get(`/salman/studentswithprojects/${studentId}`);
    return response.data;
  }
};

// ========================================
// PROJECT API
// ========================================

export const projectAPI = {
  // Get available projects by course
  getAvailableProjects: async (course) => {
    const response = await apiClient.get(`/princy/availableProjects/${course}`);
    return response.data;
  },

  // Get project details by ID (Arjun routes)
  getProjectDetails: async (projectId) => {
    const response = await apiClient.get(`/arjun/projects/${projectId}`);
    return response.data;
  },

  // Get project references (Fathima routes)
  getProjectReferences: async (projectId) => {
    const response = await apiClient.get(`/fathima/projects/${projectId}`);
    return response.data;
  },

  // Select project for student
  selectProject: async (sp_id, sp_name, p_id, p_name, start_date) => {
    const response = await apiClient.post('/princy/selectProject', {
      sp_id, sp_name, p_id, p_name, start_date
    });
    return response.data;
  },

  // Post student project data
  postStudentProject: async (sp_id, sp_name, p_id, p_name) => {
    const response = await apiClient.post('/princy/postStdPjt', {
      sp_id, sp_name, p_id, p_name
    });
    return response.data;
  },

  // Update student project
  updateStudentProject: async (studentId, p_id) => {
    const response = await apiClient.put(`/princy/updateStudentProject/${studentId}`, {
      p_id
    });
    return response.data;
  }
};

// ========================================
// SUBMISSION API
// ========================================

export const submissionAPI = {
  // Upload weekly submission
  uploadWeeklySubmission: async (studentId, formData) => {
    const response = await apiClient.post(`/princy/uploadWeek/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload final project submission
  uploadFinalProject: async (studentId, formData) => {
    const response = await apiClient.post(`/princy/uploadProject/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// ========================================
// DISCUSSION FORUM API
// ========================================

export const discussionAPI = {
  // Get discussion for student's course
  getDiscussion: async (studentId) => {
    const response = await apiClient.get(`/discussion/discussion/${studentId}`);
    return response.data;
  },

  // Add new question
  addQuestion: async (studentId, question) => {
    const response = await apiClient.post(`/discussion/discussion/${studentId}/question`, {
      question
    });
    return response.data;
  },

  // Add answer to question
  addAnswer: async (studentId, questionId, answer) => {
    const response = await apiClient.post(`/discussion/discussion/${studentId}/question/${questionId}/answer`, {
      answer
    });
    return response.data;
  },

  // Edit question
  editQuestion: async (studentId, questionId, questionText) => {
    const response = await apiClient.put(`/discussion/discussion/${studentId}/question/${questionId}`, {
      questionText
    });
    return response.data;
  },

  // Delete question
  deleteQuestion: async (studentId, questionId) => {
    const response = await apiClient.delete(`/discussion/discussion/${studentId}/question/${questionId}`);
    return response.data;
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return data.message || 'Bad request';
        case 401:
          return 'Session expired. Please log in again.';
        case 403:
          return 'Access denied. Please log in again.';
        case 404:
          return 'Resource not found';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return data.message || 'An error occurred';
      }
    } else if (error.request) {
      return 'Network error. Please check your connection.';
    }
    return 'An unexpected error occurred';
  },

  // Create FormData for file uploads
  createFormData: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  },

  // Token management
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token')
};

// ========================================
// DEFAULT EXPORT
// ========================================

const api = {
  auth: authAPI,
  student: studentAPI,
  project: projectAPI,
  submission: submissionAPI,
  discussion: discussionAPI,
  utils: apiUtils
};

export default api;