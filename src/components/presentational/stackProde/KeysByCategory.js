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
    const db = database();
    const divisionSelectorRef = useRef(null);

    // Cargar datos de Firebase
    useEffect(() => {
      const onValueChange = db.ref(`/datos/fixture/${categorySelected}`).on('value', (snapshot) => {
          if (snapshot.exists()) {
              const data = snapshot.val();
              setDatos(data);
              setEquipos(data.equipos || {});
          } else {
              setDatos(false);
          }
          setIsLoading(false);
      }, (error) => {
          console.error(error);
          setIsError(true);
          setIsLoading(false);
      });
  
      return () => {
          db.ref(`/datos/fixture/${categorySelected}`).off('value', onValueChange);
      };
  }, [categorySelected]);

    // Función para calcular los puntos acumulados
    const mergeRounds = (ida, vuelta) => {
      if (!ida.length && !vuelta.length) return [];
  
      // Filtrar encuentros nulos
      const validIda = ida.filter(match => match !== null && match !== undefined);
      const validVuelta = vuelta.filter(match => match !== null && match !== undefined);
  
      const merged = validIda.map((idaMatch, index) => {
          const vueltaMatch = validVuelta[index] || {};
  
          return {
              equipo1: equipos[idaMatch.equipo1]?.nombre || 'Por Definir',
              equipo2: equipos[idaMatch.equipo2]?.nombre || 'Por Definir',
              imagen1: equipos[idaMatch.equipo1]?.imagen || DEFAULT_IMAGE,
              imagen2: equipos[idaMatch.equipo2]?.imagen || DEFAULT_IMAGE,
              goles1: (idaMatch.goles1 || 0) + (vueltaMatch.goles1 || 0),
              goles2: (idaMatch.goles2 || 0) + (vueltaMatch.goles2 || 0),
              fecha: vueltaMatch.fecha || idaMatch.fecha,
          };
      });
  
      return merged;
  };
  

    const preparePhases = (mergedEncuentros) => {
        const encuentrosPorFase = {};

        phases.forEach(fase => {
            if (mergedEncuentros[fase] && mergedEncuentros[fase].length > 0) {
                encuentrosPorFase[fase] = mergedEncuentros[fase];
            } else {
                let placeholders = [];
                switch(fase) {
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

        return phases.map((fase) => ({
            fase,
            encuentros: encuentrosPorFase[fase],
        }));
    };

    // Formatear los encuentros para el componente hijo
    useEffect(() => {
      if (datos && selectedDivision) {
          const partidos = datos.partidos?.[selectedDivision] || {};
    
          const mergedEncuentros = {};
    
          phases.forEach(fase => {
              if (fase === 'Octavos de final') {
                  // Acceder directamente a 'ida' y 'vuelta' dentro de la fase
                  const faseData = partidos[fase] || {};
                  const faseIda = faseData.ida?.encuentros || [];
                  const faseVuelta = faseData.vuelta?.encuentros || [];
    
                  if (faseIda.length > 0 || faseVuelta.length > 0) {
                      mergedEncuentros[fase] = mergeRounds(faseIda, faseVuelta);
                  } else {
                      // Asignar placeholders si no hay encuentros
                      mergedEncuentros[fase] = Array(5).fill({
                          equipo1: 'Por Definir',
                          equipo2: 'Por Definir',
                          imagen1: DEFAULT_IMAGE,
                          imagen2: DEFAULT_IMAGE,
                          goles1: '-',
                          goles2: '-',
                          fecha: 'Por Definir',
                      });
                  }
              } else {
                  // Manejo de otras fases sin Ida y Vuelta
                  const faseData = (partidos[fase] && partidos[fase].stage1 && partidos[fase].stage1.encuentros) ? partidos[fase].stage1.encuentros : [];
                  const validEncuentros = faseData.filter(match => match !== null && match !== undefined);
                  mergedEncuentros[fase] = validEncuentros.map(match => ({
                      equipo1: equipos[match.equipo1]?.nombre || 'Por Definir',
                      equipo2: equipos[match.equipo2]?.nombre || 'Por Definir',
                      imagen1: equipos[match.equipo1]?.imagen || DEFAULT_IMAGE,
                      imagen2: equipos[match.equipo2]?.imagen || DEFAULT_IMAGE,
                      goles1: match.goles1,
                      goles2: match.goles2,
                      fecha: match.fecha,
                  }));
    
                  // Si no hay encuentros, asignar placeholders
                  if (mergedEncuentros[fase].length === 0) {
                      const expectedCounts = {
                          'Cuartos de final': 4,
                          'Semifinal': 2,
                          'Final': 1,
                      };
                      const expected = expectedCounts[fase] || 0;
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
              }
          });
    
          // Preparar todas las fases, incluyendo marcadores de posición donde sea necesario
          const formattedEncuentros = preparePhases(mergedEncuentros);
          setEncuentros(formattedEncuentros);
      }
    }, [datos, selectedDivision, equipos]);
    
  
  

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

    const handleDivisionChange = (option) => {
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
                    animationType='fade'
                    cancelText='Salir'
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
