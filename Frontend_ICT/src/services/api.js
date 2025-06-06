// ========================================
// API SERVICE - Frontend/src/services/api.js
// Centralized API calls for ICTAK Frontend
// Updated to match backend routes
// ========================================

import axios from 'axios';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://arjun-ictak.vercel.app/api',
  TIMEOUT: 15000, // Increased timeout for file uploads
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
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Register new user
  signup: async (name, email, password, phone, batch) => {
    const response = await apiClient.post('/auth/register', { 
      name, email, password, phone, batch 
    });
    return response.data;
  },

  // Verify token
  verifyToken: async () => {
    const response = await apiClient.get('/auth/verify-token');
    return response.data;
  }
};

// ========================================
// STUDENT API
// ========================================

export const studentAPI = {
  // Get student course information
  getStudentCourse: async (studentId) => {
    const response = await apiClient.get(`/students/course/${studentId}`);
    return response.data.data; // Return the data object directly
  },

  // Get student's project assignments
  getStudentsWithProjects: async (studentId) => {
    const response = await apiClient.get(`/students/projects/${studentId}`);
    return response.data.data; // Return the data array directly
  },

  // Select project for student
  selectProject: async (sp_id, sp_name, p_id, p_name, start_date) => {
    const response = await apiClient.post('/students/select-project', {
      sp_id, sp_name, p_id, p_name, start_date
    });
    return response.data;
  },

  // Update student's project assignment
  updateStudentProject: async (studentId, p_id, p_name) => {
    const response = await apiClient.put(`/students/update-project/${studentId}`, {
      p_id, p_name
    });
    return response.data;
  }
};

// ========================================
// PROJECT API
// ========================================

export const projectAPI = {
  // Get available projects by course
  getAvailableProjects: async (course) => {
    const response = await apiClient.get(`/projects/available/${course}`);
    return response.data.data; // Return the data array directly
  },

  // Get project details by ID
  getProjectDetails: async (projectId) => {
    const response = await apiClient.get(`/projects/details/${projectId}`);
    return response.data.data; // Return the data array directly
  },

  // Get project references
  getProjectReferences: async (projectId) => {
    const response = await apiClient.get(`/projects/references/${projectId}`);
    return response.data.data; // Return the data object directly
  },

  // Select project for student (alias for studentAPI.selectProject)
  selectProject: async (sp_id, sp_name, p_id, p_name, start_date) => {
    return await studentAPI.selectProject(sp_id, sp_name, p_id, p_name, start_date);
  }
};

// ========================================
// SUBMISSION API
// ========================================

export const submissionAPI = {
  // Upload weekly submission
  uploadWeeklySubmission: async (studentId, formData) => {
    const response = await apiClient.post(`/submissions/weekly/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Extended timeout for file uploads
    });
    return response.data;
  },

  // Upload final project submission
  uploadFinalProject: async (studentId, formData) => {
    const response = await apiClient.post(`/submissions/project/${studentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Extended timeout for file uploads
    });
    return response.data;
  },

  // Get student's weekly submissions
  getWeeklySubmissions: async (studentId) => {
    const response = await apiClient.get(`/submissions/weekly/${studentId}`);
    return response.data.data; // Return the data array directly
  },

  // Get student's project submission
  getProjectSubmission: async (studentId) => {
    const response = await apiClient.get(`/submissions/project/${studentId}`);
    return response.data.data; // Return the data object directly
  }
};

// ========================================
// DISCUSSION FORUM API
// ========================================

export const discussionAPI = {
  // Get discussion for student's course
  getDiscussion: async (studentId) => {
    const response = await apiClient.get(`/discussions/${studentId}`);
    return response.data.data; // Return the data object directly
  },

  // Add new question
  addQuestion: async (studentId, question) => {
    const response = await apiClient.post(`/discussions/${studentId}/questions`, {
      question
    });
    return response.data.data; // Return the updated discussion data
  },

  // Add answer to question
  addAnswer: async (studentId, questionId, answer) => {
    const response = await apiClient.post(`/discussions/${studentId}/questions/${questionId}/answers`, {
      answer
    });
    return response.data.data; // Return the updated discussion data
  },

  // Edit question
  editQuestion: async (studentId, questionId, questionText) => {
    const response = await apiClient.put(`/discussions/${studentId}/questions/${questionId}`, {
      questionText
    });
    return response.data.data; // Return the updated discussion data
  },

  // Delete question
  deleteQuestion: async (studentId, questionId) => {
    const response = await apiClient.delete(`/discussions/${studentId}/questions/${questionId}`);
    return response.data.data; // Return the updated discussion data
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
      
      // Log error for debugging
      console.error('API Error:', {
        status,
        message: data.message,
        url: error.config?.url,
        method: error.config?.method
      });

      switch (status) {
        case 400:
          return data.message || 'Bad request - Please check your input';
        case 401:
          return 'Session expired. Please log in again.';
        case 403:
          return 'Access denied. Please log in again.';
        case 404:
          return data.message || 'Resource not found';
        case 409:
          return data.message || 'Conflict - Resource already exists';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return data.message || `Error ${status}: An error occurred`;
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
      return 'Network error. Please check your internet connection.';
    } else if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    console.error('Unexpected Error:', error.message);
    return 'An unexpected error occurred. Please try again.';
  },

  // Create FormData for file uploads with proper validation
  createFormData: (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value !== null && value !== undefined && value !== '') {
        // Handle file uploads
        if (value instanceof File) {
          formData.append(key, value);
        }
        // Handle other data types
        else {
          formData.append(key, String(value));
        }
      }
    });
    
    return formData;
  },

  // Token management
  setToken: (token) => {
    localStorage.setItem('token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      if (payload.exp && payload.exp < now) {
        localStorage.removeItem('token'); // Remove expired token
        return false;
      }
      
      return true;
    } catch (error) {
      localStorage.removeItem('token'); // Remove invalid token
      return false;
    }
  },

  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  },

  // Format file size for display
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Validate file before upload
  validateFile: (file, maxSizeMB = 10, allowedTypes = []) => {
    if (!file) return { valid: false, error: 'No file selected' };
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        valid: false, 
        error: `File size must be less than ${maxSizeMB}MB. Current size: ${apiUtils.formatFileSize(file.size)}` 
      };
    }
    
    // Check file type if specified
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        return { 
          valid: false, 
          error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
        };
      }
    }
    
    return { valid: true };
  },

  // Retry function for failed requests
  retry: async (fn, retries = 3, delay = 1000) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && error.response?.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return apiUtils.retry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }
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