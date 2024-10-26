import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import { OrientationContext } from '../../../utils/globals/context';
import ModalSelector from 'react-native-modal-selector';
import CardFixture from '../CardFixture';
import { database } from '../../../app/services/firebase/config';
import { useSelector } from 'react-redux';
import colors from '../../../utils/globals/colors';

const FixtureDates = ({ navigation }) => {
  const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2FiconEsc.png?alt=media&token=4c508bf7-059e-451e-b726-045eaf79beae';
  const categorySelected = useSelector(state => state.category.selectedCategory);
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const portrait = useContext(OrientationContext);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division');
  const [selectedTournament, setSelectedTournament] = useState('Apertura');
  const [filteredFechas, setFilteredFechas] = useState([]);
  const divisionSelectorRef = useRef(null);
  const tournamentSelectorRef = useRef(null);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [tournamentOptions, setTournamentOptions] = useState([]);
  const db = database();
  const stagesOrder = [
    'Apertura',
    'Clausura',
    'Repechaje Apertura',
    'Repechaje Clausura',
    'Octavos de final',
    'Cuartos de final',
    'Semifinal',
    'Final'
  ];

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture').on('value', (snapshot) => {
      if (snapshot.exists() && categorySelected !== null) {
        const data = snapshot.val();
        if (data[categorySelected]) {
          setDatos(data);
          setIsLoading(false);
        } else {
          setDatos(null);
          setIsLoading(false);
        }
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }, (error) => {
      console.error(error);
      setIsError(true);
      setIsLoading(false);
    });

    return () => {
      db.ref('/datos/fixture').off('value', onValueChange);
    };
  }, [categorySelected]);

  const getEquipo = (id) => {
    if (id === 'Por definir') {
      return { nombre: 'Por Definir', imagen: DEFAULT_IMAGE };
    }
    if (datos && datos[categorySelected] && datos[categorySelected].equipos) {
      return datos[categorySelected].equipos[id] || { nombre: 'Por Definir', imagen: DEFAULT_IMAGE };
    }
    return { nombre: 'Por Definir', imagen: DEFAULT_IMAGE };
  };

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
      const torneosExcluidos = ['lastMatchId']; // Lista de torneos a excluir

      const tournaments = Object.keys(datos?.[categorySelected]?.partidos[selectedDivision] || {})
        .filter((key) => !torneosExcluidos.includes(key)) // Filtramos los torneos no deseados
        .map((key) => ({ key, label: key }))
        .sort((a, b) => {
          const indexA = stagesOrder.indexOf(a.key);
          const indexB = stagesOrder.indexOf(b.key);

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }

          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;

          return a.label.localeCompare(b.label);
        });

      setTournamentOptions(tournaments);

      if (!selectedTournament || !tournaments.find((t) => t.key === selectedTournament)) {
        setSelectedTournament(tournaments.length > 0 ? tournaments[0].key : null);
      }
    }
  }, [datos, categorySelected, selectedDivision]);

  useEffect(() => {
    if (datos && categorySelected) {
      const partidosDelTorneo = datos[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
      let fechasConPartidos = [];
  
      const fechas = Object.keys(partidosDelTorneo);
  
      // Separar 'Ida' y 'Vuelta' del resto de las fechas
      const faseIda = fechas.find(fecha => fecha.toLowerCase() === 'ida');
      const faseVuelta = fechas.find(fecha => fecha.toLowerCase() === 'vuelta');
      const stages = fechas.filter(fecha => fecha.toLowerCase().startsWith('stage'));
      const fechasNumericas = fechas
        .filter(fecha => fecha.toLowerCase().startsWith('fecha')) // Solo fechas numéricas
        .sort((a, b) => {
          const numA = parseInt(a.replace('Fecha: ', ''), 10);
          const numB = parseInt(b.replace('Fecha: ', ''), 10);
          return numA - numB; // Ordenar de menor a mayor
        });
  
      // Primero agregamos 'Ida' y 'Vuelta' si existen
      if (faseIda) {
        const encuentrosIda = partidosDelTorneo[faseIda]?.encuentros || [];
        const partidosIdaConEquipos = encuentrosIda.map(partido => ({
          ...partido,
          equipo1: getEquipo(partido.equipo1),
          equipo2: getEquipo(partido.equipo2),
          tipo: 'Ida',
        }));
        fechasConPartidos.push({ fecha: 'Ida', partidos: partidosIdaConEquipos });
      }
  
      if (faseVuelta) {
        const encuentrosVuelta = partidosDelTorneo[faseVuelta]?.encuentros || [];
        const partidosVueltaConEquipos = encuentrosVuelta.map(partido => ({
          ...partido,
          equipo1: getEquipo(partido.equipo1),
          equipo2: getEquipo(partido.equipo2),
          tipo: 'Vuelta',
        }));
        fechasConPartidos.push({ fecha: 'Vuelta', partidos: partidosVueltaConEquipos });
      }
  
      // Agregar los stages en el orden que aparezcan
      stages.forEach(stage => {
        const encuentrosStage = partidosDelTorneo[stage]?.encuentros || [];
        const partidosStageConEquipos = encuentrosStage.map(partido => ({
          ...partido,
          equipo1: getEquipo(partido.equipo1),
          equipo2: getEquipo(partido.equipo2),
        }));
        fechasConPartidos.push({ fecha: stage, partidos: partidosStageConEquipos, mostrarFecha: false });
      });
  
      // Luego agregamos las fechas numéricas en orden
      fechasNumericas.forEach(fecha => {
        const encuentrosDeLaFecha = partidosDelTorneo[fecha]?.encuentros || [];
        const partidosConEquipos = encuentrosDeLaFecha.map(partido => ({
          ...partido,
          equipo1: getEquipo(partido.equipo1),
          equipo2: getEquipo(partido.equipo2),
        }));
        fechasConPartidos.push({ fecha, partidos: partidosConEquipos, mostrarFecha: true });
      });
  
      setFilteredFechas(fechasConPartidos);
    }
  }, [datos, categorySelected, selectedDivision, selectedTournament]);
  
  
  
  

  const renderItem = ({ item }) => {
    const esStage = item.fecha.toLowerCase().startsWith('stage'); // Detectar solo los stages
  
    return (
      <View style={styles.fechaContainer}>
        {/* Mostramos la fecha solo si no es un stage */}
        {!esStage && <Text style={styles.fechaTitle}>{item.fecha}</Text>}
        {item.partidos.length > 0 ? (
          item.partidos.map((partido, index) => (
            <CardFixture 
              key={`partido-${partido.id || index}`} 
              encuentro={partido} 
              tipo={partido.tipo} 
            />
          ))
        ) : (
          <Text style={styles.emptyListText}>No hay encuentros disponibles</Text>
        )}
      </View>
    );
  };
  
  
  
  

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Home')} />;
  if (!datos) return <EmptyListComponent message="No hay datos disponibles" />;

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
  );
};

export default FixtureDates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: colors.background, // Asegúrate de tener un color de fondo adecuado
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
    marginVertical: 5,
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
  fechaContainer: {
    backgroundColor: colors.blackGray,
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
  },
  fechaTitle: {
    fontSize: 18,
    color: colors.white,
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyListText: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.gray, // Asegúrate de tener un color adecuado
  },
});
