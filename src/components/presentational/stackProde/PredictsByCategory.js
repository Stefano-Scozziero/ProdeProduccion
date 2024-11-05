import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, ImageBackground, Text, TouchableOpacity } from 'react-native';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import DatesByCategory from './DatesByCategory';
import { OrientationContext } from '../../../utils/globals/context';
import colors from '../../../utils/globals/colors';
import ModalAlert from '../modal/ModalAlert';
import { database, auth } from '../../../app/services/firebase/config';
import { useSelector } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import { Entypo, AntDesign } from '@expo/vector-icons';

const PredictsByCategory = ({ navigation }) => {
  const [modalAlert, setModalAlert] = useState(false);
  const categorySelected = useSelector((state) => state.category.selectedCategory);
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const portrait = useContext(OrientationContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division');
  const [selectedTournament, setSelectedTournament] = useState('Apertura');
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const [puntos, setPuntos] = useState({ eq1: {}, eq2: {} });
  const [puntosWin, setPuntosWin] = useState({});
  const user = auth().currentUser;
  const db = database();
  const [guardarPronosticos, setGuardarPronosticos] = useState(false);
  const [partidosEditados, setPartidosEditados] = useState({});
  const DEFAULT_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2FiconEsc.png?alt=media&token=4c508bf7-059e-451e-b726-045eaf79beae';
  const divisionSelectorRef = useRef(null);
  const tournamentSelectorRef = useRef(null);
  const dateSelectorRef = useRef(null);
  const [isEditable, setIsEditable] = useState(false);
  const [faseHasPlayed, setFaseHasPlayed] = useState(false);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [tournamentOptions, setTournamentOptions] = useState([]);
  const stagesOrder = [
    'Apertura',
    'Clausura',
    'Repechaje Apertura',
    'Repechaje Clausura',
    'Octavos de final',
    'Cuartos de final',
    'Semifinal',
    'Final',
  ];
  const tournamentsWithHomeAway = [
    'Octavos de final',
    'Cuartos de final',
    'Semifinal',
    'Repechaje Apertura',
    'Repechaje Clausura',
  ];
  const tournamentsWithoutDate = ['Final'];

  useEffect(() => {
    const fixtureRef = db.ref('/datos/fixture');

    const onValueChange = fixtureRef.on(
      'value',
      (snapshot) => {
        if (snapshot.exists() && categorySelected !== null) {
          const data = snapshot.val();
          if (data[categorySelected]) {
            setDatos(data);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          } else {
            setDatos(false);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          }
        } else {
          setIsError(true);
          setIsLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setIsError(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    );

    return () => {
      fixtureRef.off('value', onValueChange);
    };
  }, [categorySelected]);
  

  const getEquipo = (id) => {
    if (id === 'Por definir') {
      return { nombre: 'Por definir', imagen: DEFAULT_IMAGE };
    }
    if (datos && datos[categorySelected] && datos[categorySelected].equipos) {
      return datos[categorySelected].equipos[id] || {
        nombre: 'Por definir',
        imagen: DEFAULT_IMAGE,
      };
    }
    return { nombre: 'Por definir', imagen: DEFAULT_IMAGE };
  };

  const handleSumarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }));
  
    setPuntos(prev => {
      const eq1 = { ...prev.eq1 };
      const eq2 = { ...prev.eq2 };
      eq1[id] = equipo === 'equipo1' ? (eq1[id] || 0) + 1 : (eq1[id] || 0);
      eq2[id] = equipo === 'equipo2' ? (eq2[id] || 0) + 1 : (eq2[id] || 0);
      return { eq1, eq2 };
    });
  };
  
  const handleRestarPuntos = (equipo, id) => {
    setPartidosEditados(prev => ({ ...prev, [id]: true }));
  
    setPuntos(prev => {
      const eq1 = { ...prev.eq1 };
      const eq2 = { ...prev.eq2 };
      eq1[id] = equipo === 'equipo1' ? Math.max((eq1[id] || 0) - 1, 0) : (eq1[id] || 0);
      eq2[id] = equipo === 'equipo2' ? Math.max((eq2[id] || 0) - 1, 0) : (eq2[id] || 0);
      return { eq1, eq2 };
    });
  };
  

  const guardarPronosticosEnDB = async () => {
    if (!categorySelected || !selectedDate || !filteredPartidos) return;
  
    try {
      let fechaKey;
      if (tournamentsWithHomeAway.includes(selectedTournament)) {
        fechaKey = selectedDate;
      } else {
        fechaKey = `Fecha:${selectedDate}`;
      }
  
      const pronosticosRef = db.ref(
        `/profiles/${user.uid}/prode/predicts/${categorySelected}/${selectedDivision}/${selectedTournament}/${fechaKey}`
      );
  
      const snapshot = await pronosticosRef.once('value');
      const pronosticosExistentes = snapshot.val() || {};
  
      const pronosticosArray = filteredPartidos
        .filter(
          (partido) =>
            partido &&
            partido.equipo1.nombre !== 'Por definir' &&
            partido.equipo2.nombre !== 'Por definir'
        )
        .reduce((obj, partido) => {
          if (partidosEditados[partido.id]) {
            obj[partido.id.toString()] = {
              equipo1: {
                nombre: partido.equipo1.nombre,
                puntos: puntos.eq1[partido.id] || 0,
              },
              equipo2: {
                nombre: partido.equipo2.nombre,
                puntos: puntos.eq2[partido.id] || 0,
              },
              processed: false,
              points: 0,
              save: true, // Guardamos el campo 'save' como true
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
      setIsEditable(false); // Deshabilitamos la edición después de guardar
    } catch (error) {
      console.error('Error al guardar los pronósticos:', error);
    }
  };
  
  

  useEffect(() => {
    setPuntos({ eq1: {}, eq2: {} });
    setPuntosWin({});
    setIsLoading(true);

    let fechaKey;
    if (tournamentsWithHomeAway.includes(selectedTournament)) {
      fechaKey = selectedDate;
    } else {
      fechaKey = `Fecha:${selectedDate}`;
    }

    const pronosticosRef = db.ref(
      `/profiles/${user.uid}/prode/predicts/${categorySelected}/${selectedDivision}/${selectedTournament}/${fechaKey}`
    );

    const onValueChange = pronosticosRef.on(
      'value',
      (snapshot) => {
        const pronosticosObj = snapshot.val();
        if (pronosticosObj) {
          const nuevosPuntosEq1 = {};
          const nuevosPuntosEq2 = {};
          const nuevosPuntosWin = {};
          let save = false;
  
          Object.keys(pronosticosObj).forEach((id) => {
            const pronostico = pronosticosObj[id];
            if (pronostico) {
              nuevosPuntosEq1[id] = pronostico.equipo1.puntos || 0;
              nuevosPuntosEq2[id] = pronostico.equipo2.puntos || 0;
              nuevosPuntosWin[id] = pronostico.points || 0;
              if (pronostico.save) {
                save = true;
              }
            }
          });
  
          setPuntos({ eq1: nuevosPuntosEq1, eq2: nuevosPuntosEq2 });
          setPuntosWin(nuevosPuntosWin);
          setGuardarPronosticos(false);
          setIsEditable(!save && !faseHasPlayed); // Si 'save' es true, 'isEditable' es false
        } else {
          setPuntos({ eq1: {}, eq2: {} });
          setPuntosWin({});
          setIsEditable(true); // Si no hay pronósticos, permitimos la edición
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      },
      (error) => {
        console.error('Error al cargar los pronósticos desde la base de datos:', error);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    );
  
    return () => pronosticosRef.off('value', onValueChange);
  }, [
    user.uid,
    categorySelected,
    selectedDate,
    selectedDivision,
    selectedTournament,
  ]);

  useEffect(() => {
    if (datos && categorySelected && selectedDivision && selectedTournament) {
      let hasPlayed = false;
      const partidosDelTorneo = datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament] || {};
  
      if (tournamentsWithHomeAway.includes(selectedTournament)) {
        // Torneos con 'ida' y 'vuelta'
        const fases = ['ida', 'vuelta'];
        hasPlayed = fases.every(fase => {
          const faseData = partidosDelTorneo[fase];
          return faseData?.hasPlayed || false;
        });
      } else {
        // Torneos con fechas
        const fechas = Object.keys(partidosDelTorneo).filter(fecha => fecha !== '0');
        hasPlayed = fechas.every(fecha => {
          const faseData = partidosDelTorneo[fecha];
          return faseData?.hasPlayed || false;
        });
      }
      setFaseHasPlayed(hasPlayed);
    }
  }, [datos, categorySelected, selectedDivision, selectedTournament]);
  
  
  useEffect(() => {
    const puntosEq1Definidos = Object.values(puntos.eq1).length > 0;
    const puntosEq2Definidos = Object.values(puntos.eq2).length > 0;

    setGuardarPronosticos(puntosEq1Definidos || puntosEq2Definidos);
  }, [puntos]);

  useEffect(() => {
    if (datos && categorySelected) {
      const divisions = Object.keys(datos?.[categorySelected]?.partidos || {})
        .map((key) => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDivisionOptions(divisions);

      if (!selectedDivision || !divisions.find((d) => d.key === selectedDivision)) {
        setSelectedDivision(divisions.length > 0 ? divisions[0].key : null);
      }
    }
  }, [datos, categorySelected]);

  const dateOptions =
    categorySelected &&
    datos?.[categorySelected]?.partidos?.[selectedDivision]?.[selectedTournament]
      ? Object.keys(
          datos[categorySelected].partidos[selectedDivision][selectedTournament]
        )
          .filter((fecha) => fecha !== '0')
          .sort((a, b) => {
            if (a === 'ida') return -1;
            if (b === 'ida') return 1;

            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
          })
          .map((key) => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
          }))
      : [];

  useEffect(() => {
    if (datos && categorySelected && selectedDivision) {
      const torneosExcluidos = ['lastMatchId'];

      const tournaments = Object.keys(
        datos?.[categorySelected]?.partidos[selectedDivision] || {}
      )
        .filter((key) => !torneosExcluidos.includes(key))
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

      if (
        !selectedTournament ||
        !tournaments.find((t) => t.key === selectedTournament)
      ) {
        setSelectedTournament(tournaments.length > 0 ? tournaments[0].key : null);
      }
    }
  }, [datos, categorySelected, selectedDivision]);

  useEffect(() => {
    if (datos && categorySelected && selectedDivision && selectedTournament) {
      if (tournamentsWithHomeAway.includes(selectedTournament)) {
        if (selectedDate !== 'ida' && selectedDate !== 'vuelta') {
          setSelectedDate('ida');
        }
      } else {
        const partidosDelTorneo =
          datos[categorySelected]?.partidos?.[selectedDivision]?.[
            selectedTournament
          ] || {};
        const fechasDisponibles = Object.keys(partidosDelTorneo)
          .filter((fecha) => fecha !== '0')
          .sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.match(/\d+/)?.[0] || 0);
            return numA - numB;
          });
        if (!fechasDisponibles.includes(selectedDate)) {
          setSelectedDate(fechasDisponibles[0]);
        }
      }
    }
  }, [selectedTournament, categorySelected, datos, selectedDivision]);

  useEffect(() => {
    if (selectedDate !== null && datos && categorySelected) {
      const partidosDelTorneo =
        datos?.[categorySelected]?.partidos?.[selectedDivision]?.[
          selectedTournament
        ] || {};
      const encuentrosDeLaFecha = partidosDelTorneo?.[selectedDate]?.encuentros || [];
      const partidosConEquipos = encuentrosDeLaFecha.map((partido) => ({
        ...partido,
        equipo1: getEquipo(partido.equipo1),
        equipo2: getEquipo(partido.equipo2),
      }));
      setFilteredPartidos(partidosConEquipos);
    }
  }, [selectedDate, datos, categorySelected, selectedDivision, selectedTournament]);

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError)
    return (
      <Error
        message="¡Ups! Algo salió mal."
        textButton="Recargar"
        onRetry={() => navigation.navigate('Home')}
      />
    );
  if (!datos) return <EmptyListComponent message="No hay datos disponibles" />;

  return (
    <ImageBackground
      source={require('../../../../assets/fondodefinitivo.png')}
      style={[styles.container, !portrait && styles.landScape]}
    >
      {modalAlert && (
        <ModalAlert
          text="¡Pronósticos guardados exitosamente!"
          duration={2000}
          onClose={() => setModalAlert(false)}
        />
      )}
      <View style={styles.containerPicker}>
        <ModalSelector
          data={divisionOptions}
          initValue={selectedDivision}
          onChange={(option) => setSelectedDivision(option.key)}
          style={styles.picker}
          optionTextStyle={styles.pickerText}
          selectedItemTextStyle={styles.selectedItem}
          initValueTextStyle={styles.initValueTextStyle}
          animationType="fade"
          cancelText="Salir"
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

        <ModalSelector
          data={tournamentOptions}
          initValue={selectedTournament}
          onChange={(option) => setSelectedTournament(option.key)}
          style={styles.picker}
          optionTextStyle={styles.pickerText}
          selectedItemTextStyle={styles.selectedItem}
          initValueTextStyle={styles.initValueTextStyle}
          animationType="fade"
          cancelText="Salir"
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

        {!tournamentsWithoutDate.includes(selectedTournament) && (
          <ModalSelector
            data={dateOptions}
            initValue={
              dateOptions.length > 0
                ? selectedDate
                  ? tournamentsWithHomeAway.includes(selectedTournament)
                    ? `${selectedDate.charAt(0).toUpperCase() + selectedDate.slice(1)}`
                    : `${selectedDate}`
                  : 'Selecciona una Fecha'
                : 'Selecciona una Fecha'
            }
            onChange={(option) => setSelectedDate(option.key)}
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
                  ? selectedDate
                    ? tournamentsWithHomeAway.includes(selectedTournament)
                      ? `${selectedDate.charAt(0).toUpperCase() + selectedDate.slice(1)}`
                      : `${selectedDate}`
                    : 'Selecciona una Fecha'
                  : 'Sin Fechas Disponibles'}
              </Text>
              {dateOptions.length !== 0 && (
                <Text style={styles.pickerArrow}>▼</Text>
              )}
            </TouchableOpacity>
          </ModalSelector>
        )}
        {!isEditable && !faseHasPlayed && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editarButton}
            onPress={() => setIsEditable(true)}
          >
            <View style={styles.editarView}>
              <Entypo name='edit' size={25} color={colors.black} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          data={filteredPartidos}
          keyExtractor={(item) => `partidos-${item.id}`}
          renderItem={({ item }) => (
            <DatesByCategory
              encuentros={item}
              onSumarPuntos={(equipo) => handleSumarPuntos(equipo, item.id)}
              onRestarPuntos={(equipo) => handleRestarPuntos(equipo, item.id)}
              puntosEq1={puntos.eq1[item.id]}
              puntosEq2={puntos.eq2[item.id]}
              puntosWin={puntosWin[item.id] || 0}
              isEditable={isEditable} // Pasamos isEditable al hijo
              faseHasPlayed={faseHasPlayed} // Pasamos isEditable al hijo
            />
          )}
          ListEmptyComponent={
            <Text style={{ fontSize: 20, alignItems: 'center', justifyContent: 'center' }}>No hay encuentros disponibles</Text>
          }
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={8}
        />

        {guardarPronosticos && Object.keys(partidosEditados).length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.guardarButton}
            onPress={guardarPronosticosEnDB}
          >
            <Text style={styles.guardarButtonText}>Guardar Pronósticos</Text>
          </TouchableOpacity>
        )}

      </View>
    </ImageBackground>
  );
};

export default PredictsByCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
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
    textAlign: 'left',
  },
  selectedItemText: {
    color: colors.black,
    fontSize: 16,
  },
  selectedItem: {
    color: colors.orange,
  },
  initValueTextStyle: {
    color: colors.black,
    fontSize: 16,
  },
  pickerArrow: {
    color: colors.black,
    fontSize: 15,
  },
  guardarButton: {
    width: '90%',
    alignSelf: 'center',
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
    marginVertical: 10,
  },
  guardarButtonText: {
    textAlign: 'center',
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledPicker: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderColor: colors.gray,
  },
  editarButton: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  editarView: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center'
  }
});
