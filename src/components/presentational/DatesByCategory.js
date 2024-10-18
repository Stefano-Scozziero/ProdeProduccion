<<<<<<< HEAD
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
=======
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
>>>>>>> testing/master
            <Text style={styles.scoreTextReal}>{encuentros.goles1}</Text>
            <LineAnimation />
            <Text style={styles.scoreTextReal}>{encuentros.goles2}</Text>
          </View>
<<<<<<< HEAD
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
=======
          
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
>>>>>>> testing/master
              <Text style={styles.teamName}>{encuentros.equipo2.nombre}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> testing/master

export default DatesByCategory;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
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
>>>>>>> testing/master
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
<<<<<<< HEAD
    paddingVertical: 5,
    marginVertical: 2.5,
    width: '100%',
    position: 'relative'
  },
  containerMatch: {
    width: 100,
    height: '100%'
  },

=======
    width: '100%',
  },
  containerMatch: {
    flex: 1, 
    alignItems: 'center'
  },
>>>>>>> testing/master
  teamContainer: {
    alignItems: 'center',
  },
  teamImage: {
    width: 60,
<<<<<<< HEAD
    height: 60
=======
    height: 60,
  },
  teamName: {
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    marginTop: 5,
>>>>>>> testing/master
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
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
>>>>>>> testing/master
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginVertical: 5,
<<<<<<< HEAD
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
=======
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
>>>>>>> testing/master
