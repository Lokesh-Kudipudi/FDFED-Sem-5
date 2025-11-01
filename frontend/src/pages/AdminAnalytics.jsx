import React, { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  FaDollarSign,
  FaCalendarCheck,
  FaFileInvoiceDollar,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaUmbrellaBeach,
  FaMountain,
  FaLandmark,
  FaCity,
} from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper component for Stat Cards
const StatsCard = ({ title, value, change, icon, bgColor, changeColor }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-gray-500 text-sm mb-1">{title}</div>
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
        <div className={`flex items-center text-sm mt-1 ${changeColor}`}>
          {change.includes("+") ? (
            <FaArrowUp className="mr-1" size={12} />
          ) : (
            <FaArrowDown className="mr-1" size={12} />
          )}
          {change}
        </div>
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl ${bgColor}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

// Chart Data & Options from analytics.js
const revenueChartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Revenue",
      data: [29450, 34210, 31760, 32072],
      borderColor: "#3498db",
      backgroundColor: "rgba(52, 152, 219, 0.1)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Last Month",
      data: [24850, 29210, 26760, 27072],
      borderColor: "rgba(189, 195, 199, 0.8)",
      backgroundColor: "rgba(189, 195, 199, 0.1)",
      tension: 0.4,
      fill: true,
      borderDash: [5, 5],
    },
  ],
};

const revenueChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        callback: function (value) {
          return "$" + value.toLocaleString();
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const categoryChartData = {
  labels: [
    "Beach Vacations",
    "Adventure Tours",
    "Cultural Experiences",
    "Urban Exploration",
  ],
  datasets: [
    {
      data: [310, 240, 180, 120],
      backgroundColor: ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"],
      hoverOffset: 4,
    },
  ],
};

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
  },
};

// Mock Data for Top Packages Table
const topPackages = [
  {
    name: "Bali Beach Paradise",
    icon: <FaUmbrellaBeach />,
    iconBg: "bg-blue-500",
    bookings: 102,
    revenue: 35700,
    contribution: 28.5,
    growth: "+15.2%",
    growthColor: "text-green-600",
  },
  {
    name: "Alpine Adventure",
    icon: <FaMountain />,
    iconBg: "bg-red-500",
    bookings: 85,
    revenue: 29750,
    contribution: 23.8,
    growth: "+8.1%",
    growthColor: "text-green-600",
  },
  {
    name: "Ancient Wonders Tour",
    icon: <FaLandmark />,
    iconBg: "bg-green-500",
    bookings: 71,
    revenue: 21300,
    contribution: 17.0,
    growth: "-2.7%",
    growthColor: "text-red-600",
  },
  {
    name: "Tokyo Urban Experience",
    icon: <FaCity />,
    iconBg: "bg-purple-500",
    bookings: 64,
    revenue: 16832,
    contribution: 13.2,
    growth: "+31.5%",
    growthColor: "text-green-600",
  },
];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState("2024");

  return (
    <div className="p-5 bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800">
          Revenue Analytics
        </h1>
        <div className="flex gap-3">
          <select
            className="p-2.5 rounded-md border border-gray-300 text-sm bg-white"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <select
            className="p-2.5 rounded-md border border-gray-300 text-sm bg-white"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <StatsCard
          title="Total Revenue"
          value="$125,482"
          change="+12.5% vs last month"
          icon={<FaDollarSign />}
          bgColor="bg-blue-500"
          changeColor="text-green-600"
        />
        <StatsCard
          title="Bookings"
          value="842"
          change="+8.2% vs last month"
          icon={<FaCalendarCheck />}
          bgColor="bg-green-500"
          changeColor="text-green-600"
        />
        <StatsCard
          title="Avg. Booking Value"
          value="$149.03"
          change="+4.3% vs last month"
          icon={<FaFileInvoiceDollar />}
          bgColor="bg-purple-500"
          changeColor="text-green-600"
        />
        <StatsCard
          title="Conversion Rate"
          value="4.12%"
          change="-0.5% vs last month"
          icon={<FaChartLine />}
          bgColor="bg-yellow-500"
          changeColor="text-red-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Revenue Overview Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm h-96">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Overview
          </h2>
          <div className="h-full w-full max-h-[300px]">
            <Line data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>
        {/* Booking by Category Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm h-96">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Booking by Category
          </h2>
          <div className="h-full w-full max-h-[300px] flex justify-center items-center">
            <Doughnut data={categoryChartData} options={categoryChartOptions} />
          </div>
        </div>
      </div>

      {/* Top Performing Packages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Top Performing Packages
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Package
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Bookings
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Contribution
                </th>
                <th className="py-3 px-5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Growth (MoM)
                </th>
              </tr>
            </thead>
            <tbody>
              {topPackages.map((pkg) => (
                <tr key={pkg.name} className="hover:bg-gray-50">
                  {/* Package */}
                  <td className="py-4 px-5 border-b border-gray-200">
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-white mr-3 text-lg ${pkg.iconBg}`}
                      >
                        {pkg.icon}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {pkg.name}
                      </span>
                    </div>
                  </td>
                  {/* Bookings */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    {pkg.bookings}
                  </td>
                  {/* Revenue */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    ${pkg.revenue.toLocaleString()}
                  </td>
                  {/* Contribution */}
                  <td className="py-4 px-5 border-b border-gray-200 text-sm">
                    <div className="flex flex-col">
                      <span>{pkg.contribution.toFixed(1)}%</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${pkg.iconBg}`}
                          style={{ width: `${pkg.contribution}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  {/* Growth */}
                  <td
                    className={`py-4 px-5 border-b border-gray-200 text-sm font-medium ${pkg.growthColor}`}
                  >
                    {pkg.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
