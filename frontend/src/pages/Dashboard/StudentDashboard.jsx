import React from 'react';
import DashboardCard from '../../components/dashboard/DashboardCard';
import JobStatsChart from '../../components/dashboard/JobStatsChart';
import RecentApplications from '../../components/dashboard/RecentApplications';

const StudentDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Applications"
          value="12"
          icon="📝"
        />
        <DashboardCard
          title="Active Applications"
          value="5"
          icon="🎯"
        />
        <DashboardCard
          title="Interviews Scheduled"
          value="2"
          icon="📅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Application Statistics</h2>
          <JobStatsChart />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <RecentApplications />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
