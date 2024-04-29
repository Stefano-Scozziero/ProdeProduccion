import { StyleSheet,View,Image, ImageBackground, Text } from 'react-native'
import { OrientationContext } from '../../utils/globals/context'
import { useContext } from 'react'
import colors from '../../utils/globals/colors'


const HowToPlay = ({navigation}) => {


  const portrait = useContext(OrientationContext)



  return (
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
      <View style={styles.text}>
        
      </View>
    </ImageBackground>
  )
}

export default HowToPlay

const styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainLandScape:{
        flexDirection: 'row'
    },
    text:{
      width: '90%',
      height: '90%',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: colors.blackGray,
      padding: 10
    }
    
})