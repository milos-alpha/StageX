import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/jobs/JobCard';
import SearchFilters from '../../components/jobs/SearchFilters';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
  });
  const { user } = useAuth();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {};
        if (filters.search) params.title = filters.search;
        if (filters.type) params.type = filters.type;
        if (filters.location) params.location = filters.location;
        
        console.log('Fetching jobs with params:', params); // Debug log
        const res = await api.get('/jobs', { params });
        console.log('API Response:', res.data); // Debug log
        
        if (!res.data || !Array.isArray(res.data.data)) {
          throw new Error('Invalid response format from API');
        }
        
        setJobs(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err); // Debug log
        setError(err.message || err.response?.data?.error || 'Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          {/* Job Listings */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {filters.search ? `Results for "${filters.search}"` : 'All Job Listings'}
              </h1>
              {user?.role === 'employer' && (
                <Link 
                  to="/post-job" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  Post New Job
                </Link>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center mt-12">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    showApply={user?.role === 'student' || user?.role === 'employee'} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;