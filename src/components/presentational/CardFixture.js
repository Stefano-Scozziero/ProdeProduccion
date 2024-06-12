import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../utils/globals/colors';
import React from 'react';

const CardFixture = React.memo(({ encuentro }) => {
  return (
    <View style={styles.encuentroContainer}>
      <View style={styles.teamContainer}>
        <FastImage style={styles.teamImage} source={{ uri: encuentro.equipo1.imagen }} resizeMode='contain' />
        <Text style={styles.teamName}>{encuentro.equipo1.nombre}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{encuentro.goles1}</Text>
        </View>
        <Text style={styles.versusText}>-</Text>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>{encuentro.goles2}</Text>
        </View>
      </View>
      <View style={styles.teamContainer}>
        <Text style={styles.teamName}>{encuentro.equipo2.nombre}</Text>
        <FastImage style={styles.teamImage} source={{ uri: encuentro.equipo2.imagen }} resizeMode='contain' />
      </View>
    </View>
  );
});

export default CardFixture;

const styles = StyleSheet.create({
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2.5,
    marginVertical: 2.5,
    width: '100%',
    position: 'relative',
    padding: 5,
    borderRadius: 10,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamImage: {
    width: 30,
    height: 30,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0, 
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
