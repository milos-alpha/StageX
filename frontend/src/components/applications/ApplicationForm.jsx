import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { motion } from 'framer-motion';

const ApplicationForm = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    coverLetter: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User must have a resume uploaded in their profile
  const hasResume = user?.profile?.resume;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!hasResume) {
      setError('Please upload your resume in your profile before applying.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        coverLetter: formData.coverLetter,
        resume: user.profile.resume, // send resume filename
      };
      await api.post(`/jobs/${jobId}/applications`, payload);
      navigate('/my-applications', {
        state: { message: 'Application submitted successfully!' }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit Application</h2>
      
      {error && (
        <motion.div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.div>
      )}
      {!hasResume && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          Please upload your resume in your <a href="/profile" className="underline text-primary-600">profile</a> before applying.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={6}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
          disabled={loading || !hasResume}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </motion.div>
  );
};

export default ApplicationForm;