import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  ArcElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
);

const revenueData = {
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

const revenueOptions = {
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
        callback: (value) => "$" + value.toLocaleString(),
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const categoryData = {
  labels: [
    "Beach Vacations",
    "Adventure Tours",
    "Cultural Experiences",
    "Cruises",
    "Urban Gateways",
  ],
  datasets: [
    {
      data: [37, 25, 18, 12, 8],
      backgroundColor: [
        "#3498db",
        "#2ecc71",
        "#f39c12",
        "#e74c3c",
        "#9b59b6",
      ],
      borderWidth: 0,
    },
  ],
};

const categoryOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  cutout: "70%",
};

export default function DashboardCharts() {
  return (
    <div style={{ display: "flex", gap: "20px", width: "100%" }}>
      {/* Revenue Line Chart */}
      <div style={{ flex: 2, height: "350px" }}>
        <Line data={revenueData} options={revenueOptions} />
      </div>

      {/* Doughnut Category Chart */}
      <div style={{ flex: 1, height: "350px" }}>
        <Doughnut data={categoryData} options={categoryOptions} />
      </div>
    </div>
  );
}
