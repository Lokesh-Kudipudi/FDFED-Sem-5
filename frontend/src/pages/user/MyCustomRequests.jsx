import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaMoneyBillWave, FaCheck, FaTimes, FaComment } from "react-icons/fa";
import toast from "react-hot-toast";

const MyCustomRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [bargainData, setBargainData] = useState({ amount: "", message: "" });

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
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, quoteId) => {
    try {
      const response = await fetch(
        `http://localhost:5500/api/custom-tours/${requestId}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quoteId }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Quote accepted!");
        fetchRequests();
      }
    } catch (error) {
      toast.error(`Failed to accept quote: ${error}`);
    }
  };

  const handleBargain = async () => {
    if (!bargainData.amount) {
      toast.error("Please enter an amount");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5500/api/custom-tours/${selectedRequest._id}/bargain`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(bargainData),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Counter-offer sent!");
        setShowBargainModal(false);
        setBargainData({ amount: "", message: "" });
        fetchRequests();
      }
    } catch (error) {
      toast.error(`Failed to send bargain: ${error}`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      quoted: "bg-blue-100 text-blue-700",
      bargaining: "bg-purple-100 text-purple-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 pt-28 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#003366]">
              My Custom Requests
            </h1>
            <p className="text-gray-600 mt-2">View and manage your custom tour requests</p>
          </div>
          <button
            onClick={() => navigate("/customize-tour")}
            className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#0055aa] hover:from-[#002244] hover:to-[#004488] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            + New Request
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No custom requests yet. Create one to get started!</p>
            <button
              onClick={() => navigate("/customize-tour")}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Create Custom Tour
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request, index) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
                style={{ animation: `fadeIn 0.3s ease-out ${index * 0.1}s backwards` }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#003366] to-[#0055aa] p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">{request.title}</h3>
                      <p className="text-blue-100 mt-1">
                        {new Date(request.travelDates.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.travelDates.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#003366]" />
                      <span className="text-sm text-gray-600">{request.places.length} places</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-[#003366]" />
                      <span className="text-sm text-gray-600">{request.numPeople} people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#003366]" />
                      <span className="text-sm text-gray-600">₹{request.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaComment className="text-[#003366]" />
                      <span className="text-sm text-gray-600">{request.quotes.length} quotes</span>
                    </div>
                  </div>

                  {/* Quotes */}
                  {request.quotes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-4">Quotes from Tour Guides</h4>
                      <div className="grid gap-4">
                        {request.quotes.map((quote) => (
                          <div
                            key={quote._id}
                            className="border-2 border-blue-50 rounded-xl p-4 bg-blue-50/30"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-bold text-gray-800">{quote.tourGuideName}</p>
                                <p className="text-2xl font-bold text-[#003366] mt-1">
                                  ₹{quote.amount.toLocaleString()}
                                </p>
                              </div>
                              {request.status !== "accepted" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAccept(request._id, quote._id)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                                  >
                                    <FaCheck /> Accept
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setBargainData({ amount: quote.amount, message: "" });
                                      setShowBargainModal(true);
                                    }}
                                    className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-lg font-semibold transition-all"
                                  >
                                    Bargain
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{quote.message}</p>
                            {quote.itinerary && (
                              <p className="text-gray-500 text-xs mt-2 italic">
                                {quote.itinerary}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bargain Modal */}
      {showBargainModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowBargainModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <h3 className="text-2xl font-bold text-[#003366] mb-4">Make a Counter-Offer</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Offer (INR)</label>
                <input
                  type="number"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#003366] outline-none"
                  value={bargainData.amount}
                  onChange={(e) => setBargainData({ ...bargainData, amount: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#003366] outline-none resize-none"
                  rows="3"
                  value={bargainData.message}
                  onChange={(e) => setBargainData({ ...bargainData, message: e.target.value })}
                  placeholder="Your message to the tour guide..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBargainModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBargain}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#003366] to-[#0055aa] hover:from-[#002244] hover:to-[#004488] text-white rounded-xl font-semibold transition-all"
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyCustomRequests;
