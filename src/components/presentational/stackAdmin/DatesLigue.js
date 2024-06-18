import { StyleSheet, ImageBackground, View, FlatList, Text } from 'react-native';
import { useContext, useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import { db } from '../../../app/services/firebase/config';
import colors from '../../../utils/globals/colors';
import DatesByCategoryAdm from '../DatesByCategoryAdm';
import { OrientationContext } from '../../../utils/globals/context';
import { format } from 'date-fns';
import ModalSelector from 'react-native-modal-selector';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DatesLigue = () => {
  const [categorySelected, setCategorySelected] = useState('Liga Casildense');
  const [selectedTournament, setSelectedTournament] = useState('Apertura');
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isError, setIsError] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division');
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false);
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const portrait = useContext(OrientationContext);
  const divisionSelectorRef = useRef(null)
  const tournamentSelectorRef = useRef(null)
  const dateSelectorRef = useRef(null)
  const [divisionOptions, setDivisionOptions] = useState([])
  const [tournamentOptions, setTournamentOptions] = useState([])

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
    if (datos && datos && datos?.[categorySelected]?.equipos) {
      return datos?.[categorySelected]?.equipos[id];
    }
    return null;
  };

  useEffect(() => {
    if (!pickerDataLoaded && datos ) {
      const partidosDelTorneo = datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || [];
      const fechasDisponibles = Object.keys(partidosDelTorneo).filter(key => !isNaN(key)).map(Number);
      const fechasMostradas = fechasDisponibles.filter(fecha => fecha >= 1);
      const primeraFechaDisponibleNoJugada = fechasMostradas.find(fecha => partidosDelTorneo[fecha] && !partidosDelTorneo[fecha].hasPlayed);
      setSelectedDate(primeraFechaDisponibleNoJugada || fechasMostradas[0]);
      setPickerDataLoaded(true);
    }
  }, [categorySelected, datos, pickerDataLoaded, selectedDivision, selectedTournament]);

  useEffect(() => {
    if (selectedDate !== null && datos) {
      const partidosDelTorneo = datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
      const encuentrosDeLaFecha = partidosDelTorneo[selectedDate]?.encuentros || [];
      const partidosConEquipos = encuentrosDeLaFecha.map(partido => ({
        ...partido,
        equipo1: getEquipo(partido.equipo1),
        equipo2: getEquipo(partido.equipo2),
      }));
      setFilteredPartidos(partidosConEquipos);
    }
  }, [selectedDate, datos, selectedDivision, selectedTournament]);

  const updateDate = (encounterId, newDate) => {
    const formattedDate = format(newDate, 'yyyy-MM-dd HH:mm:ss');
    const updatedDatos = { ...datos };
    const partidosDelTorneo = updatedDatos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament];
  
    let partido = null;
    let indexNum = null;
    for (let i = 1; i <= 15; i++) {
      if (partidosDelTorneo?.[i]) {
        partido = partidosDelTorneo[i].encuentros.find(encuentro => encuentro.id === encounterId);
        if (partido) {
          indexNum = i;
          break;
        }
      }
    }
  
    if (partido) {
      const encounterIndex = partidosDelTorneo[indexNum].encuentros.findIndex(encuentro => encuentro.id === encounterId);
      const encuentro = partidosDelTorneo[indexNum].encuentros[encounterIndex];
      encuentro.fecha = formattedDate;
  
      setDatos(updatedDatos);
  
      db.ref(`/datos/fixture/${categorySelected}/partidos/${selectedDivision}/${selectedTournament}/${indexNum}/encuentros/${encounterIndex}/fecha`)
        .set(formattedDate)
        .catch(error => console.error(error));
    }
  };
  
  useEffect(() => {
    if (datos && categorySelected) {
      const divisions = Object.keys(datos?.[categorySelected]?.partidos || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => {
          return a.label.localeCompare(b.label)
        })
      setDivisionOptions(divisions);
      setSelectedDivision(divisions.length > 0 ? divisions[0].key : null);
    }
  }, [datos, categorySelected]);

  useEffect(() => {
    if (datos && categorySelected && selectedDivision) {
      const tournaments = Object.keys(datos?.[categorySelected]?.partidos[selectedDivision] || {})
      .map(key => ({ key, label: key }))
      .sort((a, b) => {
        return a.label.localeCompare(b.label)
      })
      setTournamentOptions(tournaments)
      setSelectedTournament(tournaments.length > 0 ? tournaments[0].key : null)
    }
  }, [datos, categorySelected, selectedDivision])

  const dateOptions = categorySelected && datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament]
  ? Object.keys(datos?.[categorySelected]?.partidos[selectedDivision][selectedTournament])
      .filter(key => !isNaN(key) && Number(key) >= 1)
      .map(key => ({ key, label: `Fecha ${key}` }))
  : [];

  const updateScore = (encounterId, teamNumber, increment) => {
    const updatedDatos = { ...datos };
    const partidosDelTorneo = updatedDatos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament];
  
    if (!partidosDelTorneo) {
      console.error('Partidos del torneo no encontrados.');
      return;
    }
  
    let partido = null;
    let indexNum = null;
    for (let i = 1; i <= 15; i++) {
      if (partidosDelTorneo?.[i]) {
        partido = partidosDelTorneo[i].encuentros.find(encuentro => encuentro.id === encounterId);
        if (partido) {
          indexNum = i;
          break;
        }
      }
    }
  
    if (partido) {
      const encounterIndex = partidosDelTorneo[indexNum].encuentros.findIndex(encuentro => encuentro.id === encounterId);
      const equipoKey = `goles${teamNumber}`;
  
      // Initialize puntos if undefined
      if (partidosDelTorneo[indexNum].encuentros[encounterIndex][equipoKey] === undefined) {
        partidosDelTorneo[indexNum].encuentros[encounterIndex][equipoKey] = 0;
      }
  
      // Update puntos
      partidosDelTorneo[indexNum].encuentros[encounterIndex][equipoKey] = Math.max(0, partidosDelTorneo[indexNum].encuentros[encounterIndex][equipoKey] + increment);
  
      setDatos(updatedDatos);
  
      // Ensure puntos is defined before setting it
      db.ref(`/datos/fixture/${categorySelected}/partidos/${selectedDivision}/${selectedTournament}/${indexNum}/encuentros/${encounterIndex}/${equipoKey}`)
        .set(partidosDelTorneo[indexNum].encuentros[encounterIndex][equipoKey])
        .catch(error => console.error(error));
    } else {
      console.error('Partido no encontrado.');
    }
  };
  
  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')} />;
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />;


 

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
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
        <View  style={[styles.containerText, dateOptions.length === 0 ? styles.disabledPicker : null]}>
        <TouchableOpacity style={styles.touchableContainer} onPress={() => dateSelectorRef.current.open()}>
          <ModalSelector
            data={dateOptions}
            initValue={dateOptions.length > 0 ? `Fecha ${selectedDate}` : null}
            onChange={(option) => setSelectedDate(option.key) }
            optionTextStyle={styles.pickerText}
            style={styles.picker}
            selectStyle={{ borderWidth: 0 }}
            selectedItem={`Fecha ${selectedDate}`}
            selectedItemTextStyle={styles.selectedItem}
            initValueTextStyle={styles.initValueTextStyle}
            backdropPressToClose={true}
            animationType='fade'
            cancelText='Salir'
            cancelTextStyle={{ color: colors.black }}
            disabled={dateOptions.length === 0}
            ref={dateSelectorRef}
            
          />
          { dateOptions.length !== 0 ? (
            <Text style={styles.pickerArrow}>▼</Text>) : null
          }
        </TouchableOpacity>
          
          
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
  picker: {
    width: '100%',
    borderRadius: 10,
  },
  pickerText: {
    color: colors.black,
    textAlign: 'left'
  },
  initValueTextStyle: {
    color: colors.black,
  },
  pickerArrow: {
    color: colors.black,
    fontSize: 18,
  },
  containerFlatlist: {
    flex: 1, // Use flex to fill the remaining space
    width: '100%', // Ensure flat list takes full width
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    color: colors.orange,
  },
  disabledPicker: {
    backgroundColor: 'rgba(0,0,0,0.0)', 
    elevation: 0,
    borderWidth: 0,
  },
});
