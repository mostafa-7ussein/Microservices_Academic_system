import axios from 'axios';

const INSTRUCTOR_API = import.meta.env.VITE_INSTRUCTOR_API || 'http://localhost:8080';
const STUDENT_API = import.meta.env.VITE_STUDENT_API || 'http://localhost:8081';

export const api = {
  // Instructor Service APIs
  addCourse: async (courseData) => {
    try {
      const response = await axios.post(`${INSTRUCTOR_API}/add-course`, courseData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to add course' 
      };
    }
  },

  deleteCourse: async (courseData) => {
    try {
      const response = await axios.delete(`${INSTRUCTOR_API}/delete-course`, {
        data: courseData
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to delete course' 
      };
    }
  },

  // Student Service APIs
  getCourse: async (courseId) => {
    try {
      const response = await axios.get(`${STUDENT_API}/get-course`, {
        params: { id: courseId }
      });
      // response.data is { success: true, data: course }
      if (response.data.success && response.data.data) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: 'Course not found' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get course' 
      };
    }
  },

  getAllCourses: async () => {
    try {
      const response = await axios.get(`${STUDENT_API}/get-all-courses`);
      console.log('API Response:', response.data);
      // response.data is { success: true, data: courses }
      // We need to return the courses array directly
      if (response.data && response.data.success && response.data.data) {
        console.log('Courses array:', response.data.data);
        return { success: true, data: response.data.data };
      }
      // Fallback: if response.data is already an array (old format)
      if (Array.isArray(response.data)) {
        console.log('Response is already an array:', response.data);
        return { success: true, data: response.data };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching courses:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to get courses' 
      };
    }
  }
};
