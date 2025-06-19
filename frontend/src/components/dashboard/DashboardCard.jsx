import { FaBriefcase, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const iconMap = {
  briefcase: FaBriefcase,
  'document-text': FaFileAlt,
  'check-circle': FaCheckCircle,
};

const colorMap = {
  primary: 'bg-primary-100 text-primary-600',
  secondary: 'bg-secondary-100 text-secondary-600',
  green: 'bg-green-100 text-green-600',
};

const DashboardCard = ({ title, value, icon, color }) => {
  const IconComponent = iconMap[icon] || FaBriefcase;
  const colorClasses = colorMap[color] || 'bg-primary-100 text-primary-600';

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 90 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses}`}>
          <IconComponent className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;