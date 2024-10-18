import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, FlatList, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import { OrientationContext } from '../../../utils/globals/context';
import ModalSelector from 'react-native-modal-selector';
import { database } from '../../../app/services/firebase/config';
import colors from '../../../utils/globals/colors';
import DatesByLeader from './DatesByLeader';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const LeaderBoard = ({ navigation }) => {
  const categorySelected = useSelector(state => state.category.selectedCategory);
  
  // Estados para los datos
  const [positionsData, setPositionsData] = useState(null);
  const [fixtureData, setFixtureData] = useState(null);
  const [teams, setTeams] = useState({});
  
  // Estados para la UI
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const portrait = useContext(OrientationContext);
  
  // Estados para selecciones
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  
  const [positions, setPositions] = useState([]);
  
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [tournamentOptions, setTournamentOptions] = useState([]);
  
  const db = database();
  
  // Refs para los selectores
  const divisionSelectorRef = useRef(null);
  const tournamentSelectorRef = useRef(null);
  
  // Función para obtener datos desde Firebase
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const posicionesRef = db.ref('/datos/positions');
      const equiposRef = db.ref(`/datos/fixture/${categorySelected}/equipos`);
      const fixtureRef = db.ref('/datos/fixture');
      
      const [posicionesSnapshot, equiposSnapshot, fixtureSnapshot] = await Promise.all([
        posicionesRef.once('value'),
        equiposRef.once('value'),
        fixtureRef.once('value'),
      ]);
      
      if (posicionesSnapshot.exists() && categorySelected && fixtureSnapshot.exists()) {
        setPositionsData(posicionesSnapshot.val());
        setTeams(equiposSnapshot.val() || {});
        setFixtureData(fixtureSnapshot.val());
      } else {
        setPositionsData(null);
        setFixtureData(null);
        setTeams({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [db, categorySelected]);
  
  // Efecto para obtener datos cuando cambia la categoría
  useEffect(() => {
    if (categorySelected) {
      fetchData();
    } else {
      setPositionsData(null);
      setFixtureData(null);
      setTeams({});
      setIsLoading(false);
    }
  }, [categorySelected, fetchData]);
  
  // Efecto para actualizar las opciones de divisiones
  useEffect(() => {
    if (fixtureData && categorySelected) {
      const divisions = Object.keys(fixtureData[categorySelected]?.partidos || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDivisionOptions(divisions);
      if (divisions.length > 0) {
        setSelectedDivision(divisions[0].key);
      } else {
        setSelectedDivision(null);
      }
    }
  }, [fixtureData, categorySelected]);
  
  // Efecto para actualizar las opciones de torneos
  useEffect(() => {
    if (fixtureData && categorySelected && selectedDivision) {
      const tournaments = Object.keys(fixtureData[categorySelected]?.partidos[selectedDivision] || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setTournamentOptions(tournaments);
      if (tournaments.length > 0) {
        setSelectedTournament(tournaments[0].key);
      } else {
        setSelectedTournament(null);
      }
    }
  }, [fixtureData, categorySelected, selectedDivision]);
  
  // Efecto para ordenar y combinar posiciones
  useEffect(() => {
    if (positionsData && categorySelected && teams && selectedDivision && selectedTournament) {
      const posiciones = positionsData[categorySelected]?.[selectedDivision]?.[selectedTournament]?.equipos || {};
      const sortedPositions = Object.values(posiciones).sort((a, b) => {
        if (b.puntos === a.puntos) {
          const diffA = a.golesFavor - a.golesContra;
          const diffB = b.golesFavor - b.golesContra;
          if (diffB === diffA) {
            return b.golesFavor - a.golesFavor;
          }
          return diffB - diffA;
        }
        return b.puntos - a.puntos;
      });
      const combinedPositions = sortedPositions.map(posicion => ({
        ...posicion,
        ...teams[posicion.nombre],
      }));
      setPositions(combinedPositions);
    } else {
      setPositions([]);
    }
  }, [positionsData, categorySelected, selectedDivision, selectedTournament, teams]);
  
  // Función de reintento
  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  // Verificar si hay datos disponibles para renderizar los modales
  const hasDataAvailable = fixtureData && fixtureData[categorySelected] && divisionOptions.length > 0 && tournamentOptions.length > 0;
  
  // Renderizado condicional basado en el estado
  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={handleRetry} />;
  if (!hasDataAvailable) return <EmptyListComponent message="No hay datos disponibles" />;
  
  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
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
      
      {positions.length > 0 && (
        <View style={styles.header}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.headerText}>Pos.</Text>
            <Text style={styles.headerText}></Text>
            <Text style={styles.headerText}>Club</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
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
          keyExtractor={(item) => `posicion-${item.nombre}-${item.id || item.key}`} // Asegúrate de que cada item tenga un identificador único
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
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center'
  },
  mainLandScape: {
    flexDirection: 'row'
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
  selectedItemText: {
    color: colors.black,
    fontSize: 16,
  }
});
