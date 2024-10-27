import { StyleSheet, ImageBackground, View, FlatList, Text } from 'react-native';
import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import { database } from '../../../app/services/firebase/config';
import colors from '../../../utils/globals/colors';
import DatesByCategoryAdm from '../DatesByCategoryAdm';
import { OrientationContext } from '../../../utils/globals/context';
import { format } from 'date-fns';
import ModalSelector from 'react-native-modal-selector';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

const DatesLigue = () => {
  const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2FiconEsc.png?alt=media&token=4c508bf7-059e-451e-b726-045eaf79beae';
  const categorySelected = useSelector(state => state.category.selectedCategory);
  const [selectedTournament, setSelectedTournament] = useState('Apertura');
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubStage, setSelectedSubStage] = useState(null); // Renombrado
  const [isError, setIsError] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division');
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false);
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const portrait = useContext(OrientationContext);
  const divisionSelectorRef = useRef(null);
  const tournamentSelectorRef = useRef(null);
  const dateSelectorRef = useRef(null);
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

  const tournamentsWithoutDate = [
    'Cuartos de final',
    'Semifinal',
    'Final'
  ];

  // Función auxiliar para encontrar el camino del encuentro con logs
  const findEncounterPath = (partidosDelTorneo, encounterId) => {
    for (const [subEtapaKey, subEtapa] of Object.entries(partidosDelTorneo)) {
      // Ignorar sub-etapas inválidas como "0" o null
      if (subEtapaKey === '0' || !subEtapa) {
        continue;
      }
  
      if (subEtapa.encuentros && Array.isArray(subEtapa.encuentros)) {
        const encuentroIndex = subEtapa.encuentros.findIndex(encuentro => encuentro.id === encounterId);
        if (encuentroIndex !== -1) {
          return { subEtapaKey, encuentroIndex };
        }
      } else {
        console.warn(`'encuentros' no existe o no es un array en la sub-etapa "${subEtapaKey}".`);
      }
    }
    console.warn(`Encuentro ID ${encounterId} no encontrado en ninguna sub-etapa.`);
    return null;
  };
  

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture/').on('value', (snapshot) => {
      if (snapshot.exists() && categorySelected !== null) {
        const data = snapshot.val();
        if (data) {
          setDatos(data);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } else {
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          setDatos(false);
        }
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        setIsError(true);
      }
    }, (error) => {
      console.error(error);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      setIsError(true);
    });
    return () => {
      db.ref('/datos/fixture/').off('value', onValueChange);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
  }, [categorySelected]);

  const getEquipo = (id) => {
    if (id === 'Por definir') {
      return { nombre: 'Por definir', imagen: DEFAULT_IMAGE }; // URL de una imagen por defecto
    }
    if (datos && datos[categorySelected] && datos[categorySelected].equipos) {
      return datos[categorySelected].equipos[id] || { nombre: 'Por definir', imagen: DEFAULT_IMAGE };
    }
    return { nombre: 'Por definir', imagen: DEFAULT_IMAGE };
  };

  useEffect(() => {
    if (!pickerDataLoaded && datos) {
      const partidosDelTorneo = datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
      const subStagesAvailable = Object.keys(partidosDelTorneo).filter(key => key !== '0' && key !== 'lastMatchId');
  
      // Priorizar 'ida' si está disponible
      let defaultSubStage = null;
      if (subStagesAvailable.includes('ida')) {
        defaultSubStage = 'ida';
      } else {
        // Seleccionar la primera sub-etapa disponible que no ha sido jugada
        defaultSubStage = subStagesAvailable.find(subEtapa => partidosDelTorneo[subEtapa] && !partidosDelTorneo[subEtapa].hasPlayed) || subStagesAvailable[0];
      }
  
      setSelectedSubStage(defaultSubStage || null);
      setPickerDataLoaded(true);
    }
  }, [categorySelected, datos, pickerDataLoaded, selectedDivision, selectedTournament]);
  
  

  useEffect(() => {
    if (selectedSubStage !== null && datos) {
      const partidosDelTorneo = datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
      const encuentrosDeLaSubEtapa = partidosDelTorneo[selectedSubStage]?.encuentros || [];
      const partidosConEquipos = encuentrosDeLaSubEtapa.map(partido => ({
        ...partido,
        equipo1: getEquipo(partido.equipo1),
        equipo2: getEquipo(partido.equipo2),
      }));
      setFilteredPartidos(partidosConEquipos);
    }
  }, [selectedSubStage, datos, selectedDivision, selectedTournament]);

  useEffect(() => {
    if (datos && categorySelected && selectedDivision && selectedTournament) {
      if (selectedTournament.toLowerCase() === 'octavos de final') {
        // Preseleccionar 'ida' al seleccionar 'Octavos de final'
        setSelectedSubStage('ida');
      } else {
        // Para otros torneos, seleccionar la primera sub-etapa disponible no jugada o la primera sub-etapa
        const partidosDelTorneo = datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
        const subStagesAvailable = Object.keys(partidosDelTorneo).filter(key => key !== '0' && key !== 'lastMatchId'); // Excluir sub-etapas no válidas
  
        // Ordenar subStagesAvailable según dateOptions
        const sortedSubStages = dateOptions
          .map(option => option.key)
          .filter(key => subStagesAvailable.includes(key));
  
        // Encontrar la primera sub-etapa que no ha sido jugada
        const primeraSubEtapaDisponibleNoJugada = sortedSubStages.find(subEtapa => partidosDelTorneo[subEtapa] && !partidosDelTorneo[subEtapa].hasPlayed);
  
        // Seleccionar la sub-etapa disponible o la primera sub-etapa ordenada
        setSelectedSubStage(primeraSubEtapaDisponibleNoJugada || sortedSubStages[0] || null);
      }
    }
  }, [selectedTournament, categorySelected, datos, selectedDivision]);
  

  const updateDate = (encounterId, newDate) => {
    const formattedDate = format(newDate, 'yyyy-MM-dd HH:mm:ss');
    // Clonación profunda para evitar mutaciones directas
    const updatedDatos = JSON.parse(JSON.stringify(datos));
    const partidosDelTorneo = updatedDatos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament];

    if (!partidosDelTorneo) {
      console.error('Partidos del torneo no encontrados.');
      return;
    }

    const path = findEncounterPath(partidosDelTorneo, encounterId);

    if (path) {
      const { subEtapaKey, encuentroIndex } = path;
      console.log(`Sub-etapa encontrada: ${subEtapaKey}, Índice del encuentro: ${encuentroIndex}`);
      const encounterPath = `/datos/fixture/${categorySelected}/partidos/${selectedDivision}/${selectedTournament}/${subEtapaKey}/encuentros/${encuentroIndex}/fecha`;

      // Verificar que 'encuentros' existe y es un array
      if (updatedDatos[categorySelected].partidos[selectedDivision][selectedTournament][subEtapaKey].encuentros && 
          Array.isArray(updatedDatos[categorySelected].partidos[selectedDivision][selectedTournament][subEtapaKey].encuentros)) {
        
        updatedDatos[categorySelected].partidos[selectedDivision][selectedTournament][subEtapaKey].encuentros[encuentroIndex].fecha = formattedDate;
        setDatos(updatedDatos);

        // Actualizar en Firebase
        db.ref(encounterPath)
          .set(formattedDate)
          .then(() => console.log('Fecha actualizada exitosamente en Firebase.'))
          .catch(error => console.error('Error al actualizar fecha en Firebase:', error));
      } else {
        console.error(`'encuentros' no existe o no es un array en la sub-etapa "${subEtapaKey}".`);
      }
    } else {
      console.error('Encuentro no encontrado.');
    }
  };

  const updateScore = (encounterId, teamNumber, increment) => {
    // Clonación profunda para evitar mutaciones directas
    const updatedDatos = JSON.parse(JSON.stringify(datos));
    const partidosDelTorneo = updatedDatos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament];

    if (!partidosDelTorneo) {
      console.error('Partidos del torneo no encontrados.');
      return;
    }

    const path = findEncounterPath(partidosDelTorneo, encounterId);

    if (path) {
      const { subEtapaKey, encuentroIndex } = path;
      const encounter = partidosDelTorneo[subEtapaKey].encuentros[encuentroIndex];
      const equipoKey = `goles${teamNumber}`;

      // Inicializar goles si está indefinido
      if (encounter[equipoKey] === undefined) {
        encounter[equipoKey] = 0;
      }

      // Actualizar goles
      encounter[equipoKey] = Math.max(0, encounter[equipoKey] + increment);

      // Verificar que 'encuentros' existe y es un array
      if (updatedDatos[categorySelected].partidos[selectedDivision][selectedTournament][subEtapaKey].encuentros && 
          Array.isArray(updatedDatos[categorySelected].partidos[selectedDivision][selectedTournament][subEtapaKey].encuentros)) {
        
        updatedDatos[categorySelected].partidos[selectedDivision][selectedTournament][subEtapaKey].encuentros[encuentroIndex][equipoKey] = encounter[equipoKey];
        setDatos(updatedDatos);

        // Actualizar en Firebase
        db.ref(`/datos/fixture/${categorySelected}/partidos/${selectedDivision}/${selectedTournament}/${subEtapaKey}/encuentros/${encuentroIndex}/${equipoKey}`)
          .set(encounter[equipoKey])
          .then(() => console.log(`Goles del equipo ${teamNumber} actualizados exitosamente en Firebase.`))
          .catch(error => console.error('Error al actualizar goles en Firebase:', error));
      } else {
        console.error(`'encuentros' no existe o no es un array en la sub-etapa "${subEtapaKey}".`);
      }
    } else {
      console.error('Encuentro no encontrado.');
    }
  };

  useEffect(() => {
    if (datos && categorySelected) {
      const divisions = Object.keys(datos?.[categorySelected]?.partidos || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDivisionOptions(divisions);

      // Solo actualizar selectedDivision si no está establecido o ya no es válido
      if (!selectedDivision || !divisions.find(d => d.key === selectedDivision)) {
        setSelectedDivision(divisions.length > 0 ? divisions[0].key : null);
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

  const subStagePriority = {
    'ida': 1,
    'vuelta': 2,
    // Puedes agregar más sub-etapas nombradas aquí si es necesario
  };

  const dateOptions = useMemo(() => {
    if (categorySelected && datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament]) {
      return Object.keys(datos[categorySelected].partidos[selectedDivision][selectedTournament])
        .filter(key => key !== '0' && key !== 'lastMatchId')
        .map(key => ({
          key: key.toString(),
          label: key.startsWith('Fecha: ') ? key.replace('Fecha: ', 'Fecha ') : key.charAt(0).toUpperCase() + key.slice(1),
        }))
        .sort((a, b) => {
          const keyA = a.key.toLowerCase();
          const keyB = b.key.toLowerCase();
          const priorityA = subStagePriority[keyA] || 999;
          const priorityB = subStagePriority[keyB] || 999;
  
          if (priorityA !== priorityB) return priorityA - priorityB;
  
          const numA = parseInt(a.key.replace('Fecha: ', ''), 10);
          const numB = parseInt(b.key.replace('Fecha: ', ''), 10);
  
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        });
    }
    return [];
  }, [categorySelected, datos, selectedDivision, selectedTournament]);
  





  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" />;
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />;

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
      <View style={styles.containerPicker}>
        <View style={styles.containerText}>
          <ModalSelector
            data={divisionOptions}
            initValue={selectedDivision}
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
              <Text style={styles.selectedItemText}>{selectedDivision}</Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </ModalSelector>
        </View>
        <View style={styles.containerText}>
          <ModalSelector
            data={tournamentOptions}
            initValue={selectedTournament}
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
              <Text style={styles.selectedItemText}>{selectedTournament}</Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
          </ModalSelector>
        </View>
        <View style={[styles.containerText, dateOptions.length === 0 ? styles.disabledPicker : null]}>
          {!tournamentsWithoutDate.includes(selectedTournament) && (
            <ModalSelector
            data={dateOptions}
            initValue={
              dateOptions.length > 0
                ? selectedSubStage
                  ? selectedSubStage.startsWith('Fecha: ')
                    ? `Fecha ${selectedSubStage.replace('Fecha: ', '')}`
                    : selectedSubStage.charAt(0).toUpperCase() + selectedSubStage.slice(1)
                  : 'Selecciona una Sub-etapa'
                : 'Selecciona una Sub-etapa'
            }
            onChange={(option) => setSelectedSubStage(option.key)}
            style={
              dateOptions.length === 0 ? styles.disabledPicker : styles.picker
            }
            optionTextStyle={styles.pickerText}
            selectedItemTextStyle={styles.selectedItem}
            initValueTextStyle={styles.initValueTextStyle}
            animationType="fade"
            cancelText="Salir"
            cancelTextStyle={{ color: colors.black }}
            disabled={dateOptions.length === 0}
            ref={dateSelectorRef}
            accessible={true}
            touchableAccessible={true}
          >
            <TouchableOpacity
              style={styles.touchableContainer}
              disabled={dateOptions.length === 0}
            >
              <Text style={styles.selectedItemText}>
                {dateOptions.length > 0
                  ? selectedSubStage
                    ? selectedSubStage.startsWith('Fecha: ')
                      ? `Fecha ${selectedSubStage.replace('Fecha: ', '')}`
                      : selectedSubStage.charAt(0).toUpperCase() + selectedSubStage.slice(1)
                    : 'Selecciona una Sub-etapa'
                  : 'Sin Sub-etapas Disponibles'}
              </Text>
              {dateOptions.length !== 0 && (
                <Text style={styles.pickerArrow}>▼</Text>
              )}
            </TouchableOpacity>
          </ModalSelector>
          
          )}
        </View>
      </View>

      <View style={styles.containerFlatlist}>
        <FlatList
          data={filteredPartidos}
          renderItem={({ item }) => (
            <DatesByCategoryAdm
              encuentros={item}
              updateScore={updateScore}
              updateDate={updateDate}
            />
          )}
          ListEmptyComponent={<Text style={{ fontSize: 20 }}>No hay encuentros disponibles</Text>}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatlistWrapper}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={8}
        />
      </View>
    </ImageBackground>
  );
};

export default DatesLigue;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPicker: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  landScape: {
    width: '100%',
    height: '60%',
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
  picker: {
    width: '100%',
    borderRadius: 10,
    marginVertical: 5,
  },
  pickerText: {
    color: colors.black,
    textAlign: 'left'
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
    flex: 1, // Use flex to fill the remaining space
    width: '100%', // Ensure flat list takes full width
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItemText: {
    color: colors.black,
    fontSize: 16,
  },
  selectedItem: {
    color: colors.orange,
  },
  disabledPicker: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderColor: colors.gray,
  },
});
