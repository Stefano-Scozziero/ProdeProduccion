import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import colors from '../../../utils/globals/colors';
import fonts from '../../../utils/globals/fonts';

const CustomModal = ({
  text,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  modalVisible,
  onClose,
  animationType = 'fade',
  children
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>

          {text && <Text style={styles.text}>{text}</Text>}

          {children}

          {/* Mostrar botón principal si se pasa el texto */}
          {primaryButtonText && (
            <TouchableOpacity onPress={onPrimaryAction} style={styles.button}>
              <Text style={styles.buttonTextPrimary}>{primaryButtonText}</Text>
            </TouchableOpacity>
          )}

          {/* Mostrar botón secundario si se pasa el texto */}
          {secondaryButtonText && (
            <TouchableOpacity onPress={onSecondaryAction || onClose} style={styles.buttonSecondary}>
              <Text style={styles.buttonText}>{secondaryButtonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo más suave para mayor legibilidad
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%', // Ancho un poco mayor
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white, // Fondo blanco o más suave
    padding: 30,
    gap: 20,
    borderRadius: 15, // Bordes más redondeados
    shadowColor: '#000', // Sombra suave para darle profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  text: {
    width: '100%',
    fontSize: 22, // Tamaño de fuente un poco mayor
    color: colors.black, // Un color más contrastante para el texto
    fontFamily: fonts.robotoBold,
    textAlign: 'left', // Centramos el texto
    marginBottom: 10, // Espacio entre el texto y el resto de los elementos
  },
  button: {
    backgroundColor: colors.red,
    padding: 12, // Botones más grandes
    borderRadius: 8, // Bordes más redondeados en los botones
    marginTop: 15,
    width: '80%', // Botones más anchos
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    width: '80%',
    borderColor: colors.orange, // Añadimos borde para mayor visibilidad
    borderWidth: 2,
  },
  buttonText: {
    color: colors.orange,
    fontFamily: fonts.robotoBold,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonTextPrimary: {
    color: colors.white,
    fontFamily: fonts.robotoBold,
    textAlign: 'center',
    fontSize: 16,
  },
});
