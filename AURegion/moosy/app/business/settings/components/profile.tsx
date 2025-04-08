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
import { useRouter } from 'next/navigation';
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
import { useAppContext } from '@/app/utils/AppContext';

// Define TypeScript interfaces for the data structure
interface DailyData {
  total_revenue: number;
  total_count: number;
  most_used_payment_method: string | null;
  most_used_service: string | null;
  new_customer: number;
}

interface WeeklyBreakdownItem {
  date_full: string;
  total_revenue: number;
  total_count: number;
  most_used_payment_method: string | null;
  most_used_service: string | null;
  new_customer: number;
}

interface WeeklyData {
  total_revenue: number;
  total_count: number;
  breakdown: WeeklyBreakdownItem[];
}

interface MonthlyBreakdownItem {
  month: string;
  total_revenue: number;
  total_count: number;
  most_used_payment_method: string | null;
  most_used_service: string | null;
  new_customer: number;
}

interface MonthlyData {
  total_revenue: number;
  total_count: number;
  breakdown: MonthlyBreakdownItem[];
}

interface FinancialData {
  daily: DailyData;
  weekly: WeeklyData;
  monthly: MonthlyData;
}

interface BusinessData {
  financial: FinancialData;
}

const BusinessPerformance = () => {
  const router = useRouter();
  const { auth } = useAppContext();
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeChart, setActiveChart] = useState(0);

  useEffect(() => {
    if (!auth?.company.id) {
      router.push('/dashboard/login')
    }
  }, [])
  
  // Use real data from auth.company.financial instead of hardcoded data
  const dailyData = auth?.company?.financial?.daily || {
    total_revenue: 0,
    total_count: 0,
    most_used_payment_method: null,
    most_used_service: null,
    new_customer: 0
  };
  
  const weeklyData = auth?.company?.financial?.weekly || {
    total_revenue: 0,
    total_count: 0,
    breakdown: []
  };
  
  const monthlyData = auth?.company?.financial?.monthly || {
    total_revenue: 0,
    total_count: 0,
    breakdown: []
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format weekday only (for weekly charts)
  const formatWeekdayOnly = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long'
    });
  };

  // Format month only (for monthly charts)
  const formatMonthOnly = (monthString: string): string => {
    return monthString;
  };

  // Get current data based on time period
  const getCurrentData = (): DailyData | WeeklyData | MonthlyData => {
    switch(timePeriod) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  // Prepare chart data for weekly view
  const prepareWeeklyChartData = () => {
    const labels = weeklyData.breakdown.map(item => formatWeekdayOnly(item.date_full));
    const revenueData = weeklyData.breakdown.map(item => item.total_revenue);
    const customerData = weeklyData.breakdown.map(item => item.new_customer);
    
    return {
      labels,
      revenueData,
      customerData
    };
  };

  // Prepare chart data for monthly view
  const prepareMonthlyChartData = () => {
    const labels = monthlyData.breakdown.map(item => formatMonthOnly(item.month));
    const revenueData = monthlyData.breakdown.map(item => item.total_revenue);
    const customerData = monthlyData.breakdown.map(item => item.new_customer);
    
    return {
      labels,
      revenueData,
      customerData
    };
  };

  const weeklyChartData = prepareWeeklyChartData();
  const monthlyChartData = prepareMonthlyChartData();

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
    labels: timePeriod === 'weekly' ? weeklyChartData.labels : monthlyChartData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: timePeriod === 'weekly' ? weeklyChartData.revenueData : monthlyChartData.revenueData,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  };

  const customerChartData = {
    labels: timePeriod === 'weekly' ? weeklyChartData.labels : monthlyChartData.labels,
    datasets: [
      {
        label: 'New Customers',
        data: timePeriod === 'weekly' ? weeklyChartData.customerData : monthlyChartData.customerData,
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

  // Generate insights based on the current data
  const generateInsights = () => {
    const currentData = getCurrentData();
    const insights = [];
    
    // Revenue insight
    insights.push({
      title: 'Revenue',
      description: `Today's revenue is ${formatCurrency(currentData.total_revenue)} from ${currentData.total_count} transactions.`,
      color: 'bg-black'
    });
    
    // Customer insight - only for daily data
    if (timePeriod === 'daily') {
      insights.push({
        title: 'New Customers',
        description: `${(currentData as DailyData).new_customer} new customers today.`,
        color: 'bg-blue-500'
      });
      
      // Service insight - only for daily data
      insights.push({
        title: 'Popular Service',
        description: `${(currentData as DailyData).most_used_service || 'No services today'} is the most popular service.`,
        color: 'bg-purple-500'
      });
      
      // Payment method insight - only for daily data
      insights.push({
        title: 'Payment Method',
        description: `Most customers paid with ${(currentData as DailyData).most_used_payment_method || 'no payments today'}.`,
        color: 'bg-green-500'
      });
    } else {
      // For weekly and monthly data
      insights.push({
        title: 'Total Transactions',
        description: `Total of ${currentData.total_count} transactions.`,
        color: 'bg-blue-500'
      });
      
      insights.push({
        title: 'Average Revenue',
        description: `Average revenue of ${formatCurrency(currentData.total_revenue / currentData.total_count || 0)} per transaction.`,
        color: 'bg-purple-500'
      });
      
      insights.push({
        title: 'Period Summary',
        description: `Total revenue of ${formatCurrency(currentData.total_revenue)} for the ${timePeriod} period.`,
        color: 'bg-green-500'
      });
    }
    
    return insights;
  };

  const insights = generateInsights();
  const currentData = getCurrentData();
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-40">
      {/* Company Profile Section */}
      <div className="flex flex-col items-center mb-10">
        {auth?.company.profile?.path && (
          <div 
            className="absolute top-0 left-0 w-full h-64 bg-cover bg-center opacity-20 z-0"
            style={{ backgroundImage: `url(${auth.company.profile.path})` }}
          ></div>
        )}
        <div className="w-32 h-32 rounded-full bg-white shadow-md flex items-center justify-center mb-4 overflow-hidden z-10">
          {auth?.company.logo.path ? (
            <img 
              src={auth.company.logo.path} 
              alt={`${auth?.company.name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {auth?.company.name?.charAt(0) || 'M'}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 z-10">{auth?.company.name}</h1>
        <p className="text-gray-600 mt-2 z-10">Business Analytics Dashboard</p>
      </div>
      
      {/* Time Period Selection Tab */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm overflow-hidden" role="group">
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium ${timePeriod === 'daily'
                ? 'bg-black text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => setTimePeriod('daily')}
          >
            Daily
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium border-l border-r border-gray-200 ${timePeriod === 'weekly'
                ? 'bg-black text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => setTimePeriod('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium ${timePeriod === 'monthly'
                ? 'bg-black text-white'
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => setTimePeriod('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.total_revenue)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Transactions</h3>
          <p className="text-2xl font-bold text-gray-900">{currentData.total_count}</p>
        </div>
        {timePeriod === 'daily' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">New Customers</h3>
              <p className="text-2xl font-bold text-gray-900">{(currentData as DailyData).new_customer}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Popular Service</h3>
              <p className="text-2xl font-bold text-gray-900 truncate">{(currentData as DailyData).most_used_service || 'None'}</p>
            </div>
          </>
        )}
        {timePeriod !== 'daily' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Average Revenue</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentData.total_revenue / currentData.total_count || 0)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Period Summary</h3>
              <p className="text-2xl font-bold text-gray-900">{timePeriod === 'weekly' ? 'Weekly' : 'Monthly'}</p>
            </div>
          </>
        )}
      </div>
      
      {/* Carousel of Charts - Show for weekly and monthly views */}
      {(timePeriod === 'weekly' || timePeriod === 'monthly') && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-medium text-gray-900">
              {activeChart === 0 ? 'Revenue Trend' : 'New Customers'}
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveChart(0)}
                className={`w-3 h-3 rounded-full ${activeChart === 0 ? 'bg-black' : 'bg-gray-300'}`}
                aria-label="Revenue Chart"
              />
              <button 
                onClick={() => setActiveChart(1)}
                className={`w-3 h-3 rounded-full ${activeChart === 1 ? 'bg-black' : 'bg-gray-300'}`}
                aria-label="Customer Chart"
              />
            </div>
          </div>
          
          <div className="h-80">
            {activeChart === 0 && (
              <Bar data={revenueChartData} options={chartOptions} />
            )}
            {activeChart === 1 && (
              <Line data={customerChartData} options={chartOptions} />
            )}
          </div>
        </div>
      )}
      
      {/* Performance Insights Summary */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-5">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full ${insight.color} flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0`}>
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{insight.title}</h3>
                <p className="text-gray-700 text-sm mt-1">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessPerformance;
