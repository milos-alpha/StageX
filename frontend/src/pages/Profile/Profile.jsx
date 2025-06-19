import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import FileUpload from '../../components/ui/FileUpload';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    location: '',
    education: '',
    skills: [],
    bio: '',
    experience: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState(null);
  const [resumeSuccess, setResumeSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user) {
          const response = await api.get(`/users/${user._id}`);
          const u = response.data.data;
          setProfileData({
            name: u.name || '',
            email: u.email || '',
            contactNumber: u.profile?.contactNumber || '',
            location: u.profile?.location || '',
            education: u.profile?.education || '',
            skills: u.profile?.skills || [],
            bio: u.profile?.bio || '',
            experience: u.profile?.experience || [],
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfileData(prev => ({ ...prev, skills }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/users/${user._id}`, {
        name: profileData.name,
        profile: {
          contactNumber: profileData.contactNumber,
          location: profileData.location,
          education: profileData.education,
          skills: profileData.skills,
          bio: profileData.bio,
          experience: profileData.experience,
        }
      });
      setSuccess(true);
      setUser(res.data.data); // update user context
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.put(`/users/${user._id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload photo');
    }
  };

  const handleResumeUpload = async (file) => {
    setResumeLoading(true);
    setResumeError(null);
    setResumeSuccess(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.put(`/users/${user._id}/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeSuccess(true);
      setTimeout(() => setResumeSuccess(false), 3000);
      window.location.reload();
    } catch (err) {
      setResumeError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
        </div>
        <div className="p-6">
          {error && (
            <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>
          )}
          {success && (
            <motion.div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Profile updated successfully!</motion.div>
          )}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                {user?.profile?.profilePicture ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${user.profile.profilePicture}`}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <span className="text-primary-600 text-4xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <FileUpload
                  accept="image/*"
                  onFileChange={handleFileUpload}
                  label="Change Photo"
                  buttonClass="text-sm"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-800">{user?.name}</h3>
                  <p className="text-gray-600 capitalize">{user?.role}</p>
                </div>
                <div className="mt-6 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                  <FileUpload
                    accept="application/pdf"
                    onFileChange={handleResumeUpload}
                    label="Upload Resume"
                    buttonClass="text-sm"
                  />
                  {resumeLoading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
                  {resumeError && <div className="text-xs text-red-600 mt-1">{resumeError}</div>}
                  {resumeSuccess && <div className="text-xs text-green-600 mt-1">Resume uploaded!</div>}
                  {user?.profile?.resume && (
                    <div className="text-xs text-gray-700 mt-2">Current: <a href={`${process.env.REACT_APP_API_URL}/uploads/${user.profile.resume}`} target="_blank" rel="noopener noreferrer" className="underline text-primary-600">{user.profile.resume}</a></div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={profileData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-100" value={profileData.email} readOnly />
                  </div>
                  <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="text" id="contactNumber" name="contactNumber" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={profileData.contactNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" id="location" name="location" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={profileData.location} onChange={handleChange} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
                    <input type="text" id="education" name="education" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={profileData.education} onChange={handleChange} placeholder="e.g., BSc Computer Science, University of Example" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                    <input type="text" id="skills" name="skills" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={profileData.skills.join(', ')} onChange={handleSkillsChange} placeholder="e.g., JavaScript, React, Node.js" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea id="bio" name="bio" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={profileData.bio} onChange={handleChange} />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;