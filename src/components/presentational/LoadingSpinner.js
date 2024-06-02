import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground } from 'react-native';
import colors from '../../utils/globals/colors';


const LoadingSpinner = ({message}) => {
  return (
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={styles.overlay}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.text}>{message}</Text>
      </View>
    </ImageBackground>
  );
}

export default LoadingSpinner

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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