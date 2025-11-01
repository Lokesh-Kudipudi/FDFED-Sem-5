import React, { useState } from "react";
import toast from "react-hot-toast";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Name Validation
    if (formData.name.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    if (formData.name.length < 2) {
      toast.error("Name must be at least 2 characters long");
      return;
    }

    if (formData.name.length > 60) {
      toast.error("Name cannot exceed 60 characters");
      return;
    }

    if (/^\d/.test(formData.name)) {
      toast.error("Name should not start with a number");
      return;
    }

    if (/[^a-zA-Z\s]/.test(formData.name)) {
      toast.error(
        "Name should contain only alphabets and spaces"
      );
      return;
    }

    // Email Validation
    if (formData.email.trim() === "") {
      toast.error("Email cannot be empty");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    // Mobile Number Validation
    if (formData.phone.trim() === "") {
      toast.error("Phone cannot be empty");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    // Address Validation
    if (formData.address.trim() === "") {
      toast.error("Address cannot be empty");
      return;
    }

    if (formData.address.length < 5) {
      toast.error("Address must be at least 5 characters long");
      return;
    }

    // Password Validation
    if (formData.password.trim() === "") {
      toast.error("Password cannot be empty");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    // Send request
    try {
      const response = await fetch(
        "http://localhost:5500/signUp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone,
            address: formData.address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Sign-up failed");
        return;
      }

      toast.success(
        "User signed up successfully! Redirecting to Home Page."
      );
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Network error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
      }}
    >
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Enter your 10-digit phone number"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Enter your address"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
