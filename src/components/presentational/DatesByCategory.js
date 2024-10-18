import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../../utils/globals/colors';
import { parseISO, format, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';
import BallAnimation from './animation/BallAnimation';
import LineAnimation from './animation/LineAnimation';

const DatesByCategory = ({ encuentros, onSumarPuntos, onRestarPuntos, puntosEq1, puntosEq2, puntosWin }) => {
  const fechaPartido = parseISO(encuentros.fecha);
  const ahora = new Date();
  const diferenciaHoras = differenceInHours(fechaPartido, ahora);
  
  const formatoFechaPersonalizado = (fecha) => {
    const diaAbreviado = format(fecha, "eee", { locale: es });
    const diaCapitalizado = diaAbreviado.charAt(0).toUpperCase() + diaAbreviado.slice(1);
    const fechaFormateada = format(fecha, "dd/MM - HH:mm", { locale: es });
    return `${diaCapitalizado}. ${fechaFormateada}`;
  };

  const isMatchInFuture = !encuentros.hasPlayed && !encuentros.isUpComing && !encuentros.isPlaying;
  const isMatchStartingSoon = isMatchInFuture && diferenciaHoras <= 3 && diferenciaHoras > 0;
  const isMatchAboutToStart = encuentros.isUpComing && !encuentros.hasPlayed;
  const isMatchInProgress = encuentros.isPlaying;
  const hasMatchEnded = encuentros.hasPlayed;

  const renderHeader = () => {
    if (isMatchInFuture) {
      return (
        <View style={styles.containerResult}>
          <Text style={styles.headerValue}>{formatoFechaPersonalizado(fechaPartido)}</Text>
        </View>
      );
    } else if (isMatchStartingSoon) {
      return (
        <View style={styles.containerMatching}>
          <Text style={styles.headerLabel}>PRÓXIMAMENTE:</Text>
          <Text style={styles.headerValue}>{formatoFechaPersonalizado(fechaPartido)}</Text>
        </View>
      );
    } else if (isMatchAboutToStart) {
      return (
        <View style={styles.containerMatching}>
          <Image style={styles.icon} source={require('../../../assets/pelota.png')} />
          <Text style={styles.headerLabel}>POR COMENZAR:</Text>
          <View style={{width: '55%',flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}}>
            <Text style={styles.headerValue}>{format(fechaPartido, 'HH:mm')}</Text>
          </View>
          
        </View>
      );
    } else if (isMatchInProgress) {
      return (
        <View style={styles.containerMatching}>
          <BallAnimation />
          <View style={{width: '60%',flexDirection: 'row', alignItems: 'center', justifyContent: 'left'}}>
            <Text style={styles.scoreTextReal}>{encuentros.goles1}</Text>
            <LineAnimation />
            <Text style={styles.scoreTextReal}>{encuentros.goles2}</Text>
          </View>
          
        </View>
      );
    } else if (hasMatchEnded) {
      return (
        <View style={styles.containerResult}>
          <Text style={styles.headerLabel}>Finalizado.</Text>
          <View style={{backgroundColor: colors.green, padding: 2, borderRadius: 5}}>
            <Text style={styles.headerLabel}>{puntosWin} pts.</Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const ScoreButtons = ({ team, onSumarPuntos, onRestarPuntos, puntos, disabled }) => (
    <View style={team === 'equipo1' ? styles.scoreBoxLeft : styles.scoreBoxRight}>
      <TouchableOpacity
        style={team === 'equipo1' ? styles.buttonLeft : styles.buttonRight}
        onPress={() => onSumarPuntos(team)}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          <Text style={[styles.buttonText, disabled && styles.disabledText]}>+</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.scoreText}>{puntos == undefined ? '-' : puntos}</Text>
      <TouchableOpacity
        style={team === 'equipo1' ? styles.buttonLeft : styles.buttonRight}
        onPress={() => onRestarPuntos(team)}
        disabled={disabled}
      >
        <View style={styles.buttonContent}>
          <Text style={[styles.buttonText, disabled && styles.disabledText]}>-</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderScoreSection = () => {
    if (hasMatchEnded) {
      return (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Resultado:</Text>
          <Text style={styles.scoreTextReal}>{encuentros.goles1} - {encuentros.goles2}</Text>
          <View style={styles.resultContainerPro}>
            <Text style={styles.predictionText}>Tu Pronóstico: </Text>
            <Text style={styles.predictionText}>{puntosEq1} - {puntosEq2}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.scoreContainer}>
          <ScoreButtons
            team="equipo1"
            onSumarPuntos={onSumarPuntos}
            onRestarPuntos={onRestarPuntos}
            puntos={puntosEq1}
            disabled={encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying}
          />
          <ScoreButtons
            team="equipo2"
            onSumarPuntos={onSumarPuntos}
            onRestarPuntos={onRestarPuntos}
            puntos={puntosEq2}
            disabled={encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.cardContainer,
        (encuentros.hasPlayed || encuentros.isUpComing || encuentros.isPlaying) && styles.cardContainerDisable
      ]}>
        {renderHeader()}
        <View style={styles.encuentroContainer}>
          <View style={styles.containerMatch}>
            <View style={styles.teamContainer}>
              <FastImage
                style={styles.teamImage}
                source={{ uri: encuentros.equipo1.imagen }}
                resizeMode='contain'
              />
              <Text style={styles.teamName}>{encuentros.equipo1.nombre}</Text>
            </View>
          </View>
          {renderScoreSection()}
          <View style={styles.containerMatch}>
            <View style={styles.teamContainer}>
              <FastImage
                style={styles.teamImage}
                source={{ uri: encuentros.equipo2.imagen }}
                resizeMode='contain'
              />
              <Text style={styles.teamName}>{encuentros.equipo2.nombre}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DatesByCategory;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
  },
  cardContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.blackGray,
    padding: 10,
  },
  cardContainerDisable: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    width: '100%',
  },
  containerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    padding: 2,
    marginBottom: 10
  },
  containerMatching: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  headerLabel: {
    color: colors.white,
    fontSize: 12,
    marginHorizontal: 5,
  },
  headerValue: {
    color: colors.white,
    fontSize: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  containerMatch: {
    flex: 1, 
    alignItems: 'center'
  },
  teamContainer: {
    alignItems: 'center',
  },
  teamImage: {
    width: 60,
    height: 60,
  },
  teamName: {
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    marginTop: 5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBoxLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreBoxRight: {
    alignItems: 'center',
    marginLeft: 20,
  },
  buttonLeft: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 5,
  },
  buttonRight: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 5,
  },
  buttonContent: {
    width: 50,
    height: 35,
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
    marginVertical: 5,
    textAlign: 'center',
  },
  scoreTextReal: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 5,
    bottom: 5
  },
  resultContainer: {
    alignItems: 'center',
    width: '40%'
  },
  resultContainerPro: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    width: '80%',
    marginVertical: 5,
    padding: 5
  },
  resultText: {
    color: colors.white,
    fontSize: 14,
    bottom: 5
    
  },
  predictionText: {
    color: colors.black,
    fontSize: 12,
    marginTop: 5,
  },
});
