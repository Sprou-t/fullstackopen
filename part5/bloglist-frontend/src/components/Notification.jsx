// components/Notification.js
import React from 'react';

const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    border: 'solid',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  );
};

export default Notification;
