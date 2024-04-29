import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from '../../utils/globals/colors';

class Puntuacion extends React.Component {
  render() {
    const { puntos, sumarPuntos, restarPuntos } = this.props;
    return (
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <TouchableOpacity style={styles.button} onPress={sumarPuntos}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.scoreText}>{puntos}</Text>
          <TouchableOpacity style={styles.button} onPress={restarPuntos}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    );
  }
}

export default Puntuacion;

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute', // Agrega esta línea
    left: 0, // Agrega esta línea
    right: 0, // Agrega esta línea
  },
  scoreBox: {
    width: 15,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25
  },
  button: {
    width: 50,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});
