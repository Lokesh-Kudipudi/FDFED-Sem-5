import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BookingChart({ monthlyData = [] }) {
  // monthlyData is expected to be [{ _id: 1, count: 10 }, ... ]
  // We need to fill in missing months with 0
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const dataPoints = new Array(12).fill(0);
  
  monthlyData.forEach((item) => {
    if (item._id >= 1 && item._id <= 12) {
      dataPoints[item._id - 1] = item.count;
    }
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: "Bookings",
        data: dataPoints,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)", // blue-500 with opacity
        borderColor: "rgba(59, 130, 246, 1)", // blue-500
        tension: 0.4, // smooth curves
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
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Line data={data} options={options} />
    </div>
  );
}
