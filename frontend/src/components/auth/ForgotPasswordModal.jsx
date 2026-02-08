import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PropTypes from 'prop-types';
import { API } from "../../config/api";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // OTP Timer Effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
        setForgotStep(1);
        setForgotEmail("");
        setOtpValue("");
        setNewPassword("");
        setConfirmPassword("");
        setResetToken("");
        setOtpTimer(0);
    }
  }, [isOpen]);

  const formatOtpTimer = () => {
    const minutes = Math.floor(otpTimer / 60);
    const seconds = otpTimer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Step 1: Request OTP
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      toast.error("Invalid email format");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API.AUTH.FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        setForgotStep(2);
        setOtpTimer(300); // 5 minutes
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API.AUTH.VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP verified!");
        setResetToken(data.resetToken);
        setForgotStep(3);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both passwords");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API.AUTH.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully!");
        onClose();
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Error resetting password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003366] to-[#001a33] px-6 py-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
          <p className="text-blue-100">
            Step {forgotStep} of 3
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Email */}
          {forgotStep === 1 && (
            <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all"
                />
              </div>
              <p className="text-sm text-gray-600">
                We'll send a One-Time Password (OTP) to this email address.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP */}
          {forgotStep === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all font-mono"
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-900 font-semibold">
                  Time Remaining: {formatOtpTimer()}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  OTP expires in 5 minutes
                </p>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Enter the 6-digit code sent to {forgotEmail}
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep(1);
                    setOtpValue("");
                    setOtpTimer(0);
                  }}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otpValue.length !== 6}
                  className="flex-1 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {forgotStep === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

ForgotPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
