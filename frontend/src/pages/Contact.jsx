import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsArrowLeft } from "react-icons/bs";
import Chatbot from "../components/Chatbot";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "demo",
    query: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.query
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5500/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Thank you! We'll contact you");
        navigate("/");
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (error) {
      toast.error(
        `Error: ${error.message}`
      );
      return;
    }

    setFormData({
      name: "",
      email: "",
      phone: "",
      reason: "demo",
      query: "",
    });
  };

  const [showInbox, setShowInbox] = useState(false);
  const [myQueries, setMyQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(false);

  const fetchMyQueries = async () => {
    setLoadingQueries(true);
    setShowInbox(true);
    try {
      const response = await fetch("http://localhost:5500/dashboard/api/user/queries", {
        credentials: "include",
      });
      if (response.status === 401 || response.status === 403) {
        toast.error("Please login to view your inbox");
        setShowInbox(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setMyQueries(data.data);
      } else {
        toast.error("Failed to load queries");
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Error loading inbox");
    } finally {
      setLoadingQueries(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
      style={{
        backgroundImage:
          "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

      <div className="flex w-[90%] max-w-[1200px] min-h-[600px] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden z-10 animate-slide-up my-10 relative">
        
        {/* Back Button */}
        <button 
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-[#003366] transition-colors"
        >
            <BsArrowLeft /> <span>Back to Home</span>
        </button>

        {/* Contact Form Section */}
        <div className="w-full md:w-3/5 p-12 flex flex-col justify-center relative">
          <div className="mt-8 mb-8 animate-slide-up flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Need help? Want a demo? Our team is here for you.
              </p>
            </div>
            <button
              onClick={fetchMyQueries}
              className="px-4 py-2 bg-blue-50 text-[#003366] rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
            >
              📥 My Inbox
            </button>
          </div>

          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="animate-slide-up-delay" style={{animationDelay: '0.1s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 bg-white/50"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="animate-slide-up-delay" style={{animationDelay: '0.2s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Work email
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 bg-white/50"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your work email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="animate-slide-up-delay" style={{animationDelay: '0.3s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                    Mobile number (+91)
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 bg-white/50"
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="animate-slide-up-delay" style={{animationDelay: '0.4s'}}>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reason">
                    Reason for contact
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all bg-white/50 text-gray-700"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="demo">Booking Inquiries</option>
                    <option value="technical">Special Requests</option>
                    <option value="pricing">Local Attractions</option>
                    <option value="support">Group Planning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
            </div>

            <div className="animate-slide-up-delay" style={{animationDelay: '0.5s'}}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="query">
                Message
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 bg-white/50 resize-none h-32"
                id="query"
                name="query"
                placeholder="Tell us how we can help you..."
                value={formData.query}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="animate-slide-up-delay" style={{animationDelay: '0.6s'}}>
                <button
                    type="submit"
                    className="w-full py-3.5 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                    Send Message
                </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block w-2/5 relative overflow-hidden">
          <img
            src="https://plus.unsplash.com/premium_photo-1673623135721-a0ea3caff642?w=900&auto=format&fit=crop&q=60"
            alt="Beautiful Horizon"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/90 to-transparent flex flex-col justify-end p-10 text-white">
            <div className="relative z-10 animate-slide-in-right">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="w-12 h-12 object-contain animate-float"
                  />
                  <span className="text-2xl font-bold tracking-wide">
                    Chasing Horizons
                  </span>
                </div>
                <p className="opacity-90 leading-relaxed drop-shadow-md">
                    "The journey of a thousand miles begins with a single step. Let us help you take yours."
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inbox Modal */}
      {showInbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="bg-[#003366] p-6 flex justify-between items-center text-white sticky top-0">
              <h3 className="font-bold text-xl flex items-center gap-2">📥 My Inbox</h3>
              <button onClick={() => setShowInbox(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loadingQueries ? (
                <div className="flex justify-center p-8">
                   <div className="w-10 h-10 border-4 border-blue-100 border-t-[#003366] rounded-full animate-spin"></div>
                </div>
              ) : myQueries.length > 0 ? (
                myQueries.map((q) => (
                  <div key={q._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-[#003366] text-xs font-bold rounded-lg">{q.reason}</span>
                        <span className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm font-medium text-gray-800 mb-3">"{q.query}"</p>
                     
                     {q.reply ? (
                       <div className="bg-white p-3 rounded-lg border border-green-100 shadow-sm relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                          <p className="text-xs font-bold text-green-600 mb-1">Admin Reply:</p>
                          <p className="text-sm text-gray-700">{q.reply}</p>
                       </div>
                     ) : (
                       <p className="text-xs text-gray-400 italic">No reply yet...</p>
                     )}
                  </div>
                ))
              ) : (
                 <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p>No queries found.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
}

export default Contact;
