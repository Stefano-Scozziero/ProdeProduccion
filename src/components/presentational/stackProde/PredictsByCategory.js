import { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, ImageBackground, Text, TouchableOpacity, Pressable } from 'react-native'
import LoadingSpinner from '../LoadingSpinner'
import EmptyListComponent from '../EmptyListComponent'
import Error from '../Error'
import DatesByCategory from '../DatesByCategory'
import { OrientationContext } from '../../../utils/globals/context'
import { Picker } from '@react-native-picker/picker'
import colors from '../../../utils/globals/colors'
import ModalAlert from '../modal/ModalAlert'
import { db } from '../../../app/services/firebase/config'
import auth from '@react-native-firebase/auth'
import { useSelector } from 'react-redux'

const PredictsByCategory = ({ navigation }) => {
  const [modalAlert, setModalAlert] = useState(false)
  const categorySelected = useSelector(state => state.category.selectedCategory)
  const [datos, setDatos] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const portrait = useContext(OrientationContext)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDivision, setSelectedDivision] = useState('Primera Division')
  const [filteredPartidos, setFilteredPartidos] = useState([])
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false) 
  const [puntos, setPuntos] = useState({ eq1: {}, eq2: {} })
  const user = auth().currentUser
  const [guardarPronosticos, setGuardarPronosticos] = useState(false)
  const [partidosEditados, setPartidosEditados] = useState({})

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture').on('value', (snapshot) => {
      if (snapshot.exists() && categorySelected !== null && selectedDivision !== null) {
        const data = snapshot.val()
        if (data[categorySelected]?.[selectedDivision]) {
          setDatos(data)
          
        } else {
          setTimeout(() => {
            setIsLoading(false)
          }, 1500)
          setDatos(false) 
        }
      } else {
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
        setIsError(true)
      }
    }, (error) => {
      console.error(error)
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      setIsError(true)
    })

    return () => {
      db.ref('/datos/fixture').off('value', onValueChange)
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }
  }, [])

  const handleSumarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }))
  
    const nuevosPuntosEq1 = { ...puntos.eq1 }
    const nuevosPuntosEq2 = { ...puntos.eq2 }
    // Verifica si ya se han establecido los puntos para este encuentro
    if (nuevosPuntosEq1[id] === undefined && nuevosPuntosEq2[id] === undefined) {
      nuevosPuntosEq1[id] = 0
      nuevosPuntosEq2[id] = 0
    } else {
      if (equipo === 'equipo1') {
        nuevosPuntosEq1[id] = (nuevosPuntosEq1[id] || 0) + 1
      } else {
        nuevosPuntosEq2[id] = (nuevosPuntosEq2[id] || 0) + 1
      }
    }
    setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 })
  }

  const handleRestarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }))
  
    // Calcula los nuevos puntos aquí...
    const nuevosPuntosEq1 = { ...puntos.eq1 }
    const nuevosPuntosEq2 = { ...puntos.eq2 }
  
    if (!nuevosPuntosEq1[id] && !nuevosPuntosEq2[id]) {
      nuevosPuntosEq1[id] = 0
      nuevosPuntosEq2[id] = 0
    }
  
    // Resta un punto al equipo correspondiente
    if (equipo === 'equipo1') {
      nuevosPuntosEq1[id] = Math.max((nuevosPuntosEq1[id] || 0) - 1, 0)
    } else {
      nuevosPuntosEq2[id] = Math.max((nuevosPuntosEq2[id] || 0) - 1, 0)
    }
  
    // Luego actualiza el estado una sola vez
    setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 })
  }
  
  const guardarPronosticosEnDB = async () => {
    if (!categorySelected || !selectedDate || !filteredPartidos) return
  
    try {
      const pronosticosRef = db.ref(`/profiles/${user.uid}/predicts/${categorySelected}/${selectedDivision}/Fecha:${selectedDate}`)
  
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
                puntos: puntos.eq1.hasOwnProperty(partido.id) ? puntos.eq1[partido.id] : undefined
              },
              equipo2: {
                nombre: partido.equipo2.nombre,
                puntos: puntos.eq2.hasOwnProperty(partido.id) ? puntos.eq2[partido.id] : undefined
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
      
      setGuardarPronosticos(false)
      setModalAlert(true)

    } catch (error) {
      console.error('Error al guardar los pronósticos:', error)
      // Manejar el error según sea necesario
    }
  }
  
  useEffect(() => {
    setPuntos({ eq1: {}, eq2: {} });
    const pronosticosRef = db.ref(`/profiles/${user.uid}/predicts/${categorySelected}/${selectedDivision}/Fecha:${selectedDate}`)
    
    const onValueChange = pronosticosRef.on('value', (snapshot) => {
      const pronosticosObj = snapshot.val()
      if (pronosticosObj) {
  
        const nuevosPuntosEq1 = {}
        const nuevosPuntosEq2 = {}
    
        Object.keys(pronosticosObj).forEach(id => {
          const pronostico = pronosticosObj[id]
          nuevosPuntosEq1[id] = pronostico.equipo1.puntos || 0
          nuevosPuntosEq2[id] = pronostico.equipo2.puntos || 0
        })
      
        // Actualizar los estados de los puntos
        setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 });
      
        setGuardarPronosticos(false)
      }
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      setGuardarPronosticos(false)
    }, (error) => {
      console.error('Error al cargar los pronósticos desde la base de datos:', error)
      setIsLoading(false)
    })
    
    // Asegúrate de remover el listener cuando el componente se desmonte
    return () => pronosticosRef.off('value', onValueChange)
  }, [categorySelected, selectedDate, selectedDivision])
  
  useEffect(() => {
    const puntosEq1Definidos = Object.values(puntos.eq1).length > 0;
    const puntosEq2Definidos = Object.values(puntos.eq2).length > 0;
  
    if (puntosEq1Definidos || puntosEq2Definidos) {
      setGuardarPronosticos(true);
    } else {
      setGuardarPronosticos(false);
    }
  }, [puntos]);
  
  useEffect(() => {
    if (!pickerDataLoaded && datos && categorySelected) {
      // Coloca aquí la lógica de carga de datos del Picker
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.["Apertura"].partidos || []
      const fechasDisponibles = partidosDelTorneo.map(partido => partido.fecha)
      const primeraFechaDisponibleNoJugada = partidosDelTorneo.find(partido => !partido.hasPlayed)?.fecha
      setSelectedDate(primeraFechaDisponibleNoJugada || fechasDisponibles[0])
      setPickerDataLoaded(true)
    }
  }, [categorySelected, datos, pickerDataLoaded])
  
  useEffect(() => {
    if (datos && categorySelected && selectedDate && selectedDivision) {
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.["Apertura"].partidos || []
      
      const partidosPorFecha = partidosDelTorneo.find(partido => partido.fecha === selectedDate)

    if (partidosPorFecha) {
      const encuentrosPorFecha = partidosPorFecha?.encuentros || []
      setFilteredPartidos(encuentrosPorFecha)
    } else {
      setFilteredPartidos([])
    }
    
    setIsLoading(false)
  } else {
    setFilteredPartidos([])
  }
}, [categorySelected, selectedDate, datos, selectedDivision])


  if (isLoading) return <LoadingSpinner />
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')}/>
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
      {modalAlert && (
        <ModalAlert
          text="¡Pronósticos guardados exitosamente!"
          duration={2000} // Duración de la notificación en milisegundos
          onClose={() => setModalAlert(false)}
        />
      )}
      <View style={styles.containerPicker}>
        <View style={styles.containerText}>
        <Picker
          selectedValue={selectedDivision}
          onValueChange={(itemValue) => setSelectedDivision(itemValue)}
          style={{ width: '100%', height: '100%'}}
          mode="dropdown"
        >
          <Picker.Item label="Primera Division" value="Primera Division" />
          <Picker.Item label="Reserva" value="Reserva" />
        </Picker>
        </View>
        <View style={styles.picker2}>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
            style={{ width: '100%', height: '100%'}}
            mode="dropdown"
          >
            {categorySelected &&
              datos[categorySelected]?.[selectedDivision]?.["Apertura"].partidos.map((partido, index) => (
                <Picker.Item
                  key={index}
                  label={`Fecha ${partido.fecha}`}
                  value={partido.fecha}
                  selected={!partido.hasPlayed}
                />
              ))
            }
          </Picker>
        </View>
      </View>
      
      <View style={styles.containerFlatlist}>
        <View style={{width: '95%'}}>
        <FlatList
          data={filteredPartidos}
          keyExtractor={(_, index) => `partidos-${index}`}
          renderItem={({ item }) => (
            <DatesByCategory
              encuentros={item}
              onSumarPuntos={(equipo) => handleSumarPuntos(equipo, item.id)}
              onRestarPuntos={(equipo) => handleRestarPuntos(equipo, item.id)}
              puntosEq1={puntos.eq1.hasOwnProperty(item.id) ? puntos.eq1[item.id] : undefined}
              puntosEq2={puntos.eq2.hasOwnProperty(item.id) ? puntos.eq2[item.id] : undefined}
            />
          )}
          ListEmptyComponent={<Text>No hay encuentros disponibles para esta fecha.</Text>}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={8}
        />
        </View>
      </View>
      {guardarPronosticos && Object.keys(partidosEditados).length > 0 && 
        <TouchableOpacity activeOpacity={0.8} style={{position: 'absolute',width: '90%', bottom: 20,backgroundColor: colors.orange,padding: 10,borderRadius: 5}} onPress={guardarPronosticosEnDB}>
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
    marginVertical: 2.5,
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
    marginVertical: 2.5,
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