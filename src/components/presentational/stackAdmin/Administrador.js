import React, {useContext} from 'react'
import { StyleSheet, View, ImageBackground, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import colors from '../../../utils/globals/colors'
import { OrientationContext } from '../../../utils/globals/context'

const Administrador = ({navigation}) => {
const portrait = useContext(OrientationContext)
const goToDatesLigue = () => {
  navigation.navigate('DatesLigue', { screen: 'DatesLigue' })
}
  return (
    <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
     <View style={styles.containerBtn}>
      <TouchableOpacity style={styles.btnLiga} onPress={goToDatesLigue}>
        <Text style={{textAlign:'center', fontSize: 20}}>Actualizar Datos de Liga</Text>
      </TouchableOpacity>
      
     </View>
    </ImageBackground>
  )
}

export default Administrador

const styles = StyleSheet.create({
    main:{
        flex: 1
    },
    mainLandScape:{
        flexDirection: 'row'
    },
    containerBtn:{
      flex:1,
      alignItems: 'center'
    },
    btnLiga:{
      width: '90%',
      height: 50,
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.orange,
      borderRadius: 10
      
    }
    
})