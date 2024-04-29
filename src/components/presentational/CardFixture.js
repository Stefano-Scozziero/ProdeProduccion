import { StyleSheet, Text,  View } from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../utils/globals/colors'
import React from 'react'

const Encuentro = React.memo(({ encuentro }) => (
  <View style={styles.encuentroContainer}>
    <View style={styles.teamContainer}>
      <FastImage style={styles.teamImage} source={{ uri: encuentro.equipo1.imagen }} />
      <Text style={styles.teamName}>{encuentro.equipo1.nombre}</Text>
    </View>

    <View style={styles.scoreContainer}>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>{encuentro.equipo1.puntos}</Text>
      </View>
      <Text style={styles.versusText}>-</Text>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>{encuentro.equipo2.puntos}</Text>
      </View>
    </View>

    <View style={styles.teamContainer}>
      <Text style={styles.teamName}>{encuentro.equipo2.nombre}</Text>
      <FastImage style={styles.teamImage} source={{ uri: encuentro.equipo2.imagen }} />
    </View>
  </View>
));

class CardFixture extends React.PureComponent {
  render() {
    const { partidos } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.dateText}>{`Fecha N°${partidos.fecha}`}</Text>
        {partidos.encuentros.map((encuentro) => (
          <Encuentro key={encuentro.id} encuentro={encuentro} />
        ))}
      </View>
    )
  }
}

export default CardFixture;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.blackGray,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 10
  },
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginVertical: 2.5,
    width: '100%',
    position: 'relative', // Agrega esta línea
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamImage: {
    width: 20,
    height: 20,
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
  },
  scoreBox: {
    width: 15,
    height: 30,
    backgroundColor: colors.orange,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  versusText: {
    fontSize: 14,
    color: colors.white,
    marginHorizontal: 5,
  },
});