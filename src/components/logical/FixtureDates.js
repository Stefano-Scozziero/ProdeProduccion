import { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import LoadingSpinner from '../presentational/LoadingSpinner';
import EmptyListComponent from '../presentational/EmptyListComponent';
import Error from '../presentational/Error';
import { OrientationContext } from '../../utils/globals/context';
import { Picker } from '@react-native-picker/picker';
import ModalSelector from 'react-native-modal-selector';
import CardFixture from '../presentational/CardFixture';
import { db } from '../../app/services/firebase/config';
import colors from '../../utils/globals/colors';

const FixtureDates = ({ navigation }) => {
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const portrait = useContext(OrientationContext);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division'); // Inicializar con 'Primera Division'
  const [filteredPartidos, setFilteredPartidos] = useState([]);

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture')
      .on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setDatos(data);
          if (data && Object.keys(data).length > 0) {
            const [firstLeagueKey] = Object.keys(data);
            setSelectedLeague(firstLeagueKey);
            const divisions = Object.keys(data[firstLeagueKey]);
            if (!divisions.includes('Primera Division')) {
              setSelectedDivision(divisions[0]); // Seleccionar la primera división disponible si 'Primera Division' no está en las divisiones
            }
            setSelectedTournament(Object.keys(data[firstLeagueKey][selectedDivision])[0]);
          } else {
            setIsLoading(false);
            setIsError(true);
          }
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      }, (error) => {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      });

    return () => db.ref('/datos/fixture').off('value', onValueChange);
  }, []);

  useEffect(() => {
    if (datos && selectedLeague && selectedTournament) {
      const partidosDelTorneo = datos[selectedLeague][selectedDivision][selectedTournament]?.partidos || [];
      setFilteredPartidos(partidosDelTorneo);
      setIsLoading(false);
    }
  }, [selectedLeague, selectedTournament, datos, selectedDivision]);

  const divisionOptions = [
    { key: 'Primera Division', label: 'Primera Division' },
    { key: 'Reserva', label: 'Reserva' }
  ];

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'} />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Home')} />;
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />;

  return (
    <View style={[styles.container, !portrait && styles.landScape]}>
      {selectedLeague && datos[selectedLeague] && selectedTournament && (
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
        </View>
      )}

      <View style={styles.flatlist}>
        {filteredPartidos && (
          <FlatList
            data={filteredPartidos}
            keyExtractor={(_, index) => `partido-${index}`}
            renderItem={({ item }) => <CardFixture partidos={item} />}
            initialNumToRender={15}
            maxToRenderPerBatch={15}
            windowSize={5}
          />
        )}
      </View>
    </View>
  );
};

export default FixtureDates;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '87%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landScape: {
    width: '100%',
    height: '60%',
  },
  containerPicker: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333', // Color del texto del picker
  },
  flatlist: {
    width: '95%',
    height: '100%',
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
});
