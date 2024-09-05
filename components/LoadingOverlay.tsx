import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, ActivityIndicator } from 'react-native-paper';
import { useUIContext } from '../context/UIContext'; // Asegúrate de importar tu contexto correctamente

const LoadingOverlay = () => {
  const { isLoading } = useUIContext();

  return (
    <Portal>
      <Modal
        visible={isLoading}
        dismissable={false} // Evita que el modal se cierre al tocar fuera de él
        contentContainerStyle={styles.modal}
      >
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center', 
    width: '100%',
    height: '100%',
  },
});

export default LoadingOverlay;
