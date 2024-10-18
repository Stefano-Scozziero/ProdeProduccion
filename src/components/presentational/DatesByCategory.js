import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { parseISO, format, differenceInHours } from 'date-fns';
import BallAnimation from './animation/BallAnimation';
import LineAnimation from './animation/LineAnimation';
import colors from '../../utils/globals/colors';

const BUTTON_SIZE = 50;

const DatesByCategory = React.memo(({ encuentros, onSumarPuntos, onRestarPuntos, puntosEq1, puntosEq2 }) => {
  const fechaPartido = useMemo(() => parseISO(encuentros.fecha), [encuentros.fecha]);
  const ahora = useMemo(() => new Date(), []);
  const diferenciaHoras = useMemo(() => differenceInHours(fechaPartido, ahora), [fechaPartido, ahora]);

  // Función para determinar el estado del partido
  const getMatchStatus = () => {
    if (encuentros.hasPlayed) return 'played';
    if (encuentros.isPlaying) return 'playing';
    if (encuentros.isUpComing) return 'upcoming';
    if (diferenciaHoras <= 3 && diferenciaHoras > 0) return 'soon';
    return 'scheduled';
  };

  const matchStatus = getMatchStatus();

  // Componente para mostrar el estado del partido
  const MatchStatusView = () => {
    switch (matchStatus) {
      case 'played':
        return (
          <View style={styles.containerResult}>
            <Text style={styles.dateText}>{format(fechaPartido, 'yyyy-MM-dd HH:mm')}</Text>
            <Text style={styles.statusText}>RESULTADO:</Text>
            <Text style={styles.scoreTextReal}>{encuentros.goles1}</Text>
            <Text style={styles.scoreTextReal}>-</Text>
            <Text style={styles.scoreTextReal}>{encuentros.goles2}</Text>
          </View>
        );
      case 'playing':
        return (
          <View style={styles.containerResult}>
            <BallAnimation />
            <Text style={styles.statusText}>JUGANDO:</Text>
            <Text style={styles.scoreTextReal}>{encuentros.goles1}</Text>
            <LineAnimation />
            <Text style={styles.scoreTextReal}>{encuentros.goles2}</Text>
          </View>
        );
      case 'upcoming':
        return (
          <View style={styles.containerResult}>
            <Image style={styles.ballIcon} source={require('../../../assets/pelota.png')} />
            <Text style={styles.statusText}>POR COMENZAR:</Text>
            <Text style={styles.timeText}>{format(fechaPartido, 'HH:mm')}</Text>
          </View>
        );
      case 'soon':
        return (
          <View style={styles.containerResult}>
            <Text style={styles.statusText}>PRÓXIMAMENTE:</Text>
            <Text style={styles.timeText}>{format(fechaPartido, 'yyyy-MM-dd HH:mm')}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.containerResult}>
            <Text style={styles.statusText}>FECHA:</Text>
            <Text style={styles.timeText}>{format(fechaPartido, 'yyyy-MM-dd HH:mm')}</Text>
          </View>
        );
    }
  };

  // Componente para los botones de sumar y restar puntos
  const ScoreButton = ({ onPress, disabled, label }) => (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.scoreButton} accessible accessibilityLabel={label}>
      <View style={styles.buttonContent}>
        <Text style={[styles.buttonText, disabled && styles.disabledText]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const isDisabled = encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying;

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer, isDisabled && styles.cardContainerDisabled]}>
        <MatchStatusView />

        <View style={styles.encuentroContainer}>
          <View style={styles.teamContainer}>
            <FastImage style={styles.teamImage} source={{ uri: encuentros.equipo1.imagen }} resizeMode="contain" />
            <Text style={styles.teamName}>{encuentros.equipo1.nombre}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <ScoreButton onPress={() => onSumarPuntos('equipo1')} disabled={isDisabled} label="+" />
              <Text style={styles.scoreText}>{puntosEq1 !== undefined ? puntosEq1 : '-'}</Text>
              <ScoreButton onPress={() => onRestarPuntos('equipo1')} disabled={isDisabled} label="-" />
            </View>

            <View style={styles.scoreBox}>
              <ScoreButton onPress={() => onSumarPuntos('equipo2')} disabled={isDisabled} label="+" />
              <Text style={styles.scoreText}>{puntosEq2 !== undefined ? puntosEq2 : '-'}</Text>
              <ScoreButton onPress={() => onRestarPuntos('equipo2')} disabled={isDisabled} label="-" />
            </View>
          </View>

          <View style={styles.teamContainer}>
            <FastImage style={styles.teamImage} source={{ uri: encuentros.equipo2.imagen }} resizeMode="contain" />
            <Text style={styles.teamName}>{encuentros.equipo2.nombre}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default DatesByCategory;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: colors.blackGray,
    borderRadius: 10,
    padding: 10,
  },
  cardContainerDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
  containerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blackGray,
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 10,
  },
  dateText: {
    color: colors.white,
    fontSize: 12,
    marginHorizontal: 5,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    marginHorizontal: 5,
  },
  timeText: {
    color: colors.white,
    fontSize: 15,
  },
  scoreTextReal: {
    color: colors.green,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 5,
  },
  ballIcon: {
    width: 20,
    height: 20,
  },
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    alignItems: 'center',
    width: 100,
  },
  teamImage: {
    width: 60,
    height: 60,
  },
  teamName: {
    width: 80,
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    marginTop: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBox: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  scoreButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: colors.white,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.black,
  },
  disabledText: {
    color: 'rgba(128, 128, 128, 0.5)',
  },
  scoreText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
