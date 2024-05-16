import React, { createContext, useContext, useEffect, useRef } from 'react';

const KeyboardContext = createContext(null);

export const KeyboardProvider = ({ children }: any) => {
  const keyMap = useRef<any>({});

  useEffect(() => {
    const onDocumentKey = (e: any) => {
      keyMap.current[e.code] = e.type === 'keydown';
    };
    document.addEventListener('keydown', onDocumentKey);
    document.addEventListener('keyup', onDocumentKey);
    return () => {
      document.removeEventListener('keydown', onDocumentKey);
      document.removeEventListener('keyup', onDocumentKey);
    };
  }, []);

  return (
    <KeyboardContext.Provider value={keyMap.current}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};