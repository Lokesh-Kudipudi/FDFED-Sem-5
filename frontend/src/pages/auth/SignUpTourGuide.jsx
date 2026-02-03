import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";

const SignUpTourGuide = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signUpTourGuide } = useAuth();

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

    await signUpTourGuide(formData);
  };

  return (
    <AuthLayout backgroundImage="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80">
      <AuthCard
        imageSrc="https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80"
        imageAlt="Guide the World"
        className="h-[580px] max-w-[1000px]"
        imageClassName="object-cover"
      >
        <AuthHeader
          title="Create Account - Tour Guide"
          subtitle="Fill in your details to get started."
        />

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
              to="/auth/signup-hotel-manager"
              className="text-gray-500 hover:text-[#003366] transition-colors text-xs"
            >
              Join as Hotel Manager
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignUpTourGuide;
