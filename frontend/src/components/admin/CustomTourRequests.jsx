import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaMoneyBillWave, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";

const CustomTourRequests = () => {
  const [requests, setRequests] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState({});

  useEffect(() => {
    fetchRequests();
    fetchTourGuides();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/admin/custom-tours", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.status === "success") {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTourGuides = async () => {
    try {
      const response = await fetch("http://localhost:5500/tourGuides", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Tour guides data:", data); // Debug log
      if (data.status === "success") {
        setTourGuides(data.data || []);
      } else if (Array.isArray(data)) {
        setTourGuides(data);
      }
    } catch (error) {
      console.error("Error fetching tour guides:", error);
      toast.error("Failed to load tour guides");
    }
  };

  const handleAssign = async (requestId) => {
    const guideId = selectedGuide[requestId];
    if (!guideId) {
      toast.error("Please select a tour guide");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5500/api/admin/custom-tours/${requestId}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ tourGuideId: guideId }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Tour guide assigned successfully!");
        fetchRequests();
      } else {
        toast.error(data.message || "Failed to assign");
      }
    } catch (error) {
      toast.error(`Failed to assign tour guide ${error}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      assigned: "bg-blue-100 text-blue-700 border-blue-300",
      quoted: "bg-purple-100 text-purple-700 border-purple-300",
      bargaining: "bg-orange-100 text-orange-700 border-orange-300",
      accepted: "bg-green-100 text-green-700 border-green-300",
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
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Custom Tour Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No custom tour requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="border-2 border-gray-100 rounded-xl p-5 hover:border-[#003366] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{request.title}</h3>
                  <p className="text-sm text-gray-500">
                    Requested by: {request.userId?.fullName || "Unknown"}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                  {request.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
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
                  {new Date(request.travelDates.startDate).toLocaleDateString()}
                </div>
              </div>

              {request.status === "pending" ? (
                <div className="flex gap-3 items-end mt-4 pt-4 border-t border-gray-100">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assign Tour Guide
                    </label>
                    <select
                      value={selectedGuide[request._id] || ""}
                      onChange={(e) =>
                        setSelectedGuide({ ...selectedGuide, [request._id]: e.target.value })
                      }
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#003366] outline-none"
                    >
                      <option value="">Select a tour guide...</option>
                      {tourGuides.map((guide) => (
                        <option key={guide._id} value={guide._id}>
                          {guide.fullName} - {guide.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleAssign(request._id)}
                    className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaUserTie /> Assign
                  </button>
                </div>
              ) : request.assignedTourGuide && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong>Assigned to:</strong> {request.assignedTourGuide.fullName}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomTourRequests;
