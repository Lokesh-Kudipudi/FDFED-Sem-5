import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

// Add CSS styles
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
  width: 800px;
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
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.logo {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
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

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  // Add CSS to head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email) {
      return showToast("Please enter email", "error");
    }

    if (!password) {
      return showToast("Please enter password", "error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Invalid email format", "error");
      return;
    }

    try {
      const response = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        showToast(
          "User signed in successfully, Redirecting to Home Page.",
          "success"
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="container">
      <div className="left">
        <h2>Welcome Back</h2>
      </div>
      <div className="right">
        <div className="logo">
          <span>Chasing Horizons</span>
        </div>
        
        <h2 className="form-title">Sign In</h2>
        
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <div className="password-hint">
              Must be at least 8 characters
            </div>
          </div>
          
          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <button className="google-btn">
          Continue with Google
        </button>
        
        <div className="login-toggle">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;