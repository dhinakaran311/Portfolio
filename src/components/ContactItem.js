
import React from 'react';

const ContactItem = ({ icon, title, content }) => (
  <div className="contact-item">
    <div className="contact-icon">{icon}</div>
    <div className="contact-details">
      <h4>{title}</h4>
      <p>{content}</p>
    </div>
  </div>
);

export default ContactItem;
