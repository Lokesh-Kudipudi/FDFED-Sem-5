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
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

      <div className="flex w-full max-w-[900px] h-[600px] bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl z-10 animate-slide-up ">
        {/* Left Side - Image & Greeting */}
        <div className="hidden md:flex w-1/2 relative flex-col items-center justify-center p-12 text-center overflow-hidden bg-gradient-to-br from-[#003366] to-[#001a33] text-white">
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute w-96 h-96 -top-20 -left-20 bg-[#004080] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
             <div className="absolute w-96 h-96 -bottom-20 -right-20 bg-[#00264d] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="relative z-10 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">Welcome Back!</h2>
            <p className="text-lg text-gray-300">
              Ready to explore? Sign in to continue your journey with us.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white relative">
          <div
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 flex items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          >
             <span className="text-sm font-medium text-gray-600">Back to Home</span>
          </div>

          <div className="mb-8 text-center md:text-left animate-slide-up">
            <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-10 w-10 animate-float"
              />
              <span className="text-xl font-bold text-[#003366]">
                Chasing Horizons
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-500 mt-2">Please enter your details.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6 animate-slide-up-delay">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all placeholder:text-gray-400"
              />
              <div className="flex justify-between items-center mt-2">
                 <div className="text-xs text-gray-500">Must be at least 8 characters</div>
                 <a href="#" className="text-xs text-[#0066cc] hover:underline">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-gray-600 animate-slide-up-delay" style={{animationDelay: '0.4s'}}>
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-[#0066cc] font-semibold hover:underline"
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
