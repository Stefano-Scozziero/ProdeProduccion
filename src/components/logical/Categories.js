import { FlatList, StyleSheet, View} from 'react-native'
import CardCategories from '../presentational/CardCategories'
import React, { useContext, useState, useEffect } from 'react';
import { OrientationContext } from '../../utils/globals/context'
import LoadingSpinner from '../presentational/LoadingSpinner'
import EmptyListComponent from '../presentational/EmptyListComponent'
import Error from '../presentational/Error'
import { db } from '../../app/services/firebase/config'


const Categories = ({navigation}) => {

  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const portrait = useContext(OrientationContext)

  useEffect(() => {
    const categoriesRef = db.ref('/categories')
    categoriesRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const fetchedCategories = snapshot.val()
        const formattedCategories = Object.keys(fetchedCategories).map(key => ({
          ...fetchedCategories[key],
          id: key
        }));
        setCategories(formattedCategories)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setIsError(true)
      }
    }, (error) => {
      console.error(error)
      setIsError(true)
      setIsLoading(false)
    })

    return () => categoriesRef.off('value')
  }, [])

  const onRetry = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  }

  if (isLoading) return <LoadingSpinner message={'Cargando Datos...'}/>
  if (isError) return <Error message="¡Ups! Algo salió mal." textButton="Recargar" onRetry={onRetry} />
  if (categories.length === 0) return <EmptyListComponent message="Las categorias no están disponibles" />

  return (
    <View style={[styles.flatList, !portrait && styles.flatListLandScape]}>
      <FlatList
        data={categories}
        keyExtractor={item => item.title}
        renderItem={({item}) => <CardCategories navigation={navigation} item={item}/>}
      />
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  flatListLandScape: {
    width: '100%',
    height: '50%'
  },
  flatList: {
    width: '100%',
    height: '100%'
  }
})