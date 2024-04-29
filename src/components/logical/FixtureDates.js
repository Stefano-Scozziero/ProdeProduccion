import { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import LoadingSpinner from '../presentational/LoadingSpinner'
import EmptyListComponent from '../presentational/EmptyListComponent'
import Error from '../presentational/Error'
import { OrientationContext } from '../../utils/globals/context'
import { Picker } from '@react-native-picker/picker'
import colors from '../../utils/globals/colors'
import CardFixture from '../presentational/CardFixture'
import { db } from '../../app/services/firebase/config'

const FixtureDates = ({ navigation }) => {
  const [datos, setDatos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const portrait = useContext(OrientationContext);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [filteredPartidos, setFilteredPartidos] = useState([]);

  useEffect(() => {
    const onValueChange = db.ref('/datos/fixture')
      .on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setDatos(data);
          if (data && Object.keys(data).length > 0) {
            setSelectedLeague(Object.keys(data)[0]);
            setSelectedTournament(data[Object.keys(data)[0]][0].title);
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
      const partidosDelTorneo = datos[selectedLeague].find(item => item.title === selectedTournament)?.partidos || [];
      setFilteredPartidos(partidosDelTorneo);
      setIsLoading(false);
    }
  }, [selectedLeague, selectedTournament, datos]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={() => navigation.navigate('Home')} />;
  if (!datos || Object.keys(datos).length === 0) return <EmptyListComponent message="No hay datos disponibles" />;

  return (
    <View style={[styles.container, !portrait && styles.landScape]}>
      {selectedLeague && datos[selectedLeague] && selectedTournament && (
      <Picker
        selectedValue={selectedLeague}
        onValueChange={(itemValue) => setSelectedLeague(itemValue)}
        style={styles.picker}
        mode="dropdown"
      >
        {Object.keys(datos).map((liga, index) => (
          <Picker.Item key={index} label={liga} value={liga} />
        ))}
      </Picker>
      )}
      {selectedLeague && datos[selectedLeague] && selectedTournament && (
        <Picker
          selectedValue={selectedTournament}
          onValueChange={(itemValue) => setSelectedTournament(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {datos[selectedLeague].map((torneo, index) => (
            <Picker.Item key={index} label={torneo.title} value={torneo.title} />
          ))}
        </Picker>
      )}

      <View style={styles.flatlist}>
      {filteredPartidos && (
        <FlatList
          data={filteredPartidos}
          keyExtractor={(_, index) => `partido-${index}`}
          renderItem={({ item }) => <CardFixture partidos={item} />}
          initialNumToRender={25}
          maxToRenderPerBatch={15}
          windowSize={15}
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
  picker: {
    width: 350,
    height: 45,
    top: 25,
    marginTop: 5,
    backgroundColor: colors.orangeLight
  },
  flatlist: {
    width: '95%',
    height: '100%',
    top: 30
  }
})
