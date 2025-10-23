import React, { useState } from 'react';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Name Validation
    if (formData.name.trim() === "") {
      showToast("Name cannot be empty", "error");
      return;
    }

    if (formData.name.length < 2) {
      showToast("Name must be at least 2 characters long", "error");
      return;
    }

    if (formData.name.length > 60) {
      showToast("Name cannot exceed 60 characters", "error");
      return;
    }

    if (/^\d/.test(formData.name)) {
      showToast("Name should not start with a number", "error");
      return;
    }

    if (/[^a-zA-Z\s]/.test(formData.name)) {
      showToast("Name should contain only alphabets and spaces", "error");
      return;
    }

    // Email Validation
    if (formData.email.trim() === "") {
      showToast("Email cannot be empty", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    // Mobile Number Validation
    if (formData.phone.trim() === "") {
      showToast("Phone cannot be empty", "error");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      showToast("Phone number must be exactly 10 digits", "error");
      return;
    }

    // Address Validation
    if (formData.address.trim() === "") {
      showToast("Address cannot be empty", "error");
      return;
    }

    if (formData.address.length < 5) {
      showToast("Address must be at least 5 characters long", "error");
      return;
    }

    // Password Validation
    if (formData.password.trim() === "") {
      showToast("Password cannot be empty", "error");
      return;
    }

    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showToast(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        "error"
      );
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

      showToast(
        "User signed up successfully! Redirecting to Home Page.",
        "success"
      );
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      showToast(err.message || "Network error", "error");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your full name"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your email"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your 10-digit phone number"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            placeholder="Enter your address"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;