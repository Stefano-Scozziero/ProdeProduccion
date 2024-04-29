import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import colors from '../../../utils/globals/colors';
import fonts from '../../../utils/globals/fonts';

const ModalAlert = ({ text, duration = 4000, onClose }) => {

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '90%',
    height: 40,
    borderRadius:10,
    top: 0,
    left: 20,
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    backgroundColor: colors.green,
    zIndex: 9999, // Ajusta este valor según sea necesario para que el modal se superponga correctamente
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontFamily: fonts.robotoBold
  },
});

export default ModalAlert;
