import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!job) return <div className="text-red-600">Job not found.</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
      <p className="text-sm text-gray-600 mb-4">{job.location} • {job.type}</p>
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-gray-700">Description</h2>
        <p className="text-gray-600">{job.description}</p>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-gray-700">Requirements</h2>
        <ul className="list-disc list-inside text-gray-600">
          {job.requirements?.map((req, idx) => <li key={idx}>{req}</li>)}
        </ul>
      </div>
      {(user?.role === 'student' || user?.role === 'employee') && (
        <Link to={`/jobs/${id}/apply`} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300 shadow-lg">
          Apply Now
        </Link>
      )}
    </div>
  );
};

export default JobDetails;
