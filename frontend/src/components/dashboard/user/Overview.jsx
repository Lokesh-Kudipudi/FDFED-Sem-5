import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { FaPlaneDeparture, FaHotel, FaWallet, FaMapMarkedAlt, FaCalendarCheck, FaStar } from "react-icons/fa";

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Overview = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/bookings", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setBookings(data.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to sync your dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingStatus = (booking) => {
    if (booking.bookingDetails?.status === "cancel") return "cancelled";
    const endDateStr = booking.type === "Tour" ? booking.bookingDetails?.endDate : booking.bookingDetails?.checkOut;
    if (!endDateStr) return "upcoming";
    return new Date(endDateStr) < new Date() ? "completed" : "upcoming";
  };

  // Analytics Logic
  const analytics = {
    total: bookings.length,
    tours: bookings.filter(b => b.type === "Tour").length,
    hotels: bookings.filter(b => b.type === "Hotel").length,
    upcoming: bookings.filter(b => getBookingStatus(b) === "upcoming").length,
    spent: bookings.reduce((sum, b) => b.bookingDetails?.status !== "cancel" ? sum + (b.bookingDetails?.price || b.bookingDetails?.totalPrice || 0) : sum, 0),
    destinations: new Set(bookings.map(b => b.itemId?.location || b.itemId?.startLocation)).size
  };

  // Chart Data Preparation
  const monthlyData = {};
  bookings.forEach(b => {
      const d = new Date(b.createdAt);
      const k = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      monthlyData[k] = (monthlyData[k] || 0) + 1;
  });
  const chartLabels = Object.keys(monthlyData).slice(-6);
  const chartValues = Object.values(monthlyData).slice(-6);

  const bookingTrendData = {
    labels: chartLabels,
    datasets: [{
      label: 'Bookings',
      data: chartValues,
      borderColor: '#003366',
      backgroundColor: 'rgba(0, 51, 102, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#003366',
      pointRadius: 6,
    }]
  };

  const distributionData = {
    labels: ['Tours', 'Hotels'],
    datasets: [{
      data: [analytics.tours, analytics.hotels],
      backgroundColor: ['#003366', '#FF8C00'], // Deep Blue & Accent Orange
      borderWidth: 0,
    }]
  };
  
 const spendingData = {
    labels: ['Tours', 'Hotels'],
    datasets: [{
      label: 'Spending',
      data: [
        bookings.filter(b => b.type === "Tour").reduce((s, b) => s + (b.bookingDetails?.price || 0), 0),
        bookings.filter(b => b.type === "Hotel").reduce((s, b) => s + (b.bookingDetails?.totalPrice || 0), 0)
      ],
       backgroundColor: ['rgba(0, 51, 102, 0.8)', 'rgba(255, 140, 0, 0.8)'],
       borderRadius: 10,
    }]
 };

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-16 h-16 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-serif font-bold text-[#003366] mb-2">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {state.user?.fullName?.split(" ")[0]}! Here's your travel performance.</p>
            </div>
            <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Loyalty Status</p>
                <div className="flex items-center gap-2 text-[#003366] font-bold text-xl">
                    <FaStar className="text-yellow-400" /> Platinum Member
                </div>
            </div>
        </div>

        {/* Hero Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#003366] to-[#004080] rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20 transform hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><FaWallet className="text-2xl" /></div>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">+12%</span>
                </div>
                <h3 className="text-white/70 text-sm font-medium mb-1">Total Spent</h3>
                <p className="text-3xl font-bold tracking-tight">₹{analytics.spent.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><FaPlaneDeparture className="text-2xl" /></div>
                </div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Trips</h3>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-800">{analytics.total}</p>
                    <span className="text-gray-400 text-sm mb-1">bookings</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-blue-100 text-[#003366] rounded-2xl"><FaCalendarCheck className="text-2xl" /></div>
                </div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Upcoming</h3>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-800">{analytics.upcoming}</p>
                    <span className="text-gray-400 text-sm mb-1">adventures</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transform hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl"><FaMapMarkedAlt className="text-2xl" /></div>
                </div>
                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Explored</h3>
                <div className="flex items-end gap-2">
                     <p className="text-3xl font-bold text-gray-800">{analytics.destinations}</p>
                     <span className="text-gray-400 text-sm mb-1">cities</span>
                </div>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Trend Data */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 font-serif">Booking Activity</h3>
                <div className="h-64">
                    <Line data={bookingTrendData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
                </div>
            </div>

            {/* Distribution */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center justify-center">
                 <h3 className="text-xl font-bold text-gray-800 mb-6 font-serif w-full text-left">Preferences</h3>
                 <div className="h-48 w-48 relative">
                     <Doughnut data={distributionData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                     <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                         <span className="text-3xl font-bold text-[#003366]">{analytics.total}</span>
                         <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
                     </div>
                 </div>
                 <div className="flex gap-6 mt-8">
                     <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-3 h-3 rounded-full bg-[#003366]"></div> Tours</div>
                     <div className="flex items-center gap-2 text-sm text-gray-600"><div className="w-3 h-3 rounded-full bg-[#FF8C00]"></div> Hotels</div>
                 </div>
            </div>
        </div>

         {/* Spending & Recent */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 font-serif">Spending Analysis</h3>
                <div className="h-64">
                    <Bar data={spendingData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { display: false } }, x: { grid: { display: false } } } }} />
                </div>
             </div>

             <div className="bg-gradient-to-br from-[#003366] to-[#001a33] p-8 rounded-[2rem] shadow-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-6 font-serif">Next Adventure</h3>
                    {bookings.filter(b => getBookingStatus(b) === "upcoming").length > 0 ? (
                        (() => {
                            const next = bookings.filter(b => getBookingStatus(b) === "upcoming").sort((a,b) => new Date(a.bookingDetails.startDate || a.bookingDetails.checkIn) - new Date(b.bookingDetails.startDate || b.bookingDetails.checkIn))[0];
                            return (
                                <div>
                                    <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">{next.type} Reservation</div>
                                    <h2 className="text-3xl font-bold mb-4">{next.itemId?.title}</h2>
                                    <div className="flex gap-4 text-sm text-white/80 mb-8">
                                        <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md">📅 {new Date(next.bookingDetails?.startDate || next.bookingDetails?.checkIn).toDateString()}</span>
                                        <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md">📍 {next.itemId?.location || next.itemId?.startLocation}</span>
                                    </div>
                                    <button onClick={() => navigate(next.type === "Tour" ? `/tours/${next.itemId._id}` : `/hotels/hotel/${next.itemId._id}`)} className="bg-white text-[#003366] px-6 py-3 rounded-xl font-bold w-full hover:bg-blue-50 transition-colors">
                                        View Ticket
                                    </button>
                                </div>
                            )
                        })()
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-white/60 mb-4">No upcoming trips planned.</p>
                            <button onClick={() => navigate("/")} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">Start Exploring</button>
                        </div>
                    )}
                </div>
                {/* Decor */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
             </div>
         </div>

    </div>
  );
};

export default Overview;
