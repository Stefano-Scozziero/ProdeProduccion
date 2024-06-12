import { Pressable, StyleSheet, Image, View, TouchableOpacity } from 'react-native'
import fonts from '../../utils/globals/fonts'
import colors from '../../utils/globals/colors'
import { setSelectedCategory } from '../../features/category/categorySlice'
import { useDispatch } from 'react-redux'

const CardCategories = ({item, navigation}) => {

  const dispatch = useDispatch()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => {
          dispatch(setSelectedCategory(item.title));
          navigation.navigate("PredictsByCategory");
        }}>
        <Image source={{ uri: item.thumbnail }} style={styles.background} resizeMode='contain'/>
      </TouchableOpacity>
    </View>
    
    
  )
}

export default CardCategories

const styles = StyleSheet.create({

    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    card:{
      width: '95%',
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10
    },
    text: {
      fontSize: 20,
      fontFamily: fonts.robotoBold,
      color: 'white',
    },
    background: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: colors.blackGray,
      
    }
})