import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUpTourGuide = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signUpTourGuide } = useAuth(); // We need to add this to useAuth

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
      toast.error(
        "Name should contain only alphabets and spaces"
      );
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80')",
      }}
    >
      <div className="flex w-[1100px] bg-white rounded-xl overflow-hidden shadow-2xl">
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat flex items-center justify-center p-5"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80')",
          }}
        >
          <h2 className="text-white text-4xl drop-shadow-lg">
            GUIDE THE WORLD
          </h2>
        </div>
        <div className="flex-1 bg-[#003366] py-5 px-10 flex flex-col justify-center text-white">
          <div
            className="flex items-center justify-center mb-8 gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-10 w-10"
            />
            <span className="text-lg font-semibold">
              Chasing Horizons
            </span>
          </div>

          <h2 className="mb-5 text-2xl">
            Create Account - Tour Guide
          </h2>

          <form onSubmit={handleSignUp}>
            <div className="flex gap-2.5 justify-between mb-2.5">
              <div className="mb-5 relative w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md text-base  border-none"
                />
              </div>

              <div className="mb-5 relative w-full">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md text-base  border-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-between mb-2.5">
              <div className="mb-5 relative w-full">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md text-base border-none"
                />
              </div>

              <div className="mb-5 relative w-full">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md text-base border-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-between mb-2.5">
              <div className="mb-5 relative w-full">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md text-base border-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-3 border-none rounded-md text-base font-semibold mt-2 transition-colors duration-300 bg-[#0066cc] text-white cursor-pointer hover:bg-[#0055aa]"
            >
              Continue
            </button>
          </form>

          <div className="flex items-center my-5 text-[#a0c0e0]">
            <div className="flex-1 h-px bg-[#a0c0e0]"></div>
            <span className="px-2.5 text-sm">or</span>
            <div className="flex-1 h-px bg-[#a0c0e0]"></div>
          </div>

          <div className="text-center flex flex-col gap-1 mt-4 text-sm text-[#a0c0e0]">
            <span>
              Already have an account?
              <Link
                to="/auth/signIn"
                className="text-white no-underline font-semibold ml-1"
              >
                Sign In
              </Link>
            </span>
            <span>
              Not a Tour Guide?
              <Link
                to="/auth/signUp"
                className="text-white no-underline font-semibold ml-1"
              >
                Sign Up as User
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpTourGuide;
