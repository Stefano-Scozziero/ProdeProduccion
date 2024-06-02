import { StyleSheet, ImageBackground, View, FlatList, Text } from 'react-native';
import { useContext, useState, useEffect, useMemo } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import EmptyListComponent from '../EmptyListComponent';
import Error from '../Error';
import { db } from '../../../app/services/firebase/config';
import colors from '../../../utils/globals/colors';
import DatesByCategoryAdm from '../DatesByCategoryAdm';
import { OrientationContext } from '../../../utils/globals/context';
import { format } from 'date-fns';
import ModalSelector from 'react-native-modal-selector';

const DatesLigue = () => {
  const [categorySelected, setCategorySelected] = useState('Liga Casildense');
  const [selectedTorneo, setSelectedTorneo] = useState('Apertura');
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isError, setIsError] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('Primera Division');
  const [pickerDataLoaded, setPickerDataLoaded] = useState(false);
  const [filteredPartidos, setFilteredPartidos] = useState([]);
  const portrait = useContext(OrientationContext);

  useEffect(() => {
    const ref = db.ref('/datos/fixture');
    const onValueChange = ref.on(
      'value',
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          if (data?.[categorySelected]?.[selectedDivision]) {
            setDatos(data);
          } else {
            setDatos(false);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    );

    return () => {
      ref.off('value', onValueChange);
    };
  }, [categorySelected, selectedDivision]);

  useEffect(() => {
    if (datos && categorySelected && selectedDate && selectedDivision && selectedTorneo) {
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.[selectedTorneo]?.partidos || [];
      const partidosPorFecha = partidosDelTorneo.find((partido) => partido.fecha === selectedDate);

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
  }, [categorySelected, selectedDate, datos, selectedDivision, selectedTorneo]);

  const updateDate = (encounterId, newDate) => {
    const formattedDate = format(newDate, 'yyyy-MM-dd HH:mm:ss');
    const updatedDatos = { ...datos };
    const partidosDelTorneo = updatedDatos[categorySelected][selectedDivision][selectedTorneo].partidos;

    const partido = partidosDelTorneo.find(partido => 
      partido.encuentros.some(encuentro => encuentro.id === encounterId)
    );

    if (partido) {
      const encounterIndex = partido.encuentros.findIndex(encuentro => encuentro.id === encounterId);
      const encuentro = partido.encuentros[encounterIndex];
      encuentro.fecha = formattedDate;

      setDatos(updatedDatos);

      db.ref(`/datos/fixture/${categorySelected}/${selectedDivision}/${selectedTorneo}/partidos/${partidosDelTorneo.indexOf(partido)}/encuentros/${encounterIndex}/fecha`)
        .set(formattedDate)
        .catch(error => console.error(error));
    }
  };

  useEffect(() => {
    if (datos && categorySelected && selectedDivision && !pickerDataLoaded) {
      const partidosDelTorneo = datos[categorySelected]?.[selectedDivision]?.['Apertura'].partidos || [];
      const primeraFechaDisponibleNoJugada = partidosDelTorneo.find((partido) => !partido.hasPlayed)?.fecha;
      setSelectedDate(primeraFechaDisponibleNoJugada || (partidosDelTorneo[0] && partidosDelTorneo[0].fecha));
      setPickerDataLoaded(true);
    }
  }, [datos, categorySelected, selectedDivision, selectedTorneo, pickerDataLoaded]);

  const updateScore = (team, encounterId, increment) => {
    const updatedDatos = { ...datos };
    const partidosDelTorneo = updatedDatos[categorySelected][selectedDivision][selectedTorneo].partidos;

    const partido = partidosDelTorneo.find(partido => 
      partido.encuentros.some(encuentro => encuentro.id === encounterId)
    );

    if (partido) {
      const encounterIndex = partido.encuentros.findIndex(encuentro => encuentro.id === encounterId);
      const equipo = partido.encuentros[encounterIndex][team];

      if (equipo.puntos !== undefined) {
        equipo.puntos = Math.max(0, equipo.puntos + increment);
      } else {
        equipo.puntos = increment;
      }

      setDatos(updatedDatos);

      db.ref(`/datos/fixture/${categorySelected}/${selectedDivision}/${selectedTorneo}/partidos/${partidosDelTorneo.indexOf(partido)}/encuentros/${encounterIndex}/${team}/puntos`)
        .set(equipo.puntos)
        .catch(error => console.error(error));
    }
  };

  const divisionOptions = useMemo(() => [
    { key: 'Primera Division', label: 'Primera Division' },
    { key: 'Reserva', label: 'Reserva' }
  ], []);

  const torneoOptions = useMemo(() => [
    { key: 'Apertura', label: 'Apertura' },
    { key: 'Clausura', label: 'Clausura' }
  ], []);

  const fechaOptions = useMemo(() => {
    if (datos && categorySelected && selectedDivision && selectedTorneo) {
      return datos[categorySelected]?.[selectedDivision]?.[selectedTorneo]?.partidos.map((partido, index) => ({
        key: partido.fecha,
        label: `Fecha ${partido.fecha}`
      }));
    }
    return [];
  }, [datos, categorySelected, selectedDivision, selectedTorneo]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Competencies')} />;
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
        <View style={styles.picker2}>
          <ModalSelector
            data={torneoOptions}
            initValue={selectedTorneo}
            onChange={(option) => {
              setSelectedTorneo(option.key);
              setPickerDataLoaded(false);
            }}
            style={styles.picker}
            optionTextStyle={styles.pickerText}
            selectStyle={{ borderWidth: 0 }}
            selectedItem={selectedTorneo}
            selectedItemTextStyle={styles.selectedItem}
            initValueTextStyle={styles.initValueTextStyle}
            backdropPressToClose={true}
            animationType='fade'
            cancelText='Salir'
            cancelTextStyle={{ color: colors.black }}
          />
          <Text style={styles.pickerArrow}>▼</Text>
        </View>
        <View style={styles.picker2}>
          <ModalSelector
            data={fechaOptions}
            initValue={`Fecha ${selectedDate}`}
            onChange={(option) => setSelectedDate(option.key)}
            optionTextStyle={styles.pickerText}
            style={styles.picker}
            selectedItem={`Fecha ${selectedDate}`}
            selectedItemTextStyle={styles.selectedItem}
            selectStyle={{ borderWidth: 0 }}
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
        <View style={{ width: '95%' }}>
          <FlatList
            data={filteredPartidos}
            keyExtractor={(_, index) => `partidos-${index}`}
            renderItem={({ item }) => (
              <DatesByCategoryAdm
                encuentros={item}
                updateScore={updateScore}
                updateDate={updateDate}
              />
            )}
            ListEmptyComponent={<Text style={{ fontSize: 20 }}>No hay encuentros disponibles</Text>}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={8}
          />
        </View>
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
    width: 350,
    height: 45,
    borderColor: colors.orange,
    borderWidth: 1,
    marginVertical: 2.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  picker2: {
    width: 350,
    height: 45,
    borderColor: colors.orange,
    borderWidth: 1,
    marginVertical: 2.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: colors.white,
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
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedItem: {
    color: colors.orange,
  },
});
