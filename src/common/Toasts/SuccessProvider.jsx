// src/SuccessProvider.js
import React, { createContext, useState, useContext } from 'react';
import ShowSuccessMessage from './ShowSuccessMessage';

const SuccessContext = createContext();

export const SuccessProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0); // To force re-render on new success messages

  const success = (msg) => {
    setMessage(msg);
    setVisible(false); // First, hide the message if it's already visible
    setTimeout(() => {
      setVisible(true); // Then, show it after resetting the visibility
      setKey(prevKey => prevKey + 1); // Update key to force re-render
    }, 100); // Short delay to ensure the component resets properly
  };

  return (
    <SuccessContext.Provider value={{ success }}>
      {children}
      {/* Force re-render using a unique key */}
      <ShowSuccessMessage key={key} message={message} visible={visible} setVisible={setVisible} />
    </SuccessContext.Provider>
  );
};

export const useSuccess = () => {
  return useContext(SuccessContext);
};
