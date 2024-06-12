import { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import FastImage from 'react-native-fast-image'
import PropTypes from 'prop-types'
import colors from '../../utils/globals/colors'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns';

const TeamInfo = ({ imageUri, teamName }) => (
  <View style={styles.teamContainer}>
    <FastImage style={styles.teamImage} source={{ uri: imageUri }} resizeMode="contain" />
    <Text style={styles.teamName}>{teamName}</Text>
  </View>
)

const ScoreButton = ({ onPress, label }) => (
  <TouchableOpacity style={styles.buttons} onPress={onPress}>
    <View style={styles.scoreButtonContent}>
      <Text style={styles.scoreButtonText}>{label}</Text>
    </View>
  </TouchableOpacity>
)

const DatesByCategoryAdm = ({ encuentros, updateScore, updateDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date(encuentros.fecha));
  const [time, setTime] = useState(new Date(encuentros.fecha));

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const formatTime = (time) => {
    return format(time, 'HH:mm');
  };

  const applyDateTime = () => {
    const dateTime = new Date(date);
    dateTime.setHours(time.getHours());
    dateTime.setMinutes(time.getMinutes());
    dateTime.setSeconds(time.getSeconds());
    updateDate(encuentros.id, dateTime);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.cardContainer]}>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          <TouchableOpacity style={{ marginStart: 2, marginRight: 25 }} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateText}>{formatTime(time)}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChangeTime}
            />
          )}
          <TouchableOpacity style={styles.applyButton} onPress={applyDateTime}>
            <Text style={styles.dateText}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.encuentroContainer}>
          <TeamInfo imageUri={encuentros.equipo1.imagen} teamName={encuentros.equipo1.nombre} />

          <View style={styles.scoreContainer}>
            <View style={styles.scoreBoxLeft}>
              <ScoreButton onPress={() => updateScore(encuentros.id, 1, 1)} label="+" />
              <Text style={styles.scoreText}>{encuentros.goles1 === undefined ? '-' : encuentros.goles1}</Text>
              <ScoreButton onPress={() => updateScore(encuentros.id, 1, -1)} label="-" />
            </View>

            <View style={styles.scoreBoxRight}>
              <ScoreButton onPress={() => updateScore(encuentros.id, 2, 1)} label="+" />
              <Text style={styles.scoreText}>{encuentros.goles2 === undefined ? '-' : encuentros.goles2}</Text>
              <ScoreButton onPress={() => updateScore(encuentros.id, 2, -1)} label="-" />
            </View>
          </View>

          <TeamInfo imageUri={encuentros.equipo2.imagen} teamName={encuentros.equipo2.nombre} />
        </View>
      </View>
    </View>
  );
};


DatesByCategoryAdm.propTypes = {
  encuentros: PropTypes.shape({
    equipo1: PropTypes.shape({
      imagen: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      puntos: PropTypes.number,
    }).isRequired,
    equipo2: PropTypes.shape({
      imagen: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      puntos: PropTypes.number,
    }).isRequired,
    hasPlayed: PropTypes.bool.isRequired,
    isUpComing: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
  }).isRequired,
  updateScore: PropTypes.func.isRequired,
  updateDate: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  dateText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center'
  },
  hasPlayedButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  hasPlayedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    width: '100%',
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blackGray,
    borderRadius: 10,
    padding: 10
  },
  cardContainerDisable: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
  encuentroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginVertical: 2.5,
    width: '100%',
    position: 'relative',
  },
  teamContainer: {
    alignItems: 'center',
  },
  teamImage: {
    width: 60,
    height: 60,
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
    width: 80,
    height: 30,
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
    top: 5,
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
    left: 25,
  },
  scoreText: {
    width: 25,
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  buttons: {
    width: 50,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreButtonContent: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledText: {
    color: 'rgba(128, 128, 128, 0.5)',
  },
  applyButton:{
    backgroundColor: colors.orange, 
    borderRadius: 5, 
    width: '20%'
  }
})

export default DatesByCategoryAdm
