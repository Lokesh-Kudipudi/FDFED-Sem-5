import { useState } from "react";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter email");
    }

    if (!password) {
      return toast.error("Please enter password");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    await login(email, password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
      }}
    >
      <div className="flex w-[800px] bg-white rounded-xl overflow-hidden shadow-2xl">
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat flex items-center justify-center p-5"
          style={{
            backgroundImage:
              "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
          }}
        >
          <h2 className="text-white text-4xl drop-shadow-lg">
            Welcome Back
          </h2>
        </div>
        <div className="flex-1 bg-[#003366] p-10 flex flex-col justify-center text-white">
          <div
            onClick={() => navigate("/")}
            className="flex gap-3 items-center justify-center mb-8 cursor-pointer"
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

          <h2 className="mb-5 text-2xl">Sign In</h2>

          <form onSubmit={handleSignIn}>
            <div className="mb-5 relative">
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 rounded-md border-none text-base text-white"
              />
            </div>

            <div className="mb-5 relative">
              <label className="block mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 rounded-md border-none text-base text-white"
              />
              <div className="text-xs mt-1 text-[#a0c0e0]">
                Must be at least 8 characters
              </div>
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-[#0066cc] text-white border-none rounded-md text-base font-semibold cursor-pointer mt-2 transition-colors duration-300 hover:bg-[#0055aa]"
            >
              Continue
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-[#a0c0e0]">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-white no-underline font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
