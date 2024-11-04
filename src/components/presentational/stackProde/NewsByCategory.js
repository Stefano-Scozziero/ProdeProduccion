import { StyleSheet, View, Image, ImageBackground, Text, FlatList, TouchableOpacity } from 'react-native'
import { OrientationContext } from '../../../utils/globals/context'
import React, { useContext, useState, useEffect, useRef } from 'react';
import { database, auth } from '../../../app/services/firebase/config';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';


const NewsByCategory = () => {

    const categorySelected = useSelector((state) => state.category.selectedCategory);
    const portrait = useContext(OrientationContext)
    const [datos, setDatos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const db = database();

    useEffect(() => {
      if (!categorySelected) {
          setDatos([]);
          setIsLoading(false);
          return;
      }

      const noticiasRef = db.ref(`/datos/fixture/${categorySelected}/noticias`);

      const onValueChange = noticiasRef.on(
          'value',
          (snapshot) => {
              if (snapshot.exists()) {
                  const data = snapshot.val();
                  const noticiasList = Object.keys(data).map(key => ({
                      id: key,
                      ...data[key],
                  }));
                  // Ordenar las noticias por fecha descendente
                  noticiasList.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                  setDatos(noticiasList);
              } else {
                  setDatos([]);
              }
              setIsLoading(false);
          },
          (error) => {
              console.error('Error al obtener noticias:', error);
              setIsError(true);
              setIsLoading(false);
          }
      );

      // Limpieza del listener cuando el componente se desmonta
      return () => {
          noticiasRef.off('value', onValueChange);
      };
  }, [categorySelected, db]);





    if (isLoading) return <LoadingSpinner message={'Cargando Noticias...'} />;
    if (isError)
        return (
            <Error
                message="¡Ups! Algo salió mal."
                textButton="Recargar"
                onRetry={() => navigation.navigate('Home')}
            />
        );
    if (!datos) return <EmptyListComponent message="No hay Noticias disponibles" />;

    const renderNoticia = ({ item }) => (
        <View style={styles.noticiaContainer}>
            {item.imagenUrl && (
                <Image source={{ uri: item.imagenUrl }} style={styles.imagen} />
            )}
            <View style={styles.textContainer}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                <Text style={styles.contenido}>{item.contenido}</Text>
                <Text style={styles.autor}>Por: {item.autor}</Text>
            </View>
        </View>
    );

    return (
        <>
            <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.container, !portrait && styles.landScape]}>
                <FlatList
                    data={datos}
                    renderItem={renderNoticia}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{fontSize: 20, alignItems: 'center', justifyContent: 'center'}}>No hay noticias disponibles.</Text>}
                />
            </ImageBackground>
        </>

    )
}

export default NewsByCategory

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    landScape: {
      width: '100%',
      height: '60%',
    },
})