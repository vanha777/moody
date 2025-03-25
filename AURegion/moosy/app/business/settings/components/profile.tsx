'use client'
import { useState, useEffect, SetStateAction } from 'react';
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
  const [timePeriod, setTimePeriod] = useState('monthly');
  
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

  // Add time period change handler
  const handleTimePeriodChange = (period: SetStateAction<string>) => {
    setTimePeriod(period);
    // In a real app, you would fetch new data based on the selected period
    // For now, we'll just simulate different data for demonstration
    
    if (period === 'weekly') {
      setPerformanceData({
        revenue: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [800, 950, 1100, 980, 1200, 1350, 900],
        },
        customers: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [28, 32, 35, 30, 38, 42, 26],
        },
        salesByCategory: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D'],
          data: [38, 22, 25, 15],
        },
        kpis: [
          { name: 'Revenue Growth', value: '5.2%', trend: 'up' },
          { name: 'Customer Retention', value: '92%', trend: 'up' },
          { name: 'Avg. Order Value', value: '$112', trend: 'up' },
          { name: 'Conversion Rate', value: '2.8%', trend: 'down' },
        ]
      });
    } else if (period === 'monthly') {
      setPerformanceData({
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
    } else if (period === 'yearly') {
      setPerformanceData({
        revenue: {
          labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
          data: [32000, 38000, 35000, 42000, 48000, 55000],
        },
        customers: {
          labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
          data: [950, 1050, 1100, 1250, 1450, 1600],
        },
        salesByCategory: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D'],
          data: [40, 30, 18, 12],
        },
        kpis: [
          { name: 'Revenue Growth', value: '14.6%', trend: 'up' },
          { name: 'Customer Retention', value: '82%', trend: 'down' },
          { name: 'Avg. Order Value', value: '$145', trend: 'up' },
          { name: 'Conversion Rate', value: '3.8%', trend: 'up' },
        ]
      });
    }
  };

  // Updated chart configurations with proper TypeScript types
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#333',
          font: {
            family: "'Inter', sans-serif",
            weight: 'bold' as const,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#333'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#333'
        }
      }
    }
  };

  const revenueChartData = {
    labels: performanceData.revenue.labels,
    datasets: [
      {
        label: 'Revenue',
        data: performanceData.revenue.data,
        backgroundColor: [
          'rgba(0, 0, 0, 0.8)',
          'rgba(45, 55, 72, 0.8)',
          'rgba(66, 153, 225, 0.8)',
          'rgba(49, 130, 206, 0.8)',
          'rgba(44, 82, 130, 0.8)',
          'rgba(26, 32, 44, 0.8)',
          'rgba(0, 0, 0, 0.8)',
        ],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  };

  const customerChartData = {
    labels: performanceData.customers.labels,
    datasets: [
      {
        label: 'Customers',
        data: performanceData.customers.data,
        fill: true,
        backgroundColor: 'rgba(66, 153, 225, 0.15)',
        borderColor: 'rgba(49, 130, 206, 0.8)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const salesCategoryData = {
    labels: performanceData.salesByCategory.labels,
    datasets: [
      {
        data: performanceData.salesByCategory.data,
        backgroundColor: [
          'rgba(0, 0, 0, 0.9)',
          'rgba(49, 130, 206, 0.8)',
          'rgba(159, 122, 234, 0.7)',
          'rgba(237, 100, 166, 0.7)',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          color: '#333',
          font: {
            family: "'Inter', sans-serif",
            weight: 'bold' as const,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: false
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Business Performance</h1>
      
      {/* Time Period Selection Tab */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm overflow-hidden" role="group">
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium ${
              timePeriod === 'weekly' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => handleTimePeriodChange('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium border-l border-r border-gray-200 ${
              timePeriod === 'monthly' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => handleTimePeriodChange('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium ${
              timePeriod === 'yearly' 
                ? 'bg-black text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => handleTimePeriodChange('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {/* KPI Cards with subtle color indicator based on trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {performanceData.kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{kpi.name}</h3>
              <span className={`w-2 h-2 rounded-full ${kpi.trend === 'up' ? 'bg-blue-500' : 'bg-pink-500'}`}></span>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
              <span className={`ml-2 ${kpi.trend === 'up' ? 'text-blue-600' : 'text-pink-600'} p-1 rounded-full`}>
                {kpi.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts with color accents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-5">Revenue Trend</h2>
          <div className="h-64">
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-5">Customer Growth</h2>
          <div className="h-64">
            <Line data={customerChartData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-5">Sales by Category</h2>
          <div className="w-full max-w-md mx-auto h-64 flex items-center justify-center">
            <Doughnut data={salesCategoryData} options={doughnutOptions} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-5">Performance Insights</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">1</div>
              <p className="text-gray-700">Revenue has shown consistent growth over the past 6 months</p>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">2</div>
              <p className="text-gray-700">Customer acquisition rate has increased by 8.3% compared to previous period</p>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">3</div>
              <p className="text-gray-700">Average order value has decreased slightly, consider upselling strategies</p>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0">4</div>
              <p className="text-gray-700">Product A continues to be the top-selling category</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BusinessPerformance;
