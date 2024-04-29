import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../utils/globals/colors'
import React from 'react'
import BallAnimation from './animation/BallAnimation';

const DatesByCategory = ({ encuentros, onSumarPuntos, onRestarPuntos, puntosEq1, puntosEq2 }) =>  {

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, encuentros.hasPlayed ? styles.cardContainerDisable : null]} >
          {encuentros.hasPlayed && 
            <View style = {styles.containerResult}>
            <Text>Resultado: </Text>
            <Text style={styles.scoreTextReal}>{encuentros.equipo1.puntos}</Text>
            <Text style={styles.scoreTextReal}>-</Text>
            <Text style={styles.scoreTextReal}>{encuentros.equipo2.puntos}</Text>
            </View>
          }
          {encuentros.isPlaying &&
            <View style = {styles.containerResult}>
              <BallAnimation />
              <Text style={{textAlign: 'center'}}> Jugando:</Text>
              <Text style={styles.scoreTextReal}>{encuentros.equipo1.puntos}</Text>
              <Text style={styles.scoreTextReal}>-</Text>
              <Text style={styles.scoreTextReal}>{encuentros.equipo2.puntos}</Text>
            </View>
          }
        <View style={styles.encuentroContainer} >
          <View style={styles.containerMatch}>
            <View style={styles.teamContainer}>
              <FastImage style={styles.teamImage} source={{ uri: encuentros.equipo1.imagen }} />
              <Text style={styles.teamName}>{encuentros.equipo1.nombre}</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBoxLeft}>
              
              <TouchableOpacity 
                style={styles.buttonLeft} 
                onPress={() => onSumarPuntos('equipo1')}
                disabled={encuentros.hasPlayed}
              >
                <Text style={[{fontSize: 17, fontWeight: 'bold'}, encuentros.hasPlayed ? {fontSize: 17, fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)'} : null]}>+</Text>
              </TouchableOpacity>
              <Text style={styles.scoreText}> {puntosEq1 == undefined ? '-' : puntosEq1}</Text>
              <TouchableOpacity 
                style={styles.buttonLeft} 
                onPress={() => onRestarPuntos('equipo1')}
                disabled={encuentros.hasPlayed} 
              >
                <Text style={[{fontSize: 17, fontWeight: 'bold'}, encuentros.hasPlayed ? {fontSize: 17, fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)'} : null]}>-</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.scoreBoxRight}>
              <TouchableOpacity 
                style={styles.buttonRight} 
                onPress={() => onSumarPuntos('equipo2')}
                disabled={encuentros.hasPlayed}
              >
                <Text style={[{fontSize: 17, fontWeight: 'bold'}, encuentros.hasPlayed ? {fontSize: 17, fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)'} : null]}>+</Text>
              </TouchableOpacity>
              <Text style={styles.scoreText}> {puntosEq2 == undefined ? '-' : puntosEq2}</Text>
              <TouchableOpacity 
                style={styles.buttonRight} 
                onPress={() => onRestarPuntos('equipo2')}
                disabled={encuentros.hasPlayed}
              >
                <Text style={[{fontSize: 17, fontWeight: 'bold'}, encuentros.hasPlayed ? {fontSize: 17, fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)'} : null]}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.containerMatch}>
            <View style={styles.teamContainer}>
              <FastImage style={styles.teamImage} source={{ uri: encuentros.equipo2.imagen }} />
              <Text style={styles.teamName}>{encuentros.equipo2.nombre}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DatesByCategory

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  containerResult: {
    width: '100%',
    flexDirection: 'row',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainerDisable:{
    width:'100%',
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Color de fondo de la tarjeta
    borderRadius: 10,
    padding: 10,
  },
  cardContainer: {
    width:'100%',
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blackGray, // Color de fondo de la tarjeta
    borderRadius: 10,
    padding: 10,
  },
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginVertical: 2.5,
    width: '100%',
    position: 'relative'
  },
  containerMatch: {
    width: 100,
    height: '100%'
  },

  teamContainer: {
    alignItems: 'center',
  },
  teamImage: {
    width: 60,
    height: 60
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute', // Agrega esta línea
    left: 0, // Agrega esta línea
    right: 0, // Agrega esta línea
  },
  teamName: {
    fontSize: 10,
    color: colors.white,
    textAlign: 'center'
  },
  scoreBoxLeft: {
    width: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
  },
  scoreBoxRight: {
    width: 25,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    left: 25
    
  },
  scoreText: {
    width: 25,
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center'
  },
  scoreTextReal: {
    width: 25,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  versusText: {
    fontSize: 14,
    color: colors.white, // Color del texto del vs
    marginHorizontal: 5,
  },
  buttonLeft: {
    width: 50,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'

  },
  buttonRight: {
    width: 50,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  }
})