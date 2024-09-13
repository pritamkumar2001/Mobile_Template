// src/context/AppContext.js
import React, { createContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
const AppProvider = ({ children }) => {
  const [state, setState] = useState("datass");

  return (
    <AppContext.Provider value={{ state }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };