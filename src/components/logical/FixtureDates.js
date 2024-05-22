import { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import LoadingSpinner from '../presentational/LoadingSpinner'
import EmptyListComponent from '../presentational/EmptyListComponent'
import Error from '../presentational/Error'
import { OrientationContext } from '../../utils/globals/context'
import { Picker } from '@react-native-picker/picker'
import colors from '../../utils/globals/colors'
import CardFixture from '../presentational/CardFixture'
import { db } from '../../app/services/firebase/config'

const FixtureDates = ({ navigation }) => {
  const [datos, setDatos] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const portrait = useContext(OrientationContext)
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [selectedDivision, setSelectedDivision] = useState('Primera Division') // Inicializar con 'Primera Division'
  const [filteredPartidos, setFilteredPartidos] = useState([])
  const divisions = ['Primera Division', 'Reserva']

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture')
      .on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          setDatos(data)
          if (data && Object.keys(data).length > 0) {
            const [firstLeagueKey] = Object.keys(data)
            setSelectedLeague(firstLeagueKey)
            const divisions = Object.keys(data[firstLeagueKey])
            if (!divisions.includes('Primera Division')) {
              setSelectedDivision(divisions[0]) // Seleccionar la primera división disponible si 'Primera Division' no está en las divisiones
            }
            setSelectedTournament(Object.keys(data[firstLeagueKey][selectedDivision])[0])
          } else {
            setIsLoading(false)
            setIsError(true)
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
    if (datos && selectedLeague && selectedTournament) {
      const partidosDelTorneo = datos[selectedLeague][selectedDivision][selectedTournament]?.partidos || []
      setFilteredPartidos(partidosDelTorneo)
      setIsLoading(false)
    }
  }, [selectedLeague, selectedTournament, datos, selectedDivision])

  if (isLoading) return <LoadingSpinner />
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Home')} />
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />

  return (
    <View style={[styles.container, !portrait && styles.landScape]}>
      {selectedLeague && datos[selectedLeague] && selectedTournament && (
        <Picker
          selectedValue={selectedDivision}
          onValueChange={(itemValue) => setSelectedDivision(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {divisions.map((division) => (
            <Picker.Item key={division} label={division} value={division} />
          ))}
        </Picker>
      )}


      <View style={styles.flatlist}>
      {filteredPartidos && (
        <FlatList
          data={filteredPartidos}
          keyExtractor={(_, index) => `partido-${index}`}
          renderItem={({ item }) => <CardFixture partidos={item} />}
          initialNumToRender={25}
          maxToRenderPerBatch={15}
          windowSize={15}
        />
      )}
      </View>
    </View>
  )
}

export default FixtureDates



const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '87%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landScape: {
    width: '100%',
    height: '60%',
  },
  picker: {
    width: 350,
    height: 45,
    top: 25,
    marginTop: 5,
    backgroundColor: colors.orangeLight
  },
  flatlist: {
    width: '95%',
    height: '100%',
    top: 30
  }
})
