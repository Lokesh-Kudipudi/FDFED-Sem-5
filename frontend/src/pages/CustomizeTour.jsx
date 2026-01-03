import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaMapMarkerAlt, FaHotel, FaCalendarAlt, FaMoneyBillWave, FaCheck, FaArrowLeft, FaArrowRight, FaPlus, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const CustomizeTour = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    places: [],
    hotelType: "mid-range",
    hotelPreferences: "",
    additionalRequirements: "",
    budget: "",
    startDate: "",
    endDate: "",
    numPeople: 1,
  });
  
  const [currentPlace, setCurrentPlace] = useState("");

  const handleNext = () => {
    if (step === 1 && (!formData.title || !formData.startDate || !formData.endDate)) {
      toast.error("Please fill all basic details");
      return;
    }
    if (step === 2 && formData.places.length === 0) {
      toast.error("Please add at least one place");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const addPlace = () => {
    if (currentPlace.trim()) {
      setFormData({ ...formData, places: [...formData.places, currentPlace] });
      setCurrentPlace("");
      toast.success("Place added!");
    }
  };

  const removePlace = (index) => {
    setFormData({
      ...formData,
      places: formData.places.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formData.budget) {
      toast.error("Please enter your budget");
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/api/custom-tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          places: formData.places,
          hotelRequirements: {
            type: formData.hotelType,
            preferences: formData.hotelPreferences,
          },
          additionalRequirements: formData.additionalRequirements,
          budget: Number(formData.budget),
          travelDates: {
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
          numPeople: formData.numPeople,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        toast.success("Request submitted! Admin will assign a tour guide soon.");
        navigate("/my-custom-requests");
      } else {
        toast.error(data.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit request. Please make sure you're logged in and the server is running.");
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: FaCalendarAlt },
    { number: 2, title: "Places", icon: FaMapMarkerAlt },
    { number: 3, title: "Hotels", icon: FaHotel },
    { number: 4, title: "Final Details", icon: FaMoneyBillWave },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-28 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-[#003366] mb-4">
            Customize Your Dream Tour
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tell us your preferences and our admin will assign the perfect tour guide for your journey
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-12 relative max-w-3xl mx-auto">
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          <div
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#003366] to-[#0055aa] -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-lg ${
                  step >= s.number
                    ? "bg-gradient-to-br from-[#003366] to-[#0055aa] text-white scale-110"
                    : "bg-white text-gray-400 border-2 border-gray-300"
                }`}
              >
                <s.icon size={22} />
              </div>
              <span className={`text-sm mt-3 font-semibold ${step >= s.number ? "text-[#003366]" : "text-gray-400"} hidden sm:block`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100" style={{ animation: "slideUp 0.4s ease-out" }}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#003366]">Basic Information</h3>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Tour Title *</label>
                <input
                  type="text"
                  placeholder="e.g., My Dream Rajasthan Adventure"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Start Date *</label>
                  <input
                    type="date"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">End Date *</label>
                  <input
                    type="date"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Number of Travelers *</label>
                <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, numPeople: Math.max(1, formData.numPeople - 1) })}
                    className="w-14 h-14 bg-white border-2 border-gray-300 hover:border-[#003366] hover:bg-[#003366] hover:text-white rounded-xl font-bold text-2xl transition-all shadow-sm"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-4xl font-bold text-[#003366]">{formData.numPeople}</div>
                    <div className="text-sm text-gray-500 mt-1">{formData.numPeople === 1 ? "Person" : "People"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, numPeople: Math.min(20, formData.numPeople + 1) })}
                    className="w-14 h-14 bg-white border-2 border-gray-300 hover:border-[#003366] hover:bg-[#003366] hover:text-white rounded-xl font-bold text-2xl transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Places */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#003366]">Places to Visit</h3>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter destination name..."
                  className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                  value={currentPlace}
                  onChange={(e) => setCurrentPlace(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPlace()}
                />
                <button
                  type="button"
                  onClick={addPlace}
                  className="px-6 py-4 bg-gradient-to-r from-[#003366] to-[#0055aa] hover:from-[#002244] hover:to-[#003366] text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaPlus /> Add
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {formData.places.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 group hover:border-[#003366] transition-all"
                    style={{ animation: `fadeIn 0.3s ease-out ${index * 0.1}s backwards` }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center shrink-0">
                        <FaMapMarkerAlt className="text-white" size={18} />
                      </div>
                      <span className="font-semibold text-gray-800">{place}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlace(index)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>

              {formData.places.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <FaMapMarkerAlt className="text-gray-300 text-5xl mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No destinations added yet</p>
                  <p className="text-gray-400 text-sm mt-2">Start adding your dream destinations above!</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Hotels */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center">
                  <FaHotel className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#003366]">Hotel Requirements</h3>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Select Hotel Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: "budget", label: "Budget", desc: "Affordable & Comfortable" },
                    { type: "mid-range", label: "Mid-Range", desc: "Quality & Value" },
                    { type: "luxury", label: "Luxury", desc: "Premium Experience" }
                  ].map(({ type, label, desc }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, hotelType: type })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.hotelType === type
                          ? "border-[#003366] bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg"
                          : "border-gray-200 hover:border-blue-300 bg-white"
                      }`}
                    >
                      <FaHotel
                        className={`mb-3 mx-auto text-4xl ${
                          formData.hotelType === type ? "text-[#003366]" : "text-gray-400"
                        }`}
                      />
                      <div className="font-bold text-lg mb-1">{label}</div>
                      <div className="text-sm text-gray-500">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Additional Preferences (Optional)</label>
                <textarea
                  placeholder="e.g., Pool, Gym, Breakfast included, Near city center..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows="5"
                  value={formData.hotelPreferences}
                  onChange={(e) => setFormData({ ...formData, hotelPreferences: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 4: Final Details */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#003366] rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#003366]">Final Details</h3>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Your Budget (INR) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="50,000"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Additional Requirements (Optional)</label>
                <textarea
                  placeholder="Any special requirements, dietary restrictions, accessibility needs..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#003366] focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows="6"
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                />
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-[#003366] to-[#0055aa] p-6 rounded-2xl text-white shadow-xl">
                <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <FaCheck className="bg-white text-[#003366] rounded-full p-1" size={24} />
                  Tour Summary
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Tour Title</div>
                    <div className="font-semibold">{formData.title || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Travel Dates</div>
                    <div className="font-semibold">
                      {formData.startDate && formData.endDate 
                        ? `${formData.startDate} to ${formData.endDate}` 
                        : "Not set"}
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Travelers</div>
                    <div className="font-semibold">{formData.numPeople} {formData.numPeople === 1 ? "Person" : "People"}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Destinations</div>
                    <div className="font-semibold">{formData.places.length} Places</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Hotel Type</div>
                    <div className="font-semibold capitalize">{formData.hotelType}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Budget</div>
                    <div className="font-semibold text-xl">₹{formData.budget ? Number(formData.budget).toLocaleString() : "0"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-100">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
              >
                <FaArrowLeft /> Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#003366] to-[#0055aa] hover:from-[#002244] hover:to-[#003366] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Next <FaArrowRight />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="ml-auto flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                <FaCheck size={20} /> Submit Request
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomizeTour;
