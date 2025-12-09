import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I book a court?",
      answer: "Go to the homepage and click the 'Book My Court' button. You'll be able to see available time slots and make a reservation."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes! You can cancel up to 24 hours before your booking time for a full refund. Go to your Account to view/edit all current bookings"
    },
    {
      question: "Do you offer group bookings?",
      answer: "Yes, please contact us for group rates and special event bookings."
    },
    {
      question: "How do I register my own court for rentals?",
      answer: "Court Owners may add new courts for rental on their Account page"
    },
    {
      question: "Do you provide equipment rentals?",
      answer: "No, you are required to bring your own equipment."
    },
    {
      question: "Can I leave a review of a court?",
      answer: "Yes, please do! Courts are rated by users and we encourage you to tell others about your experience on the court."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  //Click on question and answer will open below
  return (
    <div>
      <h2>Frequently Asked Questions</h2>
      
      {faqs.map((faq, index) => (
        <div key={index} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <div 
            onClick={() => toggleFAQ(index)} //Opens answer section onClick
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {faq.question}
          </div>
          
          {openIndex === index && (
            <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};