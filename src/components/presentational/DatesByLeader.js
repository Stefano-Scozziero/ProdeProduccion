import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../utils/globals/colors'

const { width } = Dimensions.get('window')

const DatesByLeader = ({ posiciones, index }) => {
  const containerStyle = [styles.container]
  if (index > 4 && index <= 12) {
    containerStyle.push(styles.containerMiddle)
  } else if (index <= 4) {
    containerStyle.push(styles.containerTop)
  } else {
    containerStyle.push(styles.containerBottom)
  }

  return (
    <View style={containerStyle}>
      <Text style={styles.index}>{index}</Text>
      <FastImage source={{ uri: posiciones.imagen }} style={styles.image} resizeMode='contain' />
      <Text style={styles.name}>{posiciones.nombre}</Text>
      <Text style={styles.points}>{posiciones.puntos}</Text>
      <Text style={styles.games}>{posiciones.partidosJugados}</Text>
      <Text style={styles.wins}>{posiciones.partidosGanados}</Text>
      <Text style={styles.draws}>{posiciones.partidosEmpatados}</Text>
      <Text style={styles.losses}>{posiciones.partidosPerdidos}</Text>
      <Text style={styles.gf}>{posiciones.golesFavor}</Text>
      <Text style={styles.gc}>{posiciones.golesContra}</Text>
      <Text style={styles.dg}>{posiciones.diferenciaGoles}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    alignItems: 'center',
  },
  containerTop: {
    backgroundColor: 'rgba(0, 255, 0, 0.7)',
  },
  containerMiddle: {
    backgroundColor: 'rgba(255, 255, 0, 0.7)',
  },
  containerBottom: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  index: {
    width: width * 0.08,  
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  image: {
    width: width * 0.08,  
    height: width * 0.08, 
    marginHorizontal: 5,
  },
  name: {
    flex: 1,
    fontSize: 9,
    textAlign: 'left',
  },
  points: {
    width: width * 0.08, 
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  games: {
    width: width * 0.08, 
    fontSize: 12,
    textAlign: 'center',
  },
  wins: {
    width: width * 0.08,  
    fontSize: 12,
    textAlign: 'center',
  },
  draws: {
    width: width * 0.08, 
    fontSize: 12,
    textAlign: 'center',
  },
  losses: {
    width: width * 0.08, 
    fontSize: 12,
    textAlign: 'center',
  },
  gf: {
    width: width * 0.08, 
    fontSize: 12,
    textAlign: 'center',
  },
  gc: {
    width: width * 0.08,
    fontSize: 12,
    textAlign: 'center',
  },
  dg: {
    width: width * 0.08,
    fontSize: 12,
    textAlign: 'center',
  },
})

export default DatesByLeader
