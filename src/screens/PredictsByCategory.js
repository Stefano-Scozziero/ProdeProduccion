import { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, ImageBackground, Text, TouchableOpacity, Alert } from 'react-native'
import LoadingSpinner from '../components/presentational/LoadingSpinner'
import EmptyListComponent from '../components/presentational/EmptyListComponent'
import Error from '../components/presentational/Error'
import DatesByCategory from '../components/presentational/DatesByCategory'
import { OrientationContext } from '../utils/globals/context'
import { Picker } from '@react-native-picker/picker'
import colors from '../utils/globals/colors'
import ModalAlert from '../components/presentational/modal/ModalAlert'
import { db } from '../app/services/firebase/config'
import auth from '@react-native-firebase/auth'

const PredictsByCategory = ({ route, navigation }) => {
  const [modalAlert, setModalAlert] = useState(false)
  const { categorySelected } = route.params
  const [datos, setDatos] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const portrait = useContext(OrientationContext)
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [filteredPartidos, setFilteredPartidos] = useState([])
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false) 
  const [puntosEq1, setPuntosEq1] = useState({})
  const [puntosEq2, setPuntosEq2] = useState({})
  const user = auth().currentUser
  const [guardarPronosticos, setGuardarPronosticos] = useState(false)
  const [partidosEditados, setPartidosEditados] = useState({})

  const handleSumarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }))
  
    // Verifica si ya se han establecido los puntos para este encuentro
    if (puntosEq1[id] === undefined && puntosEq2[id] === undefined) {
      // Si no se han establecido, establece los puntos a cero
      setPuntosEq1(prevPoints => ({ ...prevPoints, [id]: 0 }))
      setPuntosEq2(prevPoints => ({ ...prevPoints, [id]: 0 }))
    } else {
      // Suma un punto al equipo correspondiente
      if (equipo === 'equipo1') {
        setPuntosEq1(prevPoints => ({ ...prevPoints, [id]: (prevPoints[id] || 0) + 1 }))
      } else {
        setPuntosEq2(prevPoints => ({ ...prevPoints, [id]: (prevPoints[id] || 0) + 1 }))
      }
    }
  }
  
  const handleRestarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }))
  
    // Verifica si ya se han establecido los puntos para este encuentro
    if (!puntosEq1[id] && !puntosEq2[id]) {
      // Si no se han establecido, establece los puntos a cero
      setPuntosEq1(prevPoints => ({ ...prevPoints, [id]: 0 }))
      setPuntosEq2(prevPoints => ({ ...prevPoints, [id]: 0 }))
    }
  
    // Resta un punto al equipo correspondiente
    if (equipo === 'equipo1') {
      setPuntosEq1(prevPoints => ({ ...prevPoints, [id]: Math.max((prevPoints[id] || 0) - 1, 0) }))
    } else {
      setPuntosEq2(prevPoints => ({ ...prevPoints, [id]: Math.max((prevPoints[id] || 0) - 1, 0) }))
    }
  }
  
  const guardarPronosticosEnDB = async () => {
    if (!selectedTournament || !selectedDate || !filteredPartidos) return
  
    try {
      const pronosticosRef = db.ref(`/profiles/${user.uid}/predicts/${selectedTournament}/Fecha:${selectedDate}`)
  
      // Obtener los pronósticos existentes
      const snapshot = await pronosticosRef.once('value')
      const pronosticosExistentes = snapshot.val() || []
  
      const pronosticosArray = filteredPartidos
        .filter(partido => partido !== null && partido !== undefined) // Filtrar los elementos null y undefined
        .reduce((obj, partido) => {
          if (partidosEditados[partido.id]) { // Si el partido ha sido editado
            obj[partido.id] = {
              equipo1: {
                nombre: partido.equipo1.nombre,
                puntos: puntosEq1.hasOwnProperty(partido.id) ? puntosEq1[partido.id] : undefined
              },
              equipo2: {
                nombre: partido.equipo2.nombre,
                puntos: puntosEq2.hasOwnProperty(partido.id) ? puntosEq2[partido.id] : undefined
              }
            }
          } else { // Si el partido no ha sido editado, mantener los pronósticos existentes
            const pronosticoExistente = pronosticosExistentes[partido.id]
            if (pronosticoExistente) {
              obj[partido.id] = pronosticoExistente
            }
          }
          return obj
        }, {})

      // Guardar los pronósticos en la base de datos
      await pronosticosRef.set(pronosticosArray)
      setModalAlert(true)
      setGuardarPronosticos(false)
  
    } catch (error) {
      console.error('Error al guardar los pronósticos:', error)
      // Manejar el error según sea necesario
    }
  }
  
  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture').on('value', (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        if (data[categorySelected]) {
          setSelectedTournament(categorySelected)
          setDatos(data)
        } else {
          setIsLoading(false)
          setSelectedTournament(null)
          setDatos(false) // Reiniciar la selección del torneo
        }
      } else {
        setIsLoading(false)
        setIsError(true)
      }
    }, (error) => {
      console.error(error)
      setIsLoading(false)
      setIsError(true)
    })

    return () => db.ref('/datos/fixture').off('value', onValueChange)
  }, [])

  useEffect(() => {
    const pronosticosRef = db.ref(`/profiles/${user.uid}/predicts/${selectedTournament}/Fecha:${selectedDate}`)
    
    // Establecer el listener
    const onValueChange = pronosticosRef.on('value', (snapshot) => {
      const pronosticosObj = snapshot.val()
      if (pronosticosObj) {
        // Inicializar los nuevos puntos
        const nuevosPuntosEq1 = {}
        const nuevosPuntosEq2 = {}
  
        // Iterar sobre cada pronóstico en el objeto
        Object.keys(pronosticosObj).forEach(id => {
          const pronostico = pronosticosObj[id]
          nuevosPuntosEq1[id] = pronostico.equipo1.puntos || 0
          nuevosPuntosEq2[id] = pronostico.equipo2.puntos || 0
        })
    
        // Actualizar los estados de los puntos
        setPuntosEq1(nuevosPuntosEq1)
        setPuntosEq2(nuevosPuntosEq2)
    
        setGuardarPronosticos(false)
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      setGuardarPronosticos(false)
    }, (error) => {
      console.error('Error al cargar los pronósticos desde la base de datos:', error)
      setIsLoading(false)
    })
    
    // Asegúrate de remover el listener cuando el componente se desmonte
    return () => pronosticosRef.off('value', onValueChange)
  }, [selectedTournament, selectedDate])
  
  useEffect(() => {
    if (puntosEq1 !== 0 || puntosEq2 !== 0) {
      setGuardarPronosticos(true)
    } else {
      setGuardarPronosticos(false)
    }
  }, [puntosEq1, puntosEq2])
  
  useEffect(() => {
    if (!pickerDataLoaded && datos && selectedTournament) {
      // Coloca aquí la lógica de carga de datos del Picker
      const partidosDelTorneo = datos[selectedTournament] || []
      const fechasDisponibles = partidosDelTorneo
        .flatMap(torneo => torneo.partidos || [])
        .map(partido => partido.fecha)
      const primeraFechaDisponibleNoJugada = partidosDelTorneo
        .flatMap(torneo => torneo.partidos || [])
        .find(partido => !partido.hasPlayed)?.fecha
      setSelectedDate(primeraFechaDisponibleNoJugada || fechasDisponibles[0])
      setPickerDataLoaded(true)
    }
  }, [selectedTournament, datos, pickerDataLoaded])

  useEffect(() => {
    if (datos && selectedTournament && selectedDate) {
      const partidosDelTorneo = datos[selectedTournament] || [];
      
      const partidosPorFecha = partidosDelTorneo
        .flatMap(torneo => torneo.partidos || [])
        .find(partido => partido.fecha === selectedDate);
  
      if (partidosPorFecha) {
        const encuentrosPorFecha = partidosPorFecha?.encuentros || [];
        setFilteredPartidos(encuentrosPorFecha)
      } else {
        setFilteredPartidos([]);
      }
      
      setIsLoading(false);
    } else {
      setFilteredPartidos([]);
    }
  }, [selectedTournament, selectedDate, datos]);  

  if (isLoading) return <LoadingSpinner />
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')}/>
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />

  return (
    <ImageBackground source={require('../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
      {modalAlert && (
        <ModalAlert
          text="¡Pronósticos guardados exitosamente!"
          duration={2000} // Duración de la notificación en milisegundos
          onClose={() => setModalAlert(false)}
        />
      )}
      <View style={styles.containerPicker}>
        <View style={styles.containerText}>
          <Text style={styles.text}>{selectedTournament}</Text>
        </View>
        <View style={styles.picker2}>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
            style={{ width: '100%', height: '100%'}}
            mode="dropdown"
          >
            {selectedTournament &&
              datos[selectedTournament]?.map((torneo) =>
                torneo.title === 'Apertura' ? (
                  torneo.partidos.map((partido, index) => (
                    // Muestra todas las fechas disponibles, pero inicialmente selecciona la primera fecha con hasPlayed en false
                    <Picker.Item
                      key={index}
                      label={`Fecha ${partido.fecha}`}
                      value={partido.fecha}
                      selected={!partido.hasPlayed}
                    />
                  ))
                ) : null
              )}
          </Picker>
        </View>
      </View>
      
      <View style={styles.containerFlatlist}>
        <View style={styles.flatlist}>
        <FlatList
          data={filteredPartidos}
          keyExtractor={(_, index) => `partidos-${index}`}
          renderItem={({ item }) => (
            <DatesByCategory
              encuentros={item}
              onSumarPuntos={(equipo) => handleSumarPuntos(equipo, item.id)}
              onRestarPuntos={(equipo) => handleRestarPuntos(equipo, item.id)}
              puntosEq1={puntosEq1.hasOwnProperty(item.id) ? puntosEq1[item.id] : undefined}
              puntosEq2={puntosEq2.hasOwnProperty(item.id) ? puntosEq2[item.id] : undefined}
            />
          )}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={8}
        />
        </View>
      </View>
      {guardarPronosticos && 
        <TouchableOpacity style={{position: 'absolute',width: '90%', bottom: 20,backgroundColor: colors.orange,padding: 10,borderRadius: 5}} onPress={guardarPronosticosEnDB}>
          <Text style= {{textAlign: 'center'}}>Guardar Pronósticos</Text>
        </TouchableOpacity>
      }
    </ImageBackground>
  )
}

export default PredictsByCategory

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPicker: {
    width: '100%',
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landScape: {
    width: '100%',
    height: '60%',
  },
  containerText: {
    width: 350,
    height: 45,
    borderColor: colors.orange,
    borderWidth: 1,
    marginVertical:2.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 25
  },
  picker2: {
    width: 350,
    height: 45,
    borderColor: colors.orange,
    borderWidth: 1,
    marginVertical:2.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerFlatlist: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center'

  }
})