import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: 'demo',
    query: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.query) {
      alert("Please fill in all fields");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    
    alert("Thank you! We'll contact you within 2 hours.");
    setFormData({
      name: '',
      email: '',
      phone: '',
      reason: 'demo',
      query: ''
    });
  };

  // Input focus styles
  const inputStyle = {
    width: '100%',
    padding: '8px 0',
    border: 'none',
    borderBottom: '2px solid #ccc',
    fontSize: '16px',
    color: '#333',
    outline: 'none',
    backgroundColor: 'transparent'
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        {/* Contact Form Section */}
        <div style={styles.contactForm}>
          <h2 style={styles.formTitle}>Chat to our team</h2>
          <p style={styles.formDescription}>
            Need help with something? Want a demo? Get in touch
            with our friendly team and we'll get in touch within 2
            hours.
          </p>
          
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="name">Name</label>
              <input
                style={inputStyle}
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #007bff'}
                onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Work email</label>
              <input
                style={inputStyle}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your work email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #007bff'}
                onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="phone">Mobile number (+91)</label>
              <input
                style={inputStyle}
                type="tel"
                id="phone"
                name="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #007bff'}
                onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reason">Reason for contact</label>
              <select 
                style={inputStyle}
                id="reason" 
                name="reason" 
                value={formData.reason}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #007bff'}
                onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                required
              >
                <option value="demo">Booking Inquiries</option>
                <option value="technical">Special Requests or Accommodations</option>
                <option value="pricing">Information on Local Attractions and Activities</option>
                <option value="support">Group or Event Planning</option>
                <option value="other">Other (please specify)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="query">Query</label>
              <textarea
                style={{...inputStyle, height: '60px', resize: 'vertical'}}
                id="query"
                name="query"
                placeholder="Tell us how we can help you..."
                value={formData.query}
                onChange={handleInputChange}
                onFocus={(e) => e.target.style.borderBottom = '2px solid #007bff'}
                onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                required
              />
            </div>

            <div style={styles.buttonContainer}>
              <button 
                type="submit" 
                style={styles.submitButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Get in touch
              </button>
              <button 
                type="button"
                style={styles.homeButton}
                onClick={() => window.location.href = '/'}
              >
                Home
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div style={styles.imageSection}>
          <img
            src="https://plus.unsplash.com/premium_photo-1673624398371-61b45f45167c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9yaXpvbnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Beautiful Horizon"
            style={styles.image}
          />
          <div style={styles.overlay}>
            <div style={styles.headerContent}>
              <div style={styles.logo}>
                <div style={styles.logoPlaceholder}>CH</div>
              </div>
              <div style={styles.title}>Chasing Horizons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '"Helvetica", sans-serif',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f9'
  },
  mainContainer: {
    display: 'flex',
    width: '90%',
    maxWidth: '1200px',
    minHeight: '600px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  contactForm: {
    background: 'white',
    padding: '40px',
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  formTitle: {
    fontSize: '24px',
    color: '#333',
    marginTop: 0,
    marginBottom: '10px'
  },
  formDescription: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px'
  },
  form: {
    width: '100%'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#333',
    marginBottom: '5px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px'
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  homeButton: {
    color: 'gray',
    backgroundColor: 'white',
    textDecoration: 'underline',
    border: 'none',
    padding: '12px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  imageSection: {
    position: 'relative',
    width: '40%'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1))'
  },
  headerContent: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    marginRight: '15px'
  },
  logoPlaceholder: {
    width: '50px',
    height: '50px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  title: {
    fontSize: '20px',
    color: 'white',
    fontWeight: 'bold'
  }
};

export default Contact;