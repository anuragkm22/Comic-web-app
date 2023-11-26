import React, { useState } from 'react';
import './Feedback.css';

function FeedbackForm({ onSubmit, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Feedback submitted: Name - ${name}, Email - ${email}, Feedback - ${feedback}`);
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setFeedback('');

    if (onSubmit) {
      onSubmit({ name, email, feedback });
    }
  };

  const handleBackClick = () => {
    // Ensure that onBack is a function before calling it
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  return (
    <div className="feedback-form">
      <h2>Feedback Form</h2>
      {isSubmitted ? (
        <div>
          <p>Thank you for your feedback!</p>
          <button onClick={handleBackClick}>Back</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Feedback:
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </label>
          <br />

          <button type="submit">Submit Feedback</button>
          <button type="button" onClick={handleBackClick}>Back</button>
        </form>
      )}
    </div>
  );
}

export default FeedbackForm;
