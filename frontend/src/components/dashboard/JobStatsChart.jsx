import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JobStatsChart = ({ jobs }) => {
  // Defensive: ensure jobs is an array
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const jobTypes = ['internship', 'full-time', 'part-time', 'remote', 'contract'];
  const counts = jobTypes.map(type => 
    safeJobs.filter(job => job.type === type).length
  );

  const data = {
    labels: jobTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
    datasets: [
      {
        label: 'Job Types',
        data: counts,
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default JobStatsChart;