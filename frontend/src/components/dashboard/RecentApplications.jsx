import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-green-100 text-green-800',
};

const RecentApplications = ({ applications }) => {
  // Defensive: ensure applications is always an array
  const safeApplications = Array.isArray(applications) ? applications : [];
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 80 }}
    >
      {safeApplications.length === 0 ? (
        <p className="text-gray-600">No recent applications</p>
      ) : (
        safeApplications.map(app => (
          <motion.div
            key={app._id}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 70 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">
                  <Link to={`/jobs/${app.job?._id}`} className="hover:text-primary-600">
                    {app.job?.title || 'Job Title'}
                  </Link>
                </h3>
                <p className="text-sm text-gray-600">
                  {app.applicant?.name || 'Applicant'} • {app.applicant?.email || 'Email'}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[app.status] || 'bg-gray-100 text-gray-800'}`}>
                  {app.status}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default RecentApplications;