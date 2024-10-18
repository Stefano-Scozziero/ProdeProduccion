import { StyleSheet, View, ImageBackground, Text, ScrollView, TouchableOpacity } from 'react-native';
import { OrientationContext } from '../../utils/globals/context';
import { useContext, useState } from 'react';
import colors from '../../utils/globals/colors';

const HowToUseApp = ({ navigation }) => {
  const portrait = useContext(OrientationContext);

  // Estado para controlar qué pasos están expandidos
  const [expandedSteps, setExpandedSteps] = useState({});

  // Datos de ejemplo para los pasos
  const steps = [
    {
      title: 'Realizar Pronóstico:',
      content: 'Accede a la sección "Predicciones" desde el menú principal. Selecciona una competición y haz tus apuestas sobre qué equipo crees que ganará. Una vez que hayas completado tus predicciones, pulsa el botón "Guardar Pronósticos" para registrar tu apuesta.',
    },
    {
      title: 'Fixture:',
      content: 'Desde el menú principal, selecciona la opción "Fixture" para consultar todas las fechas de los partidos jugados y por jugar en la competición elegida.',
    },
    {
      title: 'Tabla de Líderes:',
      content: 'En el menú principal, accede a "Tabla de Líderes" para visualizar las posiciones y puntuaciones de los equipos participantes en la competición seleccionada.',
    },
    {
      title: 'Noticias:',
      content: 'En la sección "Noticias", disponible desde el menú principal, podrás ver actualizaciones en tiempo real sobre los resultados y el estado de los partidos.',
    },
    {
      title: 'Compartir:',
      content: 'En el menú desplegable, selecciona "Compartir" para enviar tus predicciones a amigos y animarlos a participar contigo.',
    },
  ];

  // Función para alternar la expansión de cada paso
  const toggleStep = (index) => {
    setExpandedSteps((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <ImageBackground
      source={require('../../../assets/fondodefinitivo.png')}
      style={[styles.main, !portrait && styles.mainLandscape]}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.content}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <TouchableOpacity onPress={() => toggleStep(index)} style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>{step.title}</Text>
                <Text style={styles.icon}>{expandedSteps[index] ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {expandedSteps[index] && (
                <Text style={styles.text}>{step.content}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default HowToUseApp;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  mainLandscape: {
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo semi-transparente
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  stepContainer: {
    marginBottom: 15,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 18,
    color: colors.white,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    lineHeight: 24,
    marginTop: 5,
  },
});
