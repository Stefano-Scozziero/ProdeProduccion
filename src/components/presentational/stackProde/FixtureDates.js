import React, { useContext, useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native'
import LoadingSpinner from '../LoadingSpinner'
import EmptyListComponent from '../EmptyListComponent'
import Error from '../Error'
import { OrientationContext } from '../../../utils/globals/context'
import ModalSelector from 'react-native-modal-selector'
import CardFixture from '../CardFixture'
import { database } from '../../../app/services/firebase/config'
import { useSelector } from 'react-redux';
import colors from '../../../utils/globals/colors'

const FixtureDates = ({ navigation }) => {
  const categorySelected = useSelector(state => state.category.selectedCategory);
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
  const db = database();

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
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Home')} />
  if (!datos) return <EmptyListComponent message="No hay datos disponibles" />

  return (
    <View style={[styles.container, !portrait && styles.landScape]}>
      <View style={styles.containerPicker}>
        {/* Selector de División */}
        <ModalSelector
          data={divisionOptions}
          initValue={selectedDivision || 'Selecciona División'}
          onChange={(option) => setSelectedDivision(option.key)}
          style={styles.picker}
          optionTextStyle={styles.pickerText}
          selectedItemTextStyle={styles.selectedItem}
          initValueTextStyle={styles.initValueTextStyle}
          animationType='fade'
          cancelText='Salir'
          cancelTextStyle={{ color: colors.black }}
          ref={divisionSelectorRef}
          accessible={true}
          touchableAccessible={true}
        >
          <TouchableOpacity style={styles.touchableContainer}>
            <Text style={styles.selectedItemText}>{selectedDivision || 'Selecciona División'}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </ModalSelector>

        {/* Selector de Torneo */}
        <ModalSelector
          data={tournamentOptions}
          initValue={selectedTournament || 'Selecciona Torneo'}
          onChange={(option) => setSelectedTournament(option.key)}
          style={styles.picker}
          optionTextStyle={styles.pickerText}
          selectedItemTextStyle={styles.selectedItem}
          initValueTextStyle={styles.initValueTextStyle}
          animationType='fade'
          cancelText='Salir'
          cancelTextStyle={{ color: colors.black }}
          ref={tournamentSelectorRef}
          accessible={true}
          touchableAccessible={true}
        >
          <TouchableOpacity style={styles.touchableContainer}>
            <Text style={styles.selectedItemText}>{selectedTournament || 'Selecciona Torneo'}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </ModalSelector>
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
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: colors.orange,
    borderWidth: 1,
  },
  selectedItem: {
    color: colors.orange,
  },
  selectedItemText: {
    color: colors.black,
    fontSize: 16,
  },
  picker: {
    width: '100%',
    borderRadius: 10,
    marginVertical: 5,
  },
  pickerText: {
    color: colors.black,
    textAlign: 'left',
  },
  initValueTextStyle: {
    color: colors.black,
    fontSize: 16,
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
