import React, { useState, useEffect } from "react";

// Add CSS styles (same pattern as your SignIn)
const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
body {
  background: url("https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg")
    no-repeat center center/cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  display: flex;
  width: 1100px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
}
.left {
  width: 50%;
  background: url("https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg")
    no-repeat center center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.left h2 {
  color: white;
  font-size: 32px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}
.right {
  flex: 1;
  background-color: #003366;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 12px;
  cursor: pointer;
}

.logo img {
  height: 40px;
  width: 40px;
}

.logo span {
  font-size: 18px;
  font-weight: 600;
}

.form-title {
  margin-bottom: 20px;
  font-size: 22px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: none;
  font-size: 15px;
}

.password-hint {
  font-size: 12px;
  margin-top: 5px;
  color: #a0c0e0;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 5px;
  display: none;
}

.continue-btn {
  width: 100%;
  padding: 12px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.continue-btn:hover {
  background-color: #0055aa;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #a0c0e0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #a0c0e0;
}

.divider span {
  padding: 0 10px;
  font-size: 14px;
}

.google-btn {
  width: 100%;
  padding: 12px;
  background-color: white;
  color: #333;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.google-btn:hover {
  background-color: #f0f0f0;
}

.google-btn svg {
  margin-right: 10px;
}

.login-toggle {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 15px;
  font-size: 14px;
  color: #a0c0e0;
}

.login-toggle a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}
`;

/**
 * Displays a toast notification with the specified message and type
 * @param {string} message - The message to display in the toast
 * @param {string} type - The type of toast: 'success', 'error', 'warning', or 'info'
 */
function showToast(message, type = "info") {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";

    // Style the container
    Object.assign(toastContainer.style, {
      position: "fixed",
      right: "20px",
      top: "20px",
      zIndex: "1000",
    });

    document.body.appendChild(toastContainer);
  }

  // Create the toast element
  const toast = document.createElement("div");

  // Set background color based on type
  let backgroundColor;
  switch (type.toLowerCase()) {
    case "success":
      backgroundColor = "#4CAF50"; // Green
      break;
    case "error":
      backgroundColor = "#F44336"; // Red
      break;
    case "warning":
      backgroundColor = "#FF9800"; // Orange
      break;
    case "info":
    default:
      backgroundColor = "#2196F3"; // Blue
      break;
  }

  // Style the toast
  Object.assign(toast.style, {
    backgroundColor: backgroundColor,
    color: "white",
    padding: "16px",
    borderRadius: "4px",
    marginTop: "10px",
    minWidth: "250px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    opacity: "0",
    transition: "opacity 0.3s ease-in-out",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

  // Add message text
  const messageText = document.createElement("span");
  messageText.textContent = message;
  toast.appendChild(messageText);

  // Add close button
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "×";
  Object.assign(closeBtn.style, {
    cursor: "pointer",
    marginLeft: "10px",
    fontSize: "20px",
    fontWeight: "bold",
  });

  closeBtn.onclick = function () {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  };

  toast.appendChild(closeBtn);

  // Add toast to container
  toastContainer.appendChild(toast);

  // Trigger CSS transition by setting opacity after a small delay
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10);

  // Auto remove after 2 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2000);

  return toast;
}

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });

  // Add CSS to head (same as your SignIn)
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Name Validation
    if (formData.name.trim() === "") {
      showToast("Name cannot be empty", "error");
      document.getElementById("name").focus();
      return;
    }

    if (formData.name.length < 2) {
      showToast("Name must be at least 2 characters long", "error");
      document.getElementById("name").focus();
      return;
    }

    if (formData.name.length > 60) {
      showToast("Name cannot exceed 60 characters", "error");
      document.getElementById("name").focus();
      return;
    }

    if (/^\d/.test(formData.name)) {
      showToast("Name should not start with a number", "error");
      document.getElementById("name").focus();
      return;
    }

    if (/[^a-zA-Z\s]/.test(formData.name)) {
      showToast("Name should contain only alphabets and spaces", "error");
      document.getElementById("name").focus();
      return;
    }

    // Email Validation
    if (formData.email.trim() === "") {
      showToast("Email cannot be empty", "error");
      document.getElementById("email").focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Invalid email format", "error");
      document.getElementById("email").focus();
      return;
    }

    // Mobile Number Validation
    if (formData.phone.trim() === "") {
      showToast("Phone cannot be empty", "error");
      document.getElementById("phone").focus();
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showToast("Phone number must be exactly 10 digits", "error");
      document.getElementById("phone").focus();
      return;
    }

    // Address Validation
    if (formData.address.trim() === "") {
      showToast("Address cannot be empty", "error");
      document.getElementById("address").focus();
      return;
    }

    if (formData.address.length < 5) {
      showToast("Address must be at least 5 characters long", "error");
      document.getElementById("address").focus();
      return;
    }

    // Password Validation
    if (formData.password.trim() === "") {
      showToast("Password cannot be empty", "error");
      document.getElementById("password").focus();
      return;
    }

    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      document.getElementById("password").focus();
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showToast(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "error"
      );
      document.getElementById("password").focus();
      return;
    }

    // Send request
    try {
      const response = await fetch("/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone,
          address: formData.address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Sign-up failed", "error");
        return;
      }

      showToast("User signed up successfully! Redirecting to Home Page.", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      showToast(err.message || "Network error", "error");
    }
  };

  return (
    <div className="container">
      <div className="left">
        <h2>ENJOY THE WORLD</h2>
      </div>
      <div className="right">
        <div className="logo" onClick={() => window.location.href = "/"}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#003366', fontWeight: 'bold' }}>CH</span>
          </div>
          <span>Chasing Horizons</span>
        </div>

        <h2 className="form-title">Create Account</h2>

        <form onSubmit={handleSignUp}>
          <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <input
                type="text"
                id="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="password-hint">
                Must include 8+ chars, upper, lower, number, and symbol.
              </div>
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                placeholder="102-6-124"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="login-toggle">
          <span>Already have an account? <a href="/signIn">Sign In</a></span>
          <span>Want to list your property? <a href="/signUpHotelManager">Sign Up as Hotel Manager</a></span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;