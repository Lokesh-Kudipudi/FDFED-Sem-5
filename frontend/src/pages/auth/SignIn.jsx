import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import DemoAccountModal from "../../components/auth/DemoAccountModal";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

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
    <AuthLayout backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80">
      <AuthCard 
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        imageAlt="Cliff landscape at Beachy Head"
        className="h-[600px] max-w-[900px]"
      >
        <AuthHeader title="Sign In" subtitle="Please enter your details." />

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
                <button 
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#0066cc] hover:underline"
                >
                  Forgot password?
                </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#003366] hover:bg-[#002244] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In
          </button>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowDemoModal(true)}
              className="w-full py-2.5 border-2 border-[#003366]/20 text-[#003366] font-medium rounded-lg hover:bg-[#003366]/5 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Use Demo Account
            </button>
          </div>
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
      </AuthCard>

      <DemoAccountModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
        onLogin={login} 
      />

      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </AuthLayout>
  );
}

export default SignIn;
