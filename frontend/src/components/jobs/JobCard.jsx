import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaMapMarkerAlt, FaBriefcase, FaDollarSign } from 'react-icons/fa';
import { motion } from 'framer-motion';

const JobCard = ({ job, showApply }) => {
  if (!job) {
    console.error('JobCard received null or undefined job');
    return null;
  }
  
  console.log('Rendering JobCard with job:', job); // Debug log
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {job.company?.profile?.companyLogo ? (
                <img 
                  src={job.company.profile.companyLogo} 
                  alt={job.company.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">
                    {job.company?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  <Link to={`/jobs/${job._id}`} className="hover:text-primary-600 transition duration-300">
                    {job.title}
                  </Link>
                </h3>
                <p className="text-gray-600">{job.company?.name}</p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-primary-600" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaBriefcase className="mr-2 text-primary-600" />
                <span className="capitalize">{job.type.replace('-', ' ')}</span>
              </div>
              {job.salary && (
                <div className="flex items-center text-gray-600">
                  <FaDollarSign className="mr-2 text-primary-600" />
                  <span>${job.salary.toLocaleString()}/year</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500 mb-2">
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
            {showApply && (
              <Link 
                to={`/jobs/${job._id}/apply`}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 line-clamp-2">{job.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index} 
                className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;