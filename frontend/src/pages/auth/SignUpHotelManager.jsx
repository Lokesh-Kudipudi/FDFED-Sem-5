import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const SignUpHotelManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signUpHotelManager } = useAuth();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    // Name Validation
    if (formData.name.trim() === "") {
      toast.error("Name cannot be empty");
      document.getElementById("name").focus();
      return false;
    }

    if (formData.name.length < 2) {
      toast.error("Name must be at least 2 characters long");
      document.getElementById("name").focus();
      return false;
    }

    if (formData.name.length > 60) {
      toast.error("Name cannot exceed 60 characters");
      document.getElementById("name").focus();
      return false;
    }

    if (/^\d/.test(formData.name)) {
      toast.error("Name should not start with a number");
      document.getElementById("name").focus();
      return false;
    }

    if (/[^a-zA-Z\s]/.test(formData.name)) {
      toast.error("Name should contain only alphabets and spaces");
      document.getElementById("name").focus();
      return false;
    }

    // Email Validation
    if (formData.email.trim() === "") {
      toast.error("Email cannot be empty");
      document.getElementById("email").focus();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      document.getElementById("email").focus();
      return false;
    }

    // Mobile Number Validation
    if (formData.phone.trim() === "") {
      toast.error("Phone cannot be empty");
      document.getElementById("phone").focus();
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      document.getElementById("phone").focus();
      return false;
    }

    // Address Validation
    if (formData.address.trim() === "") {
      toast.error("Address cannot be empty");
      document.getElementById("address").focus();
      return false;
    }

    if (formData.address.length < 5) {
      toast.error("Address must be at least 5 characters long");
      document.getElementById("address").focus();
      return false;
    }

    // Password Validation
    if (formData.password.trim() === "") {
      toast.error("Password cannot be empty");
      document.getElementById("password").focus();
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      document.getElementById("password").focus();
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      document.getElementById("password").focus();
      return false;
    }

    return true;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    await signUpHotelManager(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative py-4 px-4"
      style={{
        backgroundImage:
          "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

      <div className="flex w-full max-w-[1000px] bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl z-10 animate-slide-up h-[580px]">
        {/* Left Side - Image */}
        <div 
          className="hidden md:flex w-5/12 relative overflow-hidden bg-cover bg-center items-center justify-center p-6"
          style={{
            backgroundImage:
              "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <h2 className="text-white text-4xl font-bold drop-shadow-lg text-center relative z-10 leading-tight">
            ENJOY THE WORLD
          </h2>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 py-6 px-8 flex flex-col justify-center bg-white relative">
          {/* Logo */}
          <div
            className="flex items-center justify-center mb-4 gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img className="w-8 h-8" src="/images/logo.png" alt="Logo" />
            <span className="text-lg font-bold text-[#003366]">
              Chasing Horizons
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Create Account - Hotel Manager
            </h2>
            <p className="text-gray-500 mt-1 text-xs">
              Fill in your details to get started.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="address"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-1 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300 mt-2 text-sm"
            >
              Start Your Journey
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-3 text-gray-400 text-xs">
              OR
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Links */}
          <div className="text-center flex flex-col gap-1 text-xs text-gray-600">
            <span>
              Already have an account?{" "}
              <Link
                to="/auth/signIn"
                className="text-[#0066cc] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </span>
            <div className="flex justify-center gap-2 mt-0.5">
              <Link
                to="/auth/signup"
                className="text-gray-500 hover:text-[#003366] transition-colors text-xs"
              >
                Sign Up as User
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/auth/signup-tour-guide"
                className="text-gray-500 hover:text-[#003366] transition-colors text-xs"
              >
                Join as Tour Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpHotelManager;
