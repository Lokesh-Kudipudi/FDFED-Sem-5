import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ChangePassword.css";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = {};
    
    if (password.length < 8) {
      errors.length = "Password must be at least 8 characters long";
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = "Password must contain at least one uppercase letter";
    }
    
    if (!/[a-z]/.test(password)) {
      errors.lowercase = "Password must contain at least one lowercase letter";
    }
    
    if (!/[0-9]/.test(password)) {
      errors.digit = "Password must contain at least one digit";
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.special = "Password must contain at least one special character";
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate new password in real-time
    if (name === "newPassword") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors({});
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    // Validate password strength
    const errors = validatePassword(formData.newPassword);
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      toast.error("Password does not meet the requirements");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5500/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordErrors(errors);
        // Redirect to dashboard or profile after 2 seconds
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h1 className="change-password-title">Change Password</h1>
        <p className="change-password-subtitle">Update your account password</p>

        <form onSubmit={handleSubmit} className="change-password-form">
          {/* Current Password */}
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={passwordVisibility.currentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="form-input"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="password-toggle-button"
                disabled={loading}
              >
                {passwordVisibility.currentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={passwordVisibility.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="form-input"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="password-toggle-button"
                disabled={loading}
              >
                {passwordVisibility.newPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Strength Indicators */}
            {formData.newPassword && (
              <div className="password-requirements">
                <p className="requirements-title">Password Requirements:</p>
                <ul className="requirements-list">
                  <li className={formData.newPassword.length >= 8 ? "met" : "unmet"}>
                    <span className="requirement-icon">✓</span> At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? "met" : "unmet"}>
                    <span className="requirement-icon">✓</span> One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.newPassword) ? "met" : "unmet"}>
                    <span className="requirement-icon">✓</span> One lowercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.newPassword) ? "met" : "unmet"}>
                    <span className="requirement-icon">✓</span> One number
                  </li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword) ? "met" : "unmet"}>
                    <span className="requirement-icon">✓</span> One special character
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={`form-input ${
                  formData.confirmPassword && formData.newPassword === formData.confirmPassword
                    ? "valid"
                    : formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                    ? "invalid"
                    : ""
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="password-toggle-button"
                disabled={loading}
              >
                {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="error-message">Passwords do not match</p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p className="success-message">✓ Passwords match</p>
            )}
          </div>

          {/* Button Group */}
          <div className="button-group">
            <button
              type="submit"
              className="submit-button"
              disabled={loading || Object.keys(passwordErrors).length > 0}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
