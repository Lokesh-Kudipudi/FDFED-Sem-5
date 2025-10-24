import React, { useState } from 'react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showToast = (message, type = "info") => {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = "toast-container";
      Object.assign(toastContainer.style, {
        position: "fixed",
        right: "20px",
        top: "20px",
        zIndex: "1000",
      });
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");

    let backgroundColor;
    switch (type.toLowerCase()) {
      case "success":
        backgroundColor = "#4CAF50";
        break;
      case "error":
        backgroundColor = "#F44336";
        break;
      case "warning":
        backgroundColor = "#FF9800";
        break;
      case "info":
      default:
        backgroundColor = "#2196F3";
        break;
    }

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

    const messageText = document.createElement("span");
    messageText.textContent = message;
    toast.appendChild(messageText);

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
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 2000);

    return toast;
  };

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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Sign In Page</h1>
      <form onSubmit={handleSignIn}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your email"
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your password"
          />
        </div>
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;