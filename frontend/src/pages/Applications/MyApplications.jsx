import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-gray-600">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="grid gap-6">
          {applications.map(app => (
            <div key={app._id} className="bg-white p-6 shadow rounded-md">
              <h2 className="text-lg font-semibold text-primary-700">
                {app.job?.title || 'Job Title'}
              </h2>
              <p className="text-sm text-gray-600">Status: <strong>{app.status}</strong></p>
              <p className="text-sm text-gray-500 mt-1">{app.coverLetter}</p>
              <Link
                to={`/jobs/${app.job?._id}`}
                className="text-sm text-primary-600 mt-2 inline-block"
              >
                View Job
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
