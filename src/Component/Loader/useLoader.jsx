import React, { createContext, useContext, useState } from 'react';
import Loader from './Loader'
// Create the Loader Context
const LoaderContext = createContext();

// Loader Provider component to wrap around the app
export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // Functions to trigger loading state
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, startLoading, stopLoading }}>
            {children}
            {loading && <GlobalLoader />} {/* Show Loader automatically when loading */}
        </LoaderContext.Provider>
    );
};

// Hook to access the Loader context
export const useLoader = () => {
    return useContext(LoaderContext);
};

// Global Loader Component (Optional, for auto-rendering)
const GlobalLoader = () => {
    return (
        <Loader />
    );
};
