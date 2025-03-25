'use client'
import { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BusinessPerformance = () => {
  // Sample data - in a real app, this would come from an API
  const [performanceData, setPerformanceData] = useState({
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [3000, 3500, 4200, 4800, 5100, 5600],
    },
    customers: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [120, 132, 141, 154, 162, 175],
    },
    salesByCategory: {
      labels: ['Product A', 'Product B', 'Product C', 'Product D'],
      data: [35, 25, 22, 18],
    },
    kpis: [
      { name: 'Revenue Growth', value: '12.5%', trend: 'up' },
      { name: 'Customer Retention', value: '87%', trend: 'up' },
      { name: 'Avg. Order Value', value: '$125', trend: 'down' },
      { name: 'Conversion Rate', value: '3.2%', trend: 'up' },
    ]
  });

  // Chart configurations
  const revenueChartData = {
    labels: performanceData.revenue.labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: performanceData.revenue.data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const customerChartData = {
    labels: performanceData.customers.labels,
    datasets: [
      {
        label: 'Total Customers',
        data: performanceData.customers.data,
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  };

  const salesCategoryData = {
    labels: performanceData.salesByCategory.labels,
    datasets: [
      {
        data: performanceData.salesByCategory.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Business Performance Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {performanceData.kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">{kpi.name}</h3>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">{kpi.value}</span>
              <span className={`ml-2 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <Bar data={revenueChartData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Customer Growth</h2>
          <Line data={customerChartData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
          <div className="w-full max-w-md mx-auto">
            <Doughnut data={salesCategoryData} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Revenue has shown consistent growth over the past 6 months</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Customer acquisition rate has increased by 8.3% compared to previous quarter</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span>Average order value has decreased slightly, consider upselling strategies</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Product A continues to be the top-selling category</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BusinessPerformance;
