import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Snackbar } from 'react-native-paper';

interface UIContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  snackbarVisible: boolean;
  snackbarMessage: string;
  snackbarType: 'success' | 'error';
  showSuccessSnackbar: (message: string) => void;
  showErrorSnackbar: (message: string) => void;
  hideSnackbar: () => void;
}

const UIContext = createContext<UIContextType>({
  isLoading: false,
  setLoading: () => {},
  snackbarVisible: false,
  snackbarMessage: '',
  snackbarType: 'success',
  showSuccessSnackbar: () => {},
  showErrorSnackbar: () => {},
  hideSnackbar: () => {},
});

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const showSuccessSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarType('success');
    setSnackbarVisible(true);
  };

  const showErrorSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarType('error');
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <UIContext.Provider value={{ isLoading, setLoading, snackbarVisible, snackbarMessage, snackbarType, showSuccessSnackbar, showErrorSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={hideSnackbar}
        duration={3000}
        action={{
          label: snackbarType === 'success' ? 'Success' : 'Error',
          icon: snackbarType === 'success' ? 'check-circle' : 'alert-circle',
          onPress: () => {
            hideSnackbar();
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </UIContext.Provider>
  );
};

// Hook para usar el contexto
export const useUIContext = () => useContext(UIContext);