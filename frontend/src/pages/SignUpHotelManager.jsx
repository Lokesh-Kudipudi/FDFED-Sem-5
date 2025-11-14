import React, { useState } from 'react';

const SignUpHotelManager = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (formData.name.trim() === "") {
      newErrors.name = "Name cannot be empty";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (formData.name.length > 60) {
      newErrors.name = "Name cannot exceed 60 characters";
    } else if (/^\d/.test(formData.name)) {
      newErrors.name = "Name should not start with a number";
    } else if (/[^a-zA-Z\s]/.test(formData.name)) {
      newErrors.name = "Name should contain only alphabets and spaces";
    }

    // Email Validation
    if (formData.email.trim() === "") {
      newErrors.email = "Email cannot be empty";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    // Mobile Number Validation
    if (formData.phone.trim() === "") {
      newErrors.phone = "Phone cannot be empty";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Address Validation
    if (formData.address.trim() === "") {
      newErrors.address = "Address cannot be empty";
    } else if (formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters long";
    }

    // Password Validation
    if (formData.password.trim() === "") {
      newErrors.password = "Password cannot be empty";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      if (firstError) {
        alert(firstError);
      }
      setIsSubmitting(false);
      return;
    }

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
        alert(data.message || "Sign-up failed");
        return;
      }

      alert("User signed up successfully! Redirecting to Home Page.");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      alert(err.message || "Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  // All CSS as inline styles
  const styles = {
    global: {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
    },
    body: {
      background: 'url("https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg") no-repeat center center/cover',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      display: 'flex',
      width: '1100px',
      background: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
    },
    left: {
      width: '50%',
      background: 'url("https://www.tripsavvy.com/thmb/gDYDVvjwO5oQxcE_x4lfmqOdLQ8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-545247233-5bb7e6a146e0fb0026919fb4.jpg") no-repeat center center/cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    leftH2: {
      color: 'white',
      fontSize: '32px',
      textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
    },
    right: {
      flex: 1,
      backgroundColor: '#003366',
      padding: '20px 40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: 'white',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '30px',
      gap: '12px',
      cursor: 'pointer',
    },
    logoImg: {
      height: '40px',
      width: '40px',
    },
    logoSpan: {
      fontSize: '18px',
      fontWeight: '600',
    },
    formTitle: {
      marginBottom: '20px',
      fontSize: '22px',
    },
    formRow: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    formGroup: {
      marginBottom: '20px',
      position: 'relative',
      width: '100%',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '5px',
      border: 'none',
      fontSize: '15px',
    },
    inputError: {
      width: '100%',
      padding: '12px',
      borderRadius: '5px',
      border: '2px solid #ff6b6b',
      fontSize: '15px',
    },
    errorMessage: {
      color: '#ff6b6b',
      fontSize: '12px',
      marginTop: '5px',
      display: 'block',
    },
    continueBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease',
    },
    continueBtnDisabled: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#cccccc',
      color: '#666666',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'not-allowed',
      marginTop: '10px',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
      color: '#a0c0e0',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#a0c0e0',
    },
    dividerSpan: {
      padding: '0 10px',
      fontSize: '14px',
    },
    loginToggle: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      marginTop: '15px',
      fontSize: '14px',
      color: '#a0c0e0',
    },
    loginLink: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: '600',
      marginLeft: '5px',
    },
  };

  return (
    <div style={styles.global}>
      <div style={styles.body}>
        <div style={styles.container}>
          <div style={styles.left}>
            <h2 style={styles.leftH2}>ENJOY THE WORLD</h2>
          </div>
          <div style={styles.right}>
            <div style={styles.logo} onClick={handleLogoClick}>
              <img
                src="/images/tours/logo.png"
                alt="Logo"
                style={styles.logoImg}
              />
              <span style={styles.logoSpan}>Chasing Horizons</span>
            </div>

            <h2 style={styles.formTitle}>
              Create Account - Hotel Manager
            </h2>

            <form onSubmit={handleSignUp}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={errors.name ? styles.inputError : styles.input}
                  />
                  {errors.name && (
                    <div style={styles.errorMessage}>{errors.name}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={errors.email ? styles.inputError : styles.input}
                  />
                  {errors.email && (
                    <div style={styles.errorMessage}>{errors.email}</div>
                  )}
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.label}>Mobile Number</label>
                  <input
                    type="text"
                    id="phone"
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={errors.phone ? styles.inputError : styles.input}
                  />
                  {errors.phone && (
                    <div style={styles.errorMessage}>{errors.phone}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="password" style={styles.label}>Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={errors.password ? styles.inputError : styles.input}
                  />
                  {errors.password && (
                    <div style={styles.errorMessage}>{errors.password}</div>
                  )}
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="address" style={styles.label}>Address</label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={errors.address ? styles.inputError : styles.input}
                  />
                  {errors.address && (
                    <div style={styles.errorMessage}>{errors.address}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                style={isSubmitting ? styles.continueBtnDisabled : styles.continueBtn}
                disabled={isSubmitting}
                onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = '#0055aa')}
                onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = '#0066cc')}
              >
                {isSubmitting ? 'Signing Up...' : 'Continue'}
              </button>
            </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerSpan}>or</span>
              <div style={styles.dividerLine}></div>
            </div>

            <div style={styles.loginToggle}>
              <span>
                Already have an account?
                <a href="/signIn" style={styles.loginLink}>Sign In</a>
              </span>
              <span>
                Not a Hotel Manager?
                <a href="/signUp" style={styles.loginLink}>Sign Up as User</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpHotelManager;