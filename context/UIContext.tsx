import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definición del tipo de contexto
interface UIContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Creación del contexto con valores por defecto
const UIContext = createContext<UIContextType>({
  isLoading: false,
  setLoading: () => {},
});

// Proveedor del contexto
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <UIContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </UIContext.Provider>
  );
};

// Hook para usar el contexto
export const useUIContext = () => useContext(UIContext);