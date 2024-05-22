import { StyleSheet, ImageBackground, View, FlatList, Text } from 'react-native'
import { useContext, useState, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner'
import EmptyListComponent from '../EmptyListComponent'
import Error from '../Error'
import { db } from '../../../app/services/firebase/config'
import { Picker } from '@react-native-picker/picker'
import colors from '../../../utils/globals/colors'
import DatesByCategoryAdm from '../DatesByCategoryAdm'
import { OrientationContext } from '../../../utils/globals/context'
import { format } from 'date-fns';

const DatesLigue = () => {
  const [categorySelected, setCategorySelected] = useState('Liga Casildense')
  const [selectedTorneo, setSelectedTorneo] = useState('Apertura')
  const [datos, setDatos] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isError, setIsError] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState('Primera Division')
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false)
  const [filteredPartidos, setFilteredPartidos] = useState([])
  const portrait = useContext(OrientationContext)

  useEffect(() => {
    const ref = db.ref('/datos/fixture')
    const onValueChange = ref.on(
      'value',
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()

          if (data?.[categorySelected]?.[selectedDivision]) {
            setDatos(data)
          } else {
            setDatos(false)
          }
          setIsLoading(false)
        } else {
          setIsLoading(false)
          setIsError(true)
        }
      },
      (error) => {
        console.error(error)
        setIsLoading(false)
        setIsError(true)
      }
    )

    return () => {
      ref.off('value', onValueChange)
    }
  }, [categorySelected, selectedDivision])

  useEffect(() => {
    if (datos && categorySelected && selectedDate && selectedDivision && selectedTorneo) {
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.[selectedTorneo]?.partidos || []
      const partidosPorFecha = partidosDelTorneo.find((partido) => partido.fecha === selectedDate)

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
  }, [categorySelected, selectedDate, datos, selectedDivision, selectedTorneo])

  const updateDate = (encounterId, newDate) => {
    const formattedDate = format(newDate, 'yyyy-MM-dd HH:mm:ss')
    const updatedDatos = { ...datos }
    const partidosDelTorneo = updatedDatos[categorySelected][selectedDivision][selectedTorneo].partidos
  
    const partido = partidosDelTorneo.find(partido => 
      partido.encuentros.some(encuentro => encuentro.id === encounterId)
    )
  
    if (partido) {
      const encounterIndex = partido.encuentros.findIndex(encuentro => encuentro.id === encounterId)
      const encuentro = partido.encuentros[encounterIndex]
      encuentro.fecha = formattedDate
  
      setDatos(updatedDatos)
  
      db.ref(`/datos/fixture/${categorySelected}/${selectedDivision}/${selectedTorneo}/partidos/${partidosDelTorneo.indexOf(partido)}/encuentros/${encounterIndex}/fecha`)
        .set(formattedDate)
        .catch(error => console.error(error))
    }
  }


  useEffect(() => {
    if (datos && categorySelected && selectedDivision && !pickerDataLoaded) {
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.['Apertura'].partidos || []
      const primeraFechaDisponibleNoJugada = partidosDelTorneo.find((partido) => !partido.hasPlayed)?.fecha
      setSelectedDate(primeraFechaDisponibleNoJugada || (partidosDelTorneo[0] && partidosDelTorneo[0].fecha))
      setPickerDataLoaded(true)
    }
  }, [datos, categorySelected, selectedDivision, selectedTorneo, pickerDataLoaded])

  const updateScore = (team, encounterId, increment) => {
    const updatedDatos = { ...datos }
    const partidosDelTorneo = updatedDatos[categorySelected][selectedDivision][selectedTorneo].partidos

    // Encontrar el índice del partido correcto basado en el encounterId
    const partido = partidosDelTorneo.find(partido => 
      partido.encuentros.some(encuentro => encuentro.id === encounterId)
    )

    if (partido) {
      const encounterIndex = partido.encuentros.findIndex(encuentro => encuentro.id === encounterId)
      const equipo = partido.encuentros[encounterIndex][team]

      if (equipo.puntos !== undefined) {
        // Verificar que los puntos no sean menores de 0
        equipo.puntos = Math.max(0, equipo.puntos + increment)
      } else {
        equipo.puntos = increment
      }

      setDatos(updatedDatos)

      db.ref(`/datos/fixture/${categorySelected}/${selectedDivision}/${selectedTorneo}/partidos/${partidosDelTorneo.indexOf(partido)}/encuentros/${encounterIndex}/${team}/puntos`)
        .set(equipo.puntos)
        .catch(error => console.error(error))
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')} />
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
      <View style={styles.containerPicker}>
        <View style={styles.containerText}>
          <Picker
            selectedValue={selectedDivision}
            onValueChange={(itemValue) => setSelectedDivision(itemValue)}
            style={{ width: '100%', height: '100%' }}
            mode="dropdown"
          >
            <Picker.Item label="Primera Division" value="Primera Division" />
            <Picker.Item label="Reserva" value="Reserva" />
          </Picker>
        </View>
        <View style={styles.picker2}>
          <Picker
            selectedValue={selectedTorneo}
            onValueChange={(itemValue) => {
              setSelectedTorneo(itemValue)
              setPickerDataLoaded(false)
            }}
            style={{ width: '100%', height: '100%' }}
            mode="dropdown"
          >
            <Picker.Item label="Apertura" value="Apertura" />
            <Picker.Item label="Clausura" value="Clausura" />
          </Picker>
        </View>
        <View style={styles.picker2}>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
            style={{ width: '100%', height: '100%' }}
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
              ))}
          </Picker>
        </View>
      </View>

      <View style={styles.containerFlatlist}>
        <View style={{ width: '95%' }}>
          <FlatList
            data={filteredPartidos}
            keyExtractor={(_, index) => `partidos-${index}`}
            renderItem={({ item }) => (
              <DatesByCategoryAdm
                encuentros={item}
                updateScore={updateScore}
                updateDate={updateDate}
              />
            )}
            ListEmptyComponent={<Text style={{ fontSize: 20 }}>No hay encuentros disponibles</Text>}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={8}
          />
        </View>
      </View>
    </ImageBackground>
  )
}

export default DatesLigue

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPicker: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center'
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
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center'

  }
})