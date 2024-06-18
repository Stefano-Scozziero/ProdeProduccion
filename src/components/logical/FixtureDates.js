import React, { useContext, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, FlatList, Touchable } from 'react-native'
import LoadingSpinner from '../presentational/LoadingSpinner'
import EmptyListComponent from '../presentational/EmptyListComponent'
import Error from '../presentational/Error'
import { OrientationContext } from '../../utils/globals/context'
import ModalSelector from 'react-native-modal-selector'
import CardFixture from '../presentational/CardFixture'
import { db } from '../../app/services/firebase/config'
import colors from '../../utils/globals/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

const FixtureDates = ({ navigation }) => {
  const [categorySelected, setCategorySelected] = useState('Liga Casildense')
  const [datos, setDatos] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const portrait = useContext(OrientationContext)
  const [selectedDivision, setSelectedDivision] = useState('Primera Division')
  const [selectedTournament, setSelectedTournament] = useState('Apertura')
  const [filteredFechas, setFilteredFechas] = useState([])
  const divisionSelectorRef = useRef(null)
  const tournamentSelectorRef = useRef(null)
  const [divisionOptions, setDivisionOptions] = useState([])
  const [tournamentOptions, setTournamentOptions] = useState([])

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture').on('value', (snapshot) => {
      if (snapshot.exists() && categorySelected !== null) {
        const data = snapshot.val()
        if (data[categorySelected]) {
          setDatos(data)
          setIsLoading(false)
        } else {
          setDatos(null)
          setIsLoading(false)
        }
      } else {
        setIsError(true)
        setIsLoading(false)
      }
    }, (error) => {
      console.error(error)
      setIsError(true)
      setIsLoading(false)
    })

    return () => {
      db.ref('/datos/fixture').off('value', onValueChange)
    }
  }, [categorySelected])

  const getEquipo = (id) => {
    if (datos && datos[categorySelected] && datos[categorySelected].equipos) {
      return datos[categorySelected].equipos[id]
    }
    return null
  }

  useEffect(() => {
    if (datos && categorySelected) {
      const divisions = Object.keys(datos[categorySelected].partidos || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDivisionOptions(divisions);
  
      if (divisions.length > 0) {
        setSelectedDivision(prev => prev ? prev : divisions[0].key);
      } else {
        setSelectedDivision(null);
      }
    }
  }, [datos, categorySelected]);

  useEffect(() => {
    if (datos && categorySelected && selectedDivision) {
      const tournaments = Object.keys(datos[categorySelected].partidos[selectedDivision] || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setTournamentOptions(tournaments);
  
      if (tournaments.length > 0) {
        setSelectedTournament(prev => prev ? prev : tournaments[0].key); // Solo establece si prev es null
      } else {
        setSelectedTournament(null);
      }
    }
  }, [datos, categorySelected, selectedDivision]);

  useEffect(() => {
    if (datos && categorySelected) {
      const partidosDelTorneo = datos[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
      const fechas = Object.keys(partidosDelTorneo)
        .filter(key => !isNaN(key) && Number(key) >= 1)
        .map(Number);
  
      const fechasConPartidos = fechas.map(fecha => {
        const encuentrosDeLaFecha = partidosDelTorneo[fecha]?.encuentros || [];
        const partidosConEquipos = encuentrosDeLaFecha.map(partido => ({
          ...partido,
          equipo1: getEquipo(partido.equipo1),
          equipo2: getEquipo(partido.equipo2),
        }));
        return { fecha, partidos: partidosConEquipos };
      });
      setFilteredFechas(fechasConPartidos);
    }
  }, [datos, categorySelected, selectedDivision, selectedTournament]);
  

  const renderItem = ({ item }) => (
    <View style={{backgroundColor: colors.blackGray, borderRadius: 10, marginVertical: 10}}>
      <Text style={styles.fechaTitle}>Fecha {item.fecha}</Text>
      {item.partidos.length > 0 && (
        item.partidos.map((partido, index) => (
          <CardFixture key={`partido-${index}`} encuentro={partido} />
        ))
      )}
    </View>
  )

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')} />
  if (!datos) return <EmptyListComponent message="No hay datos disponibles" />

  return (
    <View style={[styles.container, !portrait && styles.landScape]}>
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
      <View style={styles.containerFlatlist}>
        <FlatList
          data={filteredFechas}
          keyExtractor={(item) => `fecha-${item.fecha}`}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyListText}>No hay encuentros disponibles</Text>}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={8}
        />
      </View>
    </View>
  )
}

export default FixtureDates

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  landScape: {
    height: '60%',
  },
  containerPicker: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerText: {
    width: '95%',
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
    justifyContent: 'space-between', 
    paddingHorizontal: 20
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
    width: '100%',
    borderRadius: 10,
  },
  pickerText: {
    color: colors.black,
    textAlign: 'left',
  },
  initValueTextStyle: {
    color: colors.black,
  },
  pickerArrow: {
    color: colors.black,
    fontSize: 15, 
  },
  containerFlatlist: {
    width: '100%',
    flex: 1,
  },
  fechaTitle: {
    fontSize: 18,
    color: colors.white,
    marginVertical: 5,
    textAlign: 'center',
  },
  emptyListText: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
