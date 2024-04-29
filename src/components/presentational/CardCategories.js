import { Pressable, StyleSheet, Text, Image, View, ImageBackground } from 'react-native'
import fonts from '../../utils/globals/fonts'
import colors from '../../utils/globals/colors'

const CardCategories = ({item, navigation}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.card} onPress={() => navigation.navigate("PredictsByCategory", { categorySelected: item.title })}>
        <Image source={{ uri: item.thumbnail }} style={styles.background} resizeMode='contain'/>
      </Pressable>
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
      width: '90%',
      height: 200,
      marginVertical: 5,
      alignItems: 'center',
      justifyContent: 'center'
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
      borderRadius: 15,
      backgroundColor: colors.blackGray,
      
    }
})