import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import '../css/main.css';
import '../css/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentName: '',
    targetClass: 'Class 1',
    subject: 'admission',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setStatus({ type: 'error', msg: 'Please fill all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      await addDoc(collection(db, 'contactSubmissions'), {
        ...formData,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-IN')
      });

      setShowModal(true);
      setFormData({
        name: '',
        phone: '',
        studentName: '',
        targetClass: 'Class 1',
        subject: 'admission',
        message: ''
      });
      setLoading(false);
      setTimeout(() => setShowModal(false), 6000);
    } catch (err) {
      console.error(err);
      setLoading(false);
      if (err.code === 'permission-denied') {
        setStatus({ type: 'error', msg: 'Database connection in progress. Please call us directly for immediate help.' });
      } else {
        setStatus({ type: 'error', msg: 'Error submitting message: ' + err.message });
      }
    }
  };

  return (
    <section className="contact-section">
      {/* Top Hero Section */}
      <div className="contact-hero">
        <div className="container">
          <div className="contact-hero-badge">
            <i className="fas fa-headset"></i>
            <span>Admissions & Inquiries • Session 2026-27</span>
          </div>
          <h1 className="contact-hero-title">
            Get In Touch With <span className="highlight-text">Shree Jagdamba</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have questions about admissions, school transport, or academic curriculum? Our administration is here to assist you every step of the way.
          </p>
        </div>
      </div>

      <div className="container">
        {/* 4 Fast-Action Cards */}
        <div className="contact-quick-cards-grid">
          <a href="tel:+919828869462" className="contact-quick-card phone-card">
            <div className="quick-card-icon">
              <i className="fas fa-phone-volume"></i>
            </div>
            <div className="quick-card-info">
              <span className="quick-card-label">Director Desk</span>
              <h3 className="quick-card-val">+91 98288 69462</h3>
              <span className="quick-card-action">Tap to Call Directly <i className="fas fa-arrow-right"></i></span>
            </div>
          </a>

          <a
            href="https://wa.me/919828869462?text=Hello%20Shree%20Jagdamba%20School,%20I%20have%20an%20inquiry%20regarding%20admission."
            target="_blank"
            rel="noopener noreferrer"
            className="contact-quick-card whatsapp-card"
          >
            <div className="quick-card-icon whatsapp-icon">
              <i className="fab fa-whatsapp"></i>
            </div>
            <div className="quick-card-info">
              <span className="quick-card-label">Instant WhatsApp</span>
              <h3 className="quick-card-val">+91 98288 69462</h3>
              <span className="quick-card-action">Chat on WhatsApp <i className="fas fa-arrow-right"></i></span>
            </div>
          </a>

          <a href="mailto:shreejagadamba.educationhub@gmail.com" className="contact-quick-card email-card">
            <div className="quick-card-icon email-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <div className="quick-card-info">
              <span className="quick-card-label">Official Email</span>
              <h3 className="quick-card-val email-text">shreejagadamba.educationhub@gmail.com</h3>
              <span className="quick-card-action">Send an Email <i className="fas fa-arrow-right"></i></span>
            </div>
          </a>

          <a
            href="https://maps.google.com/?q=Shree+Jagadamba+Sr.+Sec.+School+Dhadheru+Churu"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-quick-card location-card"
          >
            <div className="quick-card-icon map-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <div className="quick-card-info">
              <span className="quick-card-label">Campus Location</span>
              <h3 className="quick-card-val">Dhadheru, Bidasar, Churu</h3>
              <span className="quick-card-action">Open in Google Maps <i className="fas fa-arrow-right"></i></span>
            </div>
          </a>
        </div>

        {/* 2-Column Main Section: Form & Campus Information */}
        <div className="contact-main-layout">
          {/* Left Column: Inquiry Form */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="form-card-header">
              <div className="form-title-badge">
                <i className="fas fa-paper-plane"></i>
                <span>Direct Message</span>
              </div>
              <h2 className="form-card-title">Send Us An Inquiry</h2>
              <p className="form-card-desc">Fill in the details below and our team will get in touch with you within 24 hours.</p>
            </div>

            {status.msg && (
              <div className={`form-status-alert ${status.type}`}>
                <i className={status.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'}></i>
                <span>{status.msg}</span>
              </div>
            )}

            <form className="contact-light-form" onSubmit={handleSubmit}>
              <div className="form-row-2col">
                <div className="contact-form-group">
                  <label htmlFor="name">Parent / Guardian Name <span className="req-star">*</span></label>
                  <div className="input-icon-wrap">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="phone">Mobile / WhatsApp Number <span className="req-star">*</span></label>
                  <div className="input-icon-wrap">
                    <i className="fas fa-phone-alt"></i>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="e.g. 98288 69462"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row-2col">
                <div className="contact-form-group">
                  <label htmlFor="studentName">Student Name (Optional)</label>
                  <div className="input-icon-wrap">
                    <i className="fas fa-user-graduate"></i>
                    <input
                      type="text"
                      id="studentName"
                      name="studentName"
                      placeholder="Student full name"
                      value={formData.studentName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="targetClass">Interested Class</label>
                  <div className="input-icon-wrap">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <select
                      id="targetClass"
                      name="targetClass"
                      value={formData.targetClass}
                      onChange={handleChange}
                    >
                      <option value="Playgroup / Nursery">Playgroup / Nursery</option>
                      <option value="LKG / UKG">LKG / UKG</option>
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Higher Classes">Higher Classes (6th to 12th)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Inquiry Subject <span className="req-star">*</span></label>
                <div className="input-icon-wrap">
                  <i className="fas fa-tag"></i>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="admission">New Admission Inquiry (Session 2026-27)</option>
                    <option value="transport">Bus & Transportation Facility</option>
                    <option value="fee">Fee Structure & Scholarship</option>
                    <option value="academic">Academic & Curriculum Query</option>
                    <option value="other">General Feedback / Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Detailed Message / Question <span className="req-star">*</span></label>
                <div className="input-icon-wrap textarea-wrap">
                  <i className="fas fa-comment-dots"></i>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    placeholder="Write your questions or message here..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="contact-submit-btn"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Campus Details & Interactive Map */}
          <motion.div
            className="contact-sidebar-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Campus Highlights Card */}
            <div className="sidebar-card campus-hours-card">
              <div className="sidebar-card-header">
                <div className="sidebar-icon-pill">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h3 className="sidebar-card-title">School & Office Timings</h3>
                  <span className="sidebar-card-sub">Working Days: Monday to Saturday</span>
                </div>
              </div>

              <div className="timings-list">
                <div className="timing-item">
                  <span className="timing-label">School Classes:</span>
                  <strong className="timing-val">7:30 AM – 1:00 PM</strong>
                </div>
                <div className="timing-item">
                  <span className="timing-label">Office & Admissions:</span>
                  <strong className="timing-val">8:00 AM – 1:00 PM</strong>
                </div>
                <div className="timing-item">
                  <span className="timing-label">Sunday:</span>
                  <strong className="timing-val holiday">Closed (Holiday)</strong>
                </div>
              </div>
            </div>

            {/* Key Personnel Card */}
            <div className="sidebar-card contacts-list-card">
              <div className="sidebar-card-header">
                <div className="sidebar-icon-pill">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <h3 className="sidebar-card-title">Administrative Contacts</h3>
                  <span className="sidebar-card-sub">Direct assistance for parents</span>
                </div>
              </div>

              <div className="personnel-list">
                <div className="personnel-item">
                  <div className="personnel-avatar">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="personnel-info">
                    <strong>Gopal Krishan Bhamu</strong>
                    <span>School Director</span>
                    <a href="tel:+919828869462" className="personnel-tel">
                      <i className="fas fa-phone-alt"></i> +91 98288 69462
                    </a>
                  </div>
                </div>

                <div className="personnel-item">
                  <div className="personnel-avatar">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <div className="personnel-info">
                    <strong>Rakesh Jangir</strong>
                    <span>Principal Desk (Academic & Exams)</span>
                    <a href="tel:+919784394907" className="personnel-tel">
                      <i className="fas fa-phone-alt"></i> +91 97843 94907
                    </a>
                  </div>
                </div>

                <div className="personnel-item">
                  <div className="personnel-avatar">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <div className="personnel-info">
                    <strong>Sarla Devi</strong>
                    <span>Management Director</span>
                    <a href="tel:+919828641091" className="personnel-tel">
                      <i className="fas fa-phone-alt"></i> +91 98286 41091
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="sidebar-card map-embed-card">
              <div className="map-card-header">
                <div className="sidebar-icon-pill">
                  <i className="fas fa-map-pin"></i>
                </div>
                <div>
                  <h3 className="sidebar-card-title">Campus on Google Maps</h3>
                  <span className="sidebar-card-sub">Dhadheru Bhambhuwan, Churu, RJ 331802</span>
                </div>
              </div>

              <div className="map-iframe-container">
                <iframe
                  title="Shree Jagdamba School Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3524.0704375928135!2d74.33991197547645!3d27.96112897603812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3914dbcd93d0fd83%3A0x71a2c85322dbb15e!2sShree%20Jagadamba%20Sr.%20Sec.%20School!5e0!3m2!1sen!2sin!4v1784641004331!5m2!1sen!2sin"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>

              <div className="map-card-footer">
                <a
                  href="https://maps.google.com/?q=Shree+Jagadamba+Sr.+Sec.+School+Dhadheru+Churu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-direction-btn"
                >
                  <i className="fas fa-directions"></i>
                  <span>Get Driving Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Light Theme Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="contact-success-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="contact-success-modal-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-success-icon-wrap">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="modal-title">Inquiry Submitted Successfully!</h3>
              <p className="modal-description">
                Thank you for reaching out to <strong>Shree Jagdamba Convent School</strong>. Our admissions officer has received your details and will call you back shortly.
              </p>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
