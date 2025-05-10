import { useEffect } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { FaSpinner } from 'react-icons/fa';
import useTaskStore from '../../store/taskStore';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const TaskStatistics = () => {
  const { statistics, fetchTaskStatistics, isLoading, error } = useTaskStore();
  
  useEffect(() => {
    fetchTaskStatistics();
  }, [fetchTaskStatistics]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading statistics: {error}
      </div>
    );
  }
  
  if (!statistics) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        No statistics available. Start creating tasks to see your progress!
      </div>
    );
  }
  
  // Prepare data for status chart
  const statusData = {
    labels: statistics.byStatus?.map(item => item.status) || [],
    datasets: [
      {
        data: statistics.byStatus?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)', // Blue for Pending
          'rgba(75, 192, 192, 0.6)', // Green for Completed
          'rgba(255, 206, 86, 0.6)', // Yellow for In Progress
          'rgba(255, 99, 132, 0.6)'  // Red for other statuses
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare data for priority chart
  const priorityData = {
    labels: statistics.byPriority?.map(item => item.priority) || [],
    datasets: [
      {
        data: statistics.byPriority?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Red for High
          'rgba(255, 206, 86, 0.6)',  // Yellow for Medium
          'rgba(75, 192, 192, 0.6)'   // Green for Low
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare data for category chart
  const categoryData = {
    labels: statistics.byCategory?.map(item => item.category || 'Uncategorized') || [],
    datasets: [
      {
        data: statistics.byCategory?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare data for tasks completed by day
  const completedByDayData = {
    labels: statistics.completedByDay?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Tasks Completed',
        data: statistics.completedByDay?.map(item => item.count) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Prepare data for tasks created by day
  const createdByDayData = {
    labels: statistics.createdByDay?.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }) || [],
    datasets: [
      {
        label: 'Tasks Created',
        data: statistics.createdByDay?.map(item => item.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Options for bar charts
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0 // Only show whole numbers
        }
      }
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Task Statistics</h2>
      
      {/* Upcoming Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Tasks</h3>
        {statistics.upcomingTasks && statistics.upcomingTasks.length > 0 ? (
          <div className="space-y-3">
            {statistics.upcomingTasks.map(task => (
              <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming tasks due in the next 7 days.</p>
        )}
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Status</h3>
          <div className="h-64">
            {statusData.labels.length > 0 ? (
              <Pie data={statusData} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Priority</h3>
          <div className="h-64">
            {priorityData.labels.length > 0 ? (
              <Pie data={priorityData} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Categories</h3>
          <div className="h-64">
            {categoryData.labels.length > 0 ? (
              <Pie data={categoryData} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tasks Completed by Day */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks Completed (Last 7 Days)</h3>
          <div className="h-64">
            {completedByDayData.labels.length > 0 ? (
              <Bar data={completedByDayData} options={barOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tasks Created by Day */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tasks Created (Last 7 Days)</h3>
          <div className="h-64">
            {createdByDayData.labels.length > 0 ? (
              <Bar data={createdByDayData} options={barOptions} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatistics;