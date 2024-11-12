import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { OrientationContext } from '../../../utils/globals/context';
import colors from '../../../utils/globals/colors';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import { database } from '../../../app/services/firebase/config';
import { useSelector } from 'react-redux';
import ModalSelector from 'react-native-modal-selector';
import DatesByKeys from './DatesByKeys';

const phases = ['Octavos de final', 'Cuartos de final', 'Semifinal', 'Final'];

const KeysByCategory = ({ navigation }) => {
  const DEFAULT_IMAGE = 'https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/ClubesLigaCas%2FiconEsc.png?alt=media&token=4c508bf7-059e-451e-b726-045eaf79beae';
  const portrait = useContext(OrientationContext);
  const categorySelected = useSelector(state => state.category.selectedCategory);
  const [datos, setDatos] = useState(null);
  const [equipos, setEquipos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [encuentros, setEncuentros] = useState([]);
  const [tablaGeneral, setTablaGeneral] = useState(null);
  const db = database();
  const divisionSelectorRef = useRef(null);

  // Fetch fixture data when categorySelected changes
  useEffect(() => {
    if (categorySelected) {
      setIsLoading(true);

      const fixtureRef = db.ref(`/datos/fixture/${categorySelected}`);

      const onValueChangeFixture = fixtureRef.on(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setDatos(data);
            setEquipos(data.equipos || {});
          } else {
            setDatos(false);
          }
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        },
        error => {
          console.error(error);
          setIsError(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      );

      return () => {
        fixtureRef.off('value', onValueChangeFixture);
      };
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [categorySelected]);

  // Set division options and selectedDivision when datos is fetched
  useEffect(() => {
    if (datos) {
      const divisions = Object.keys(datos.partidos || {})
        .map(key => ({ key, label: key }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setDivisionOptions(divisions);

      if (!selectedDivision || !divisions.find(d => d.key === selectedDivision)) {
        setSelectedDivision(divisions.length > 0 ? divisions[0].key : null);
      }
    }
  }, [datos]);

  // Fetch positions data when selectedDivision changes
  useEffect(() => {
    if (categorySelected && selectedDivision) {
      const positionsRef = db.ref(`/datos/positions/${categorySelected}/${selectedDivision}/General`);

      const onValueChangePositions = positionsRef.on(
        'value',
        snapshot => {
          if (snapshot.exists()) {
            setTablaGeneral(snapshot.val());
          } else {
            setTablaGeneral(null);
          }
        },
        error => {
          console.error(error);
          setIsError(true);
        }
      );

      return () => {
        positionsRef.off('value', onValueChangePositions);
      };
    }
  }, [categorySelected, selectedDivision]);

  // Function to obtain team data from the general table
  const obtenerDatosEquipo = equipoId => {
    if (!tablaGeneral || !tablaGeneral.equipos) return null;

    const equipo = Object.values(tablaGeneral.equipos).find(e => e && e.nombre === equipoId);
    return equipo ? equipo : null;
  };

  // Merge rounds and determine winners
  const mergeRounds = (ida, vuelta) => {
    if (!ida.length && !vuelta.length) return [];

    const validIda = ida.filter(match => match !== null && match !== undefined);
    const validVuelta = vuelta.filter(match => match !== null && match !== undefined);

    const merged = validIda.map(idaMatch => {
      const vueltaMatch = validVuelta.find(
        vm => vm.equipo1 === idaMatch.equipo2 && vm.equipo2 === idaMatch.equipo1
      ) || {};

      const equipo1Id = idaMatch.equipo1;
      const equipo2Id = idaMatch.equipo2;

      const equipo1Name = equipos[equipo1Id]?.nombre || 'Por Definir';
      const equipo2Name = equipos[equipo2Id]?.nombre || 'Por Definir';
      const imagen1 = equipos[equipo1Id]?.imagen || DEFAULT_IMAGE;
      const imagen2 = equipos[equipo2Id]?.imagen || DEFAULT_IMAGE;

      const golesEquipo1 = (idaMatch.goles1 || 0) + (vueltaMatch.goles2 || 0);
      const golesEquipo2 = (idaMatch.goles2 || 0) + (vueltaMatch.goles1 || 0);

      let winner = null;
      let isTie = false;

      // Check if both matches have been played
      const bothMatchesPlayed = idaMatch.hasPlayed && vueltaMatch.hasPlayed;

      if (bothMatchesPlayed) {
        if (golesEquipo1 > golesEquipo2) {
          winner = 'equipo1';
        } else if (golesEquipo1 < golesEquipo2) {
          winner = 'equipo2';
        } else {
          // Tie, apply advantage based on general table
          isTie = true;

          const equipo1Data = obtenerDatosEquipo(equipo1Id);
          const equipo2Data = obtenerDatosEquipo(equipo2Id);

          if (equipo1Data && equipo2Data) {
            if (equipo1Data.puntos > equipo2Data.puntos) {
              winner = 'equipo1';
            } else if (equipo1Data.puntos < equipo2Data.puntos) {
              winner = 'equipo2';
            } else {
              // If points are equal, compare goal difference
              if (equipo1Data.diferenciaGoles > equipo2Data.diferenciaGoles) {
                winner = 'equipo1';
              } else if (equipo1Data.diferenciaGoles < equipo2Data.diferenciaGoles) {
                winner = 'equipo2';
              } else {
                // Additional criteria can be implemented here
                winner = 'empate';
              }
            }
          } else {
            winner = 'empate';
          }
        }
      }

      const fecha = vueltaMatch.fecha || idaMatch.fecha;

      return {
        equipo1: equipo1Name,
        equipo2: equipo2Name,
        imagen1,
        imagen2,
        goles1: golesEquipo1,
        goles2: golesEquipo2,
        fecha,
        winner,
        isTie,
        hasPlayed: bothMatchesPlayed,
      };
    });

    return merged;
  };

  const preparePhases = mergedEncuentros => {
    const encuentrosPorFase = {};

    phases.forEach(fase => {
      if (mergedEncuentros[fase] && mergedEncuentros[fase].length > 0) {
        encuentrosPorFase[fase] = mergedEncuentros[fase];
      } else {
        let placeholders = [];
        switch (fase) {
          case 'Octavos de final':
            placeholders = Array(5).fill({
              equipo1: 'Por Definir',
              equipo2: 'Por Definir',
              imagen1: DEFAULT_IMAGE,
              imagen2: DEFAULT_IMAGE,
              goles1: '-',
              goles2: '-',
              fecha: 'Por Definir',
            });
            break;
          case 'Cuartos de final':
            placeholders = Array(4).fill({
              equipo1: 'Por Definir',
              equipo2: 'Por Definir',
              imagen1: DEFAULT_IMAGE,
              imagen2: DEFAULT_IMAGE,
              goles1: '-',
              goles2: '-',
              fecha: 'Por Definir',
            });
            break;
          case 'Semifinal':
            placeholders = Array(2).fill({
              equipo1: 'Por Definir',
              equipo2: 'Por Definir',
              imagen1: DEFAULT_IMAGE,
              imagen2: DEFAULT_IMAGE,
              goles1: '-',
              goles2: '-',
              fecha: 'Por Definir',
            });
            break;
          case 'Final':
            placeholders = Array(1).fill({
              equipo1: 'Por Definir',
              equipo2: 'Por Definir',
              imagen1: DEFAULT_IMAGE,
              imagen2: DEFAULT_IMAGE,
              goles1: '-',
              goles2: '-',
              fecha: 'Por Definir',
            });
            break;
          default:
            placeholders = [];
        }
        encuentrosPorFase[fase] = placeholders;
      }
    });

    return phases.map(fase => ({
      fase,
      encuentros: encuentrosPorFase[fase],
    }));
  };

  // Format the matches for the child component
  useEffect(() => {
    if (datos && selectedDivision && tablaGeneral) {
      const partidos = datos.partidos?.[selectedDivision] || {};

      const mergedEncuentros = {};

      phases.forEach(fase => {
        if (fase === 'Octavos de final' || fase === 'Cuartos de final' || fase === 'Semifinal') {
          const faseData = partidos[fase] || {};
          const faseIda = faseData.ida?.encuentros || [];
          const faseVuelta = faseData.vuelta?.encuentros || [];

          if (faseIda.length > 0 || faseVuelta.length > 0) {
            mergedEncuentros[fase] = mergeRounds(faseIda, faseVuelta);
          } else {
            const expectedCounts = {
              'Octavos de final': 5,
              'Cuartos de final': 4,
              'Semifinal': 2,
            };
            const expected = expectedCounts[fase];
            const placeholders = Array(expected).fill({
              equipo1: 'Por Definir',
              equipo2: 'Por Definir',
              imagen1: DEFAULT_IMAGE,
              imagen2: DEFAULT_IMAGE,
              goles1: '-',
              goles2: '-',
              fecha: 'Por Definir',
            });
            mergedEncuentros[fase] = placeholders;
          }
        } else {
          // Handle 'Final' without Ida and Vuelta
          const faseData =
            partidos[fase] && partidos[fase].ida && partidos[fase].vuelta
              ? partidos[fase]
              : null;

          if (faseData) {
            const faseIda = faseData.ida?.encuentros || [];
            const faseVuelta = faseData.vuelta?.encuentros || [];

            if (faseIda.length > 0 || faseVuelta.length > 0) {
              mergedEncuentros[fase] = mergeRounds(faseIda, faseVuelta);
            }
          }

          // Asignar placeholders si no hay encuentros
          if (!mergedEncuentros[fase] || mergedEncuentros[fase].length === 0) {
            const placeholders = Array(1).fill({
              equipo1: 'Por Definir',
              equipo2: 'Por Definir',
              imagen1: DEFAULT_IMAGE,
              imagen2: DEFAULT_IMAGE,
              goles1: '-',
              goles2: '-',
              fecha: 'Por Definir',
            });
            mergedEncuentros[fase] = placeholders;
          }
        }
      });

      // Prepare all phases, including placeholders where necessary
      const formattedEncuentros = preparePhases(mergedEncuentros);
      setEncuentros(formattedEncuentros);
    }
  }, [datos, selectedDivision, equipos, tablaGeneral]);

  const handleDivisionChange = option => {
    setSelectedDivision(option.key);
  };

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Home')} />;
  if (!datos) return <EmptyListComponent message="No hay datos disponibles" />;

  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
      <View style={styles.containerPicker}>
        <ModalSelector
          data={divisionOptions}
          initValue={selectedDivision}
          onChange={handleDivisionChange}
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
            <Text style={styles.selectedItemText}>{selectedDivision || 'Selecciona una División'}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </ModalSelector>
      </View>

      {selectedDivision && (
        <ScrollView contentContainerStyle={{ flexGrow: 1, width: '100%' }}>
          <DatesByKeys encuentros={encuentros} />
        </ScrollView>
      )}
    </ImageBackground>
  );
};

export default KeysByCategory;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
    },
    mainLandScape: {
        flexDirection: 'row',
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.orange,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: colors.red,
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: colors.green,
        padding: 10,
        borderRadius: 10,
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 16,
    },
});
