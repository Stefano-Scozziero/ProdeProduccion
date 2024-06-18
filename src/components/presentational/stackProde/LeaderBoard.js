import React, { useContext, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, FlatList, ImageBackground, Dimensions, TouchableOpacity } from 'react-native'
import LoadingSpinner from '../LoadingSpinner'
import EmptyListComponent from '../EmptyListComponent'
import Error from '../Error'
import { OrientationContext } from '../../../utils/globals/context'
import ModalSelector from 'react-native-modal-selector'
import { db } from '../../../app/services/firebase/config'
import colors from '../../../utils/globals/colors'
import DatesByLeader from '../DatesByLeader'

const { width } = Dimensions.get('window')

const LeaderBoard = ({ navigation }) => {
  const [categorySelected, setCategorySelected] = useState('Liga Casildense')
  const [datos, setDatos] = useState(null)
  const [datos1, setDatos1] = useState(null)
  const [equipos, setEquipos] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const portrait = useContext(OrientationContext)
  const [selectedDivision, setSelectedDivision] = useState('Primera Division')
  const [selectedTournament, setSelectedTournament] = useState('Apertura')
  const [positions, setPositions] = useState([])
  const divisionSelectorRef = useRef(null)
  const tournamentSelectorRef = useRef(null)
  const [divisionOptions, setDivisionOptions] = useState([])
  const [tournamentOptions, setTournamentOptions] = useState([])
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posicionesSnapshot = await db.ref('/datos/positions').once('value')
        const equiposSnapshot = await db.ref(`/datos/fixture/${categorySelected}/equipos`).once('value')
        const datosSnapshot = await db.ref(`/datos/fixture`).once('value')

        if (posicionesSnapshot.exists() && categorySelected !== null && datosSnapshot.exists()) {
          const posicionesData = posicionesSnapshot.val()
          const equiposData = equiposSnapshot.val()
          const data = datosSnapshot.val()
          setDatos(posicionesData)
          setEquipos(equiposData)
          setDatos1(data)
        } else {
          setDatos(null)
        }
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsError(true)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [categorySelected])

  useEffect(() => {
    if (datos1 && categorySelected) {
      const divisions = Object.keys(datos1[categorySelected]?.partidos || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDivisionOptions(divisions);
      setSelectedDivision(divisions.length > 0 ? divisions[0].key : null);
    }
  }, [datos1, categorySelected])

  useEffect(() => {
    if (datos1 && categorySelected && selectedDivision) {
      const tournaments = Object.keys(datos1[categorySelected]?.partidos?.[selectedDivision] || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setTournamentOptions(tournaments);

      // Check if the currently selected tournament is still available
      if (!tournaments.find(t => t.key === selectedTournament)) {
        setSelectedTournament(tournaments.length > 0 ? tournaments[0].key : null);
      }
    }
  }, [datos1, categorySelected, selectedDivision])

  useEffect(() => {
    if (datos && categorySelected && equipos) {
      const posiciones = datos[categorySelected]?.[selectedDivision]?.[selectedTournament]?.equipos || {}
      const sortedPositions = Object.values(posiciones).sort((a, b) => {
        if (b.puntos === a.puntos) {
          const diffA = a.golesFavor - a.golesContra
          const diffB = b.golesFavor - b.golesContra
          if (diffB === diffA) {
            return b.golesFavor - a.golesFavor
          }
          return diffB - diffA
        }
        return b.puntos - a.puntos
      })
      const combinedPositions = sortedPositions.map(posicion => ({
        ...posicion,
        ...equipos[posicion.nombre],
      }))
      setPositions(combinedPositions)
    }
  }, [datos, categorySelected, selectedDivision, selectedTournament, equipos])

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')} />
  if (!datos) return <EmptyListComponent message="No hay datos disponibles" />
  
  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
      <View style={styles.containerPicker}>
        <View style={styles.containerText}>
          <TouchableOpacity style={styles.touchableContainer} onPress={() => divisionSelectorRef.current.open()}>
            <ModalSelector
              data={divisionOptions}
              initValue={selectedDivision}
              onChange={(option) => setSelectedDivision(option.key)}
              style={styles.picker}
              optionTextStyle={styles.pickerText}
              selectStyle={{ borderWidth: 0 }}
              selectedItem={selectedDivision}
              selectedItemTextStyle={styles.selectedItem}
              initValueTextStyle={styles.initValueTextStyle}
              backdropPressToClose={true}
              animationType='fade'
              cancelText='Salir'
              cancelTextStyle={{ color: colors.black }}
              ref={divisionSelectorRef}
            />
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.containerText}>
          <TouchableOpacity style={styles.touchableContainer} onPress={() => tournamentSelectorRef.current.open()}>
            <ModalSelector
              data={tournamentOptions}
              initValue={selectedTournament}
              onChange={(option) => setSelectedTournament(option.key)}
              optionTextStyle={styles.pickerText}
              style={styles.picker}
              selectStyle={{ borderWidth: 0 }}
              selectedItem={selectedTournament}
              selectedItemTextStyle={styles.selectedItem}
              initValueTextStyle={styles.initValueTextStyle}
              backdropPressToClose={true}
              animationType='fade'
              cancelText='Salir'
              cancelTextStyle={{ color: colors.black }}
              ref={tournamentSelectorRef}
            />
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
      {positions.length > 0 && (
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.headerText}>Pos.</Text>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerText}>Club</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.headerText}>Pts.</Text>
            <Text style={styles.headerText}>Jug.</Text>
            <Text style={styles.headerText}>Gan.</Text>
            <Text style={styles.headerText}>Emp.</Text>
            <Text style={styles.headerText}>Per.</Text>
            <Text style={styles.headerText}>GF</Text>
            <Text style={styles.headerText}>GC</Text>
            <Text style={styles.headerText}>DI</Text>
          </View>
        </View>
      )}
      <View style={styles.containerFlatlist}>
        <FlatList
          data={positions}
          keyExtractor={(_, index) => `posiciones-${index}`}
          renderItem={({ item, index }) => (
            <DatesByLeader
              posiciones={item}
              index={index + 1}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyListText}>No hay datos disponibles</Text>}
          initialNumToRender={16}
          windowSize={8}
        />
      </View>
    </ImageBackground>
  )
}

export default LeaderBoard

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center'
  },
  mainLandScape: {
    flexDirection: 'row'
  },
  containerPicker: {
    width: width * 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerText: {
    width: width * 0.95,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.orange,
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: colors.gray,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  selectedItem: {
    color: colors.orange,
  },
  picker: {
    width: '90%',
    borderRadius: 10,
  },
  pickerText: {
    color: colors.black,
    textAlign: 'center', // Centra el texto dentro del picker
  },
  initValueTextStyle: {
    color: colors.black,
    textAlign: 'center', // Centra el texto de valor inicial
  },
  pickerArrow: {
    color: colors.black,
    fontSize: 15,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',  
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    justifyContent: 'space-between',
  },
  headerText: {
    width: width * 0.08,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerTextStart: {
    width: width * 0.3,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    left: 45
  },
  containerFlatlist: {
    width: '100%',
    flex: 1,
  },
  emptyListText: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
