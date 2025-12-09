import React, { useEffect, useState } from 'react';
import { Chatbot } from './Chatbot';
import { ContactForm } from './ContactForm';
import { FAQ } from './FAQ';
import { Rules } from './Rules';
import { GeminiService } from './services/GeminiClient';
import './Contact.css';

export const Contact: React.FC = () => {
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);

  useEffect(() => {
    // Initialize Gemini service with API key from .env
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    setGeminiService(new GeminiService(apiKey));
  }, []);

  if (!geminiService) {
    return (
      <div className="contact-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get Help</h1>
        <p>We're here to assist you with any questions or concerns</p>
      </div>

      <div className="contact-grid">
        {/* Chatbot */}
        <div className="contact-card chatbot-card">
          <Chatbot geminiService={geminiService} />
        </div>

        {/* Contact Form */}
        <div className="contact-card">
          <ContactForm />
        </div>

        {/* FAQ */}
        <div className="contact-card">
          <FAQ />
        </div>
      </div>

      {/* Rules of Courts (General) */}
      <div className="contact-rules-section">
        <Rules />
      </div>
    </div>
  );
};
