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
  icons = [], // Arreglo opcional para manejar varios iconos
  children // Contenido personalizado opcional
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
          {/* Mostrar iconos si se pasan */}
          <View style={styles.iconContainer}>
            {icons.map((icon, index) => (
              <View key={index} style={styles.iconWrapper}>
                {icon}
              </View>
            ))}
          </View>

          {/* Mostrar texto si se pasa */}
          {text && <Text style={styles.text}>{text}</Text>}

          {/* Contenido personalizado */}
          {children}

          {/* Mostrar botón principal si se pasa el texto */}
          {primaryButtonText && (
            <TouchableOpacity onPress={onPrimaryAction} style={styles.button}>
              <Text style={styles.buttonText}>{primaryButtonText}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
    padding: 30,
    gap: 20,
    borderRadius: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.robotoBold,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: colors.orange,
    fontFamily: fonts.robotoBold,
    textAlign: 'center',
  },
});
