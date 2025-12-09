import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Show popup instead of actually sending email
    setShowAlert(true);

    // Clear form
    setName('');
    setEmail('');
    setMessage('');

    // Hide alert after 5 seconds
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <div className="contact-form-container">
      <h2>Send Us a Message</h2>

      {showAlert && (
        <div className="contact-success-alert">
          <strong>Message sent!</strong> We will respond soon. In the meantime, check out our FAQs or ask Sporty for additional help!
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            type="text"
            className="contact-input"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            type="email"
            className="contact-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            className="contact-textarea"
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
          />
        </div>

        <button type="submit" className="contact-submit-btn">
          <FaPaperPlane /> Send Message
        </button>
      </form>
    </div>
  );
};