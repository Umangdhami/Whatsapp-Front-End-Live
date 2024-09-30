// src/AlertProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import ShowAlertMessage from './ShowAlertMessage';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0); // Adding key to force remount

  const alert = (msg) => {
    setMessage(msg);
    setVisible(false); // First, hide the message if it's already visible
      setTimeout(() => {
        setVisible(true); // Then, show it after hiding
        setKey(prevKey => prevKey + 1); // Force component re-render by updating the key
    }, 100); // Delay for a smooth reset
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {/* Pass the unique key to force a re-render */}
      <ShowAlertMessage key={key} message={message} visible={visible} setVisible={setVisible} />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
