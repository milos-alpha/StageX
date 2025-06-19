import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'internship',
    location: '',
    salary: '',
    deadline: '',
    skills: '',
    requirements: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        requirements: formData.requirements.split(',').map(req => req.trim()),
      };
      await api.post('/jobs', payload);
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.error || 'Job posting failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Post a New Job</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Job Title" onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Job Description" rows={4} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="salary" placeholder="Salary" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="date" name="deadline" onChange={handleChange} className="w-full border p-2 rounded" required />
        <select name="type" onChange={handleChange} className="w-full border p-2 rounded">
          <option value="internship">Internship</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>
        <input type="text" name="skills" placeholder="Skills (comma separated)" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="requirements" placeholder="Requirements (comma separated)" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
