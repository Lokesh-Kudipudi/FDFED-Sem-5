import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Name Validation
    if (formData.name.trim() === "") {
      toast.error("Name cannot be empty");
      document.getElementById("name").focus();
      return;
    }

    if (formData.name.length < 2) {
      toast.error("Name must be at least 2 characters long");
      document.getElementById("name").focus();
      return;
    }

    if (formData.name.length > 60) {
      toast.error("Name cannot exceed 60 characters");
      document.getElementById("name").focus();
      return;
    }

    if (/^\d/.test(formData.name)) {
      toast.error("Name should not start with a number");
      document.getElementById("name").focus();
      return;
    }

    if (/[^a-zA-Z\s]/.test(formData.name)) {
      toast.error(
        "Name should contain only alphabets and spaces"
      );
      document.getElementById("name").focus();
      return;
    }

    // Email Validation
    if (formData.email.trim() === "") {
      toast.error("Email cannot be empty");
      document.getElementById("email").focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      document.getElementById("email").focus();
      return;
    }

    // Mobile Number Validation
    if (formData.phone.trim() === "") {
      toast.error("Phone cannot be empty");
      document.getElementById("phone").focus();
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      document.getElementById("phone").focus();
      return;
    }

    // Address Validation
    if (formData.address.trim() === "") {
      toast.error("Address cannot be empty");
      document.getElementById("address").focus();
      return;
    }

    if (formData.address.length < 5) {
      toast.error("Address must be at least 5 characters long");
      document.getElementById("address").focus();
      return;
    }

    // Password Validation
    if (formData.password.trim() === "") {
      toast.error("Password cannot be empty");
      document.getElementById("password").focus();
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      document.getElementById("password").focus();
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      document.getElementById("password").focus();
      return;
    }

    await signUp(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
      }}
    >
      <div className="flex w-[1100px] bg-white rounded-xl overflow-hidden shadow-2xl">
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat flex items-center justify-center p-5"
          style={{
            backgroundImage:
              "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
          }}
        >
          <h2 className="text-white text-4xl drop-shadow-lg">
            ENJOY THE WORLD
          </h2>
        </div>
        <div className="flex-1 bg-[#003366] py-5 px-10 flex flex-col justify-center text-white">
          <div
            className="flex items-center justify-center mb-8 gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              className="w-10 h-10"
              src="/images/logo.png"
              alt="Logo"
            />
            <span className="text-lg font-semibold">
              Chasing Horizons
            </span>
          </div>

          <h2 className="mb-5 text-2xl">Create Account</h2>

          <form onSubmit={handleSignUp}>
            <div className="flex gap-2.5 justify-between">
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
                  className="w-full p-3 rounded-md border-none text-base "
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
                  className="w-full p-3 rounded-md border-none text-base "
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-between">
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
                  className="w-full p-3 rounded-md border-none text-base "
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
                  className="w-full p-3 rounded-md border-none text-base"
                />
              </div>
            </div>

            <div className="flex">
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
                  placeholder="102-6-124"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-md border-none text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-[#0066cc] text-white border-none rounded-md text-base font-semibold cursor-pointer mt-2 transition-colors duration-300 hover:bg-[#0055aa]"
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
              Already have an account?{" "}
              <Link
                to="/auth/signIn"
                className="text-white no-underline font-semibold"
              >
                Sign In
              </Link>
            </span>
            <span>
              Want to list your property?{" "}
              <Link
                to="/auth/signup-hotel-manager"
                className="text-white no-underline font-semibold"
              >
                Sign Up as Hotel Manager
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
