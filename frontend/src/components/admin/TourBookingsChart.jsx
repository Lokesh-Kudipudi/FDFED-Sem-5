import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TourBookingsChart({ packages = [] }) {
  // Sort packages by bookings and take top 10
  const sortedPackages = [...packages]
    .sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0))
    .slice(0, 10);

  const labels = sortedPackages.map((p) => p.title);
  const dataPoints = sortedPackages.map((p) => p.totalBookings || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Total Bookings",
        data: dataPoints,
        backgroundColor: "rgba(99, 102, 241, 0.6)", // indigo-500
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top 10 Most Booked Tours",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
            color: "rgba(0, 0, 0, 0.05)",
        }
      },
      x: {
        grid: {
            display: false,
        }
      }
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={data} options={options} />
    </div>
  );
}
