import React, { createContext, useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const [portrait, setPortrait] = useState(true);

  useEffect(() => {
    setPortrait(width < height);
  }, [height, width]);

  return (
    <OrientationContext.Provider value={portrait}>
      {children}
    </OrientationContext.Provider>
  );
};
