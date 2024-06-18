import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../utils/globals/colors'
import { parseISO, format, differenceInHours } from 'date-fns'
import React from 'react'
import BallAnimation from './animation/BallAnimation'
import LineAnimation from './animation/LineAnimation'

const DatesByCategory = ({ encuentros, onSumarPuntos, onRestarPuntos, puntosEq1, puntosEq2 }) => {
  const fechaPartido = parseISO(encuentros.fecha);
  const ahora = new Date();
  const diferenciaHoras = differenceInHours(fechaPartido, ahora);

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, (encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying) ? styles.cardContainerDisable : null]}>
        {!encuentros.hasPlayed && !encuentros.isUpComing && !encuentros.isPlaying &&
          <View style={styles.containerResult}>
            <Text style={{ textAlign: 'center', color: colors.white, fontSize: 12, marginHorizontal: 5 }}>FECHA:</Text>
            <Text style={{ textAlign: 'left', color: colors.white, fontSize: 15 }}>{format(fechaPartido, 'yyyy-MM-dd HH:mm')}</Text>
          </View>
        }
        {!encuentros.hasPlayed && !encuentros.isUpComing && !encuentros.isPlaying && diferenciaHoras <= 3 && diferenciaHoras > 0 &&
          <View style={styles.containerResult}>
            <Text style={{ textAlign: 'center', color: colors.white, fontSize: 12, marginHorizontal: 5 }}>PROXIMAMENTE:</Text>
            <Text style={{ textAlign: 'left', color: colors.white, fontSize: 15 }}>{format(fechaPartido, 'yyyy-MM-dd HH:mm')}</Text>
          </View>
        }
        {encuentros.isUpComing && !encuentros.hasPlayed &&
          <View style={styles.containerResult}>
            <Image style={{ width: 20, height: 20 }} source={require('../../../assets/pelota.png')} />
            <Text style={{ textAlign: 'center', color: colors.white, fontSize: 12, marginHorizontal: 5 }}>POR COMENZAR:</Text>
            <Text style={{ textAlign: 'left', color: colors.white, fontSize: 15 }}>{format(fechaPartido, 'HH:mm')}</Text>
          </View>
        }
        {encuentros.isPlaying &&
          <View style={styles.containerResult}>
            <BallAnimation />
            <Text style={{ textAlign: 'center', color: colors.white, fontSize: 12, marginHorizontal: 5 }}>JUGANDO:</Text>
            <Text style={styles.scoreTextReal}>{encuentros.goles1}</Text>
            <LineAnimation />
            <Text style={styles.scoreTextReal}>{encuentros.goles2}</Text>
          </View>
        }
        {encuentros.hasPlayed &&
          <View style={styles.containerResult}>
            <Text style={{ textAlign: 'left', right: 15, color: colors.white, fontSize: 12 }}>{format(fechaPartido, 'yyyy-MM-dd HH:mm')}</Text>
            <Text style={{ color: colors.white, fontSize: 12 }}>RESULTADO:</Text>
            <Text style={styles.scoreTextReal}>{encuentros.goles1}</Text>
            <Text style={styles.scoreTextReal}>-</Text>
            <Text style={styles.scoreTextReal}>{encuentros.goles2}</Text>
          </View>
        }
        <View style={styles.encuentroContainer}>
          <View style={styles.containerMatch}>
            <View style={styles.teamContainer}>
              <FastImage style={styles.teamImage} source={{ uri: encuentros.equipo1.imagen }} resizeMode='contain' />
              <Text style={styles.teamName}>{encuentros.equipo1.nombre}</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBoxLeft}>
              <TouchableOpacity
                style={styles.buttonLeft}
                onPress={() => onSumarPuntos('equipo1')}
                disabled={encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying}
              >
                <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }, (encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying) ? { fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)' } : null]}>+</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.scoreText}> {puntosEq1 == undefined ? '-' : puntosEq1}</Text>
              <TouchableOpacity
                style={styles.buttonLeft}
                onPress={() => onRestarPuntos('equipo1')}
                disabled={encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying}
              >
                <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }, (encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying) ? { fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)' } : null]}>-</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.scoreBoxRight}>
              <TouchableOpacity
                style={styles.buttonRight}
                onPress={() => onSumarPuntos('equipo2')}
                disabled={encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying}
              >
                <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }, (encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying) ? { fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)' } : null]}>+</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.scoreText}> {puntosEq2 == undefined ? '-' : puntosEq2}</Text>
              <TouchableOpacity
                style={styles.buttonRight}
                onPress={() => onRestarPuntos('equipo2')}
                disabled={encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying}
              >
                <View style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }, (encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying) ? { fontSize: 25, textAlign: 'center', fontWeight: 'bold', color: 'rgba(128, 128, 128, 0.5)' } : null]}>-</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.containerMatch}>
            <View style={styles.teamContainer}>
              <FastImage style={styles.teamImage} source={{ uri: encuentros.equipo2.imagen }} resizeMode='contain' />
              <Text style={styles.teamName}>{encuentros.equipo2.nombre}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default DatesByCategory;

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
    backgroundColor: colors.blackGray,
    borderRadius: 20
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
    width: 80,
    height: 30,
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    top: 5
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
    color: colors.green,
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