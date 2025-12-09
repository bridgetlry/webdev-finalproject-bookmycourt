import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export const Rules: React.FC = () => {
  const rules = [
    "Leave the court in better condition than you found it.",
    "No food or drinks (except water) on the courts.",
    "Wear appropriate court shoes to avoid damaging the surface.",
    "Respect other players and stick to your booked timeslot.",
    "Follow all posted signs and guidelines."
  ];

  return (
    <div className="rules-container">
      <h2>Court Rules</h2>
      <p className="rules-intro">
        We all love clean, safe courts! Please adhere to the following rules while using any of our courts:
      </p>

      <ul className="rules-list">
        {rules.map((rule, index) => (
          <li key={index} className="rule-item">
            <FaCheckCircle className="rule-icon" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>

      <p className="rules-footer">
        For additional questions or to report issues, please send us a message.
      </p>
    </div>
  );
};