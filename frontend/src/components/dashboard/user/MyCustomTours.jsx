import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaMoneyBillWave, FaPlus } from "react-icons/fa";

const MyCustomTours = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/custom-tours", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setRequests(data.data.slice(0, 3)); // Show only first 3
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      assigned: "bg-blue-100 text-blue-700 border-blue-300",
      quoted: "bg-purple-100 text-purple-700 border-purple-300",
      bargaining: "bg-orange-100 text-orange-700 border-orange-300",
      accepted: "bg-green-100 text-green-700 border-green-300",
      rejected: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#003366]">My Custom Tours</h2>
        <button
          onClick={() => navigate("/customize-tour")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <FaPlus /> Create New
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No custom tour requests yet</p>
          <button
            onClick={() => navigate("/customize-tour")}
            className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Create Your First Custom Tour
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="border-2 border-gray-100 rounded-xl p-4 hover:border-[#003366] transition-all cursor-pointer"
                onClick={() => navigate("/my-custom-requests")}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800">{request.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-[#003366]" />
                    {request.places.length} places
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="text-[#003366]" />
                    {request.numPeople} travelers
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMoneyBillWave className="text-[#003366]" />
                    ₹{request.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendar className="text-[#003366]" />
                    {request.quotes?.length || 0} quotes
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/my-custom-requests")}
            className="mt-4 w-full py-3 border-2 border-[#003366] text-[#003366] rounded-lg font-semibold hover:bg-[#003366] hover:text-white transition-all"
          >
            View All Custom Requests
          </button>
        </>
      )}
    </div>
  );
};

export default MyCustomTours;
