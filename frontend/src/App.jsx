import { useState, useEffect } from 'react';
import { api } from './services/api';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ id: '', name: '' });

  // Fetch all courses on component mount and after operations
  const fetchCourses = async () => {
    setLoading(true);
    const result = await api.getAllCourses();
    setLoading(false);
    
    console.log('Fetch result:', result);
    console.log('Result data:', result.data);
    console.log('Is array?', Array.isArray(result.data));
    
    if (result.success) {
      const coursesArray = Array.isArray(result.data) ? result.data : [];
      console.log('Setting courses:', coursesArray);
      setCourses(coursesArray);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  useEffect(() => {
    fetchCourses();
    // Refresh courses every 3 seconds to see updates from Kafka
    const interval = setInterval(fetchCourses, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.name) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const result = await api.addCourse({
      id: parseInt(formData.id),
      name: formData.name
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Course added successfully! It will appear shortly.' });
      setFormData({ id: '', name: '' });
      // Refresh courses after a short delay to allow Kafka processing
      setTimeout(fetchCourses, 2000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (!window.confirm(`Are you sure you want to delete course "${courseName}"?`)) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await api.deleteCourse({
      id: parseInt(courseId),
      name: courseName
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: 'Course deleted successfully!' });
      // Refresh courses after a short delay
      setTimeout(fetchCourses, 1000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Course Management System
          </h1>
          <p className="text-gray-600">
            Microservices Architecture with Kafka Event Streaming
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="ml-4 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Course Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Course
            </h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course ID
                </label>
                <input
                  type="number"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course name"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Adding...' : 'Add Course'}
              </button>
            </form>
          </div>

          {/* Courses List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                All Courses
              </h2>
              <button
                onClick={fetchCourses}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            {loading && courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No courses available. Add a course to get started!
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {course.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {course.id}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.name)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            System Architecture
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-gray-700 mb-1">Add Course Flow:</p>
              <p>Frontend → Instructor Service (8080) → Kafka → Student Service (8081) → PostgreSQL</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Delete Course Flow:</p>
              <p>Frontend → Instructor Service (8080) → PostgreSQL → Kafka → Student Service (8081)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
