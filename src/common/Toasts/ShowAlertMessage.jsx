import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from "react-icons/fa";

const ShowAlertMessage = ({ message, visible, setVisible }) => {
  const [progress, setProgress] = useState(0); // Start at 0%

  useEffect(() => {
    if (visible) {
      const totalDuration = 3000; // Total duration in ms (3 seconds for demo)
      const interval = 100; // Interval to update progress bar
      const progressStep = (interval / totalDuration) * 100; // Progress step for each interval

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setVisible(false);
            return 100;
          }
          return prev + progressStep;
        });
      }, interval);

      return () => clearInterval(timer); // Clean up interval on unmount
    }
  }, [visible]);

  return (
    <div className={`hello fixed top-[70px] right-4 ${visible ? 'slide-in' : 'slide-out'}`} style={{minWidth : '300px'}}>
      <div className="w-[auto] relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg text-white px-4 py-5 shadow-lg" role="alert">
          <div className="flex items-center gap-4">
            <div className="text-[30px] flex items-center justify-center text-white">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="text-sm">Alert! {message}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-white" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ShowAlertMessage;
