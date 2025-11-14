import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
      alert("Please fill in all fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
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
        `There was an error submitting the form. Please try again later.
        ${error.message}
        `
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

  return (
    <div className="font-sans m-0 p-0 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-[90%] max-w-[1200px] min-h-[600px] shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Contact Form Section */}
        <div className="bg-white p-10 w-3/5 flex flex-col justify-center">
          <h2 className="text-2xl text-gray-800 mt-0 mb-2.5">
            Chat to our team
          </h2>
          <p className="text-base text-gray-600 mb-7">
            Need help with something? Want a demo? Get in touch
            with our friendly team and we'll get in touch within
            2 hours.
          </p>

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                className="block text-sm text-gray-800 mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full py-2 border-none border-b-2 border-gray-300 text-base text-gray-800 outline-none bg-transparent focus:border-blue-600"
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-5">
              <label
                className="block text-sm text-gray-800 mb-1"
                htmlFor="email"
              >
                Work email
              </label>
              <input
                className="w-full py-2 border-none border-b-2 border-gray-300 text-base text-gray-800 outline-none bg-transparent focus:border-blue-600"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your work email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-5">
              <label
                className="block text-sm text-gray-800 mb-1"
                htmlFor="phone"
              >
                Mobile number (+91)
              </label>
              <input
                className="w-full py-2 border-none border-b-2 border-gray-300 text-base text-gray-800 outline-none bg-transparent focus:border-blue-600"
                type="tel"
                id="phone"
                name="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-5">
              <label
                className="block text-sm text-gray-800 mb-1"
                htmlFor="reason"
              >
                Reason for contact
              </label>
              <select
                className="w-full py-2 border-none border-b-2 border-gray-300 text-base text-gray-800 outline-none bg-transparent focus:border-blue-600"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
              >
                <option value="demo">Booking Inquiries</option>
                <option value="technical">
                  Special Requests or Accommodations
                </option>
                <option value="pricing">
                  Information on Local Attractions and Activities
                </option>
                <option value="support">
                  Group or Event Planning
                </option>
                <option value="other">
                  Other (please specify)
                </option>
              </select>
            </div>

            <div className="mb-5">
              <label
                className="block text-sm text-gray-800 mb-1"
                htmlFor="query"
              >
                Query
              </label>
              <textarea
                className="w-full py-2 border-none border-b-2 border-gray-300 text-base text-gray-800 outline-none bg-transparent h-[60px] resize-y focus:border-blue-600"
                id="query"
                name="query"
                placeholder="Tell us how we can help you..."
                value={formData.query}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex justify-between w-full mt-5">
              <button
                type="submit"
                className="bg-blue-600 text-white border-none py-3 px-5 rounded cursor-pointer text-base transition-colors duration-300 hover:bg-blue-700"
              >
                Get in touch
              </button>
              <button
                type="button"
                className="text-gray-500 bg-white underline border-none py-3 px-5 text-base cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="relative w-2/5">
          <img
            src="https://plus.unsplash.com/premium_photo-1673623135721-a0ea3caff642?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9yaXpvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Beautiful Horizon"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-black/10">
            <div className="absolute top-5 left-5 flex items-center">
              <div className="mr-4">
                <img
                  src="/images/logo.png"
                  alt="ogo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-xl text-white font-bold">
                Chasing Horizons
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
