import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import colors from '../../utils/globals/colors';

const LoadingSpinner3 = ({ message }) => {
  return (
      <View style={styles.overlay}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
  );
};

export default LoadingSpinner3;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // fondo semi-transparente para difuminar el contenido
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // asegúrate de que esté por encima del contenido
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    textAlign: 'center',
    marginTop: 10,
  },
});
