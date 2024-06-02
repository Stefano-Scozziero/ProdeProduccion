import { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ImageBackground, Text, TouchableOpacity, Pressable } from 'react-native';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import DatesByCategory from '../DatesByCategory';
import { OrientationContext } from '../../../utils/globals/context';
import colors from '../../../utils/globals/colors';
import ModalAlert from '../modal/ModalAlert';
import { db } from '../../../app/services/firebase/config';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';

const PredictsByCategory = ({ navigation }) => {
  const [modalAlert, setModalAlert] = useState(false);
  const categorySelected = useSelector(state => state.category.selectedCategory);
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const portrait = useContext(OrientationContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division');
  const [selectedTournament, setSelectedTournament] = useState('Apertura');
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false);
  const [puntos, setPuntos] = useState({ eq1: {}, eq2: {} });
  const user = auth().currentUser;
  const [guardarPronosticos, setGuardarPronosticos] = useState(false);
  const [partidosEditados, setPartidosEditados] = useState({});

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture').on('value', (snapshot) => {
      if (snapshot.exists() && categorySelected !== null && selectedDivision !== null) {
        const data = snapshot.val();
        if (data[categorySelected]?.[selectedDivision]) {
          setDatos(data);
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
      db.ref('/datos/fixture').off('value', onValueChange);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
  }, []);

  const handleSumarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }));

    const nuevosPuntosEq1 = { ...puntos.eq1 };
    const nuevosPuntosEq2 = { ...puntos.eq2 };
    if (nuevosPuntosEq1[id] === undefined && nuevosPuntosEq2[id] === undefined) {
      nuevosPuntosEq1[id] = 0;
      nuevosPuntosEq2[id] = 0;
    } else {
      if (equipo === 'equipo1') {
        nuevosPuntosEq1[id] = (nuevosPuntosEq1[id] || 0) + 1;
      } else {
        nuevosPuntosEq2[id] = (nuevosPuntosEq2[id] || 0) + 1;
      }
    }
    setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 });
  };

  const handleRestarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }));

    const nuevosPuntosEq1 = { ...puntos.eq1 };
    const nuevosPuntosEq2 = { ...puntos.eq2 };

    if (!nuevosPuntosEq1[id] && !nuevosPuntosEq2[id]) {
      nuevosPuntosEq1[id] = 0;
      nuevosPuntosEq2[id] = 0;
    }

    if (equipo === 'equipo1') {
      nuevosPuntosEq1[id] = Math.max((nuevosPuntosEq1[id] || 0) - 1, 0);
    } else {
      nuevosPuntosEq2[id] = Math.max((nuevosPuntosEq2[id] || 0) - 1, 0);
    }

    setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 });
  };

  const guardarPronosticosEnDB = async () => {
    if (!categorySelected || !selectedDate || !filteredPartidos) return;

    try {
      const pronosticosRef = db.ref(`/profiles/${user.uid}/predicts/${categorySelected}/${selectedDivision}/${selectedTournament}/Fecha:${selectedDate}`);

      const snapshot = await pronosticosRef.once('value');
      const pronosticosExistentes = snapshot.val() || [];

      const pronosticosArray = filteredPartidos
        .filter(partido => partido !== null && partido !== undefined)
        .reduce((obj, partido) => {
          if (partidosEditados[partido.id]) {
            obj[partido.id] = {
              equipo1: {
                nombre: partido.equipo1.nombre,
                puntos: puntos.eq1.hasOwnProperty(partido.id) ? puntos.eq1[partido.id] : undefined
              },
              equipo2: {
                nombre: partido.equipo2.nombre,
                puntos: puntos.eq2.hasOwnProperty(partido.id) ? puntos.eq2[partido.id] : undefined
              }
            };
          } else {
            const pronosticoExistente = pronosticosExistentes[partido.id];
            if (pronosticoExistente) {
              obj[partido.id] = pronosticoExistente;
            }
          }
          return obj;
        }, {});

      await pronosticosRef.set(pronosticosArray);

      setGuardarPronosticos(false);
      setModalAlert(true);

    } catch (error) {
      console.error('Error al guardar los pronósticos:', error);
    }
  };

  useEffect(() => {
    setPuntos({ eq1: {}, eq2: {} });
    const pronosticosRef = db.ref(`/profiles/${user.uid}/predicts/${categorySelected}/${selectedDivision}/${selectedTournament}/Fecha:${selectedDate}`);

    const onValueChange = pronosticosRef.on('value', (snapshot) => {
      const pronosticosObj = snapshot.val();
      if (pronosticosObj) {
        const nuevosPuntosEq1 = {};
        const nuevosPuntosEq2 = {};

        Object.keys(pronosticosObj).forEach(id => {
          const pronostico = pronosticosObj[id];
          nuevosPuntosEq1[id] = pronostico.equipo1.puntos || 0;
          nuevosPuntosEq2[id] = pronostico.equipo2.puntos || 0;
        });

        setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 });
        setGuardarPronosticos(false);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      setGuardarPronosticos(false);
    }, (error) => {
      console.error('Error al cargar los pronósticos desde la base de datos:', error);
      setIsLoading(false);
    });

    return () => pronosticosRef.off('value', onValueChange);
  }, [categorySelected, selectedDate, selectedDivision, selectedTournament]);

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
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.[selectedTournament].partidos || [];
      const fechasDisponibles = partidosDelTorneo.map(partido => partido.fecha);
      const primeraFechaDisponibleNoJugada = partidosDelTorneo.find(partido => !partido.hasPlayed)?.fecha;
      setSelectedDate(primeraFechaDisponibleNoJugada || fechasDisponibles[0]);
      setPickerDataLoaded(true);
    }
  }, [categorySelected, datos, pickerDataLoaded, selectedDivision, selectedTournament]);

  useEffect(() => {
    if (datos && categorySelected && selectedDate && selectedDivision && selectedTournament) {
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.[selectedTournament].partidos || [];
      const partidosPorFecha = partidosDelTorneo.find(partido => partido.fecha === selectedDate);

      if (partidosPorFecha) {
        const encuentrosPorFecha = partidosPorFecha?.encuentros || [];
        setFilteredPartidos(encuentrosPorFecha);
      } else {
        setFilteredPartidos([]);
      }

      setIsLoading(false);
    } else {
      setFilteredPartidos([]);
    }
  }, [categorySelected, selectedDate, datos, selectedDivision, selectedTournament]);

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')} />;
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />;

  const divisionOptions = [
    { key: 'Primera Division', label: 'Primera Division' },
    { key: 'Reserva', label: 'Reserva' }
  ];

  const tournamentOptions = [
    { key: 'Apertura', label: 'Apertura' }
  ];

  const dateOptions = categorySelected && datos[categorySelected]?.[selectedDivision]?.[selectedTournament].partidos.map((partido, index) => ({
    key: partido.fecha,
    label: `Fecha ${partido.fecha}`
  }));

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
      {modalAlert && (
        <ModalAlert
          text="¡Pronósticos guardados exitosamente!"
          duration={2000}
          onClose={() => setModalAlert(false)}
        />
      )}
      <View style={styles.containerPicker}>
        <View style={styles.containerText}>
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
          />
          <Text style={styles.pickerArrow}>▼</Text>
        </View>
        <View style={styles.containerText}>
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
          />
          <Text style={styles.pickerArrow}>▼</Text>
        </View>
        <View style={styles.containerText}>
          <ModalSelector
            data={dateOptions}
            initValue={`Fecha ${selectedDate}`}
            onChange={(option) => setSelectedDate(option.key)}
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
          />
          <Text style={styles.pickerArrow}>▼</Text>
        </View>
      </View>
      
      <View style={styles.containerFlatlist}>
        <View style={styles.flatlistWrapper}>
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
        <TouchableOpacity activeOpacity={0.8} style={styles.guardarButton} onPress={guardarPronosticosEnDB}>
          <Text style={styles.guardarButtonText}>Guardar Pronósticos</Text>
        </TouchableOpacity>
      }
    </ImageBackground>
  );
}

export default PredictsByCategory;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPicker: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  landScape: {
    width: '100%',
    height: '60%',
  },
  containerText: {
    width: '90%',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
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
  selectedItem: {
    color: colors.orange,
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
    fontSize: 15, 
  },
  containerFlatlist: {
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  flatlistWrapper: {
    width: '95%',
  },
  guardarButton: {
    position: 'absolute',
    width: '90%',
    bottom: 20,
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  guardarButtonText: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});