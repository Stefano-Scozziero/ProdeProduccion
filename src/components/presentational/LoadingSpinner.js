import { StyleSheet, Text, ImageBackground, ActivityIndicator  } from 'react-native'
import colors from '../../utils/globals/colors'


const LoadingSpinner = () => {
  return (
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={styles.container}>
      <Text style={styles.text}>CARGANDO DATOS...</Text>
      <ActivityIndicator size={80} color="white" />
    </ImageBackground>
  )
}

export default LoadingSpinner

const styles = StyleSheet.create({
  container:{ 
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text:{
    color:colors.black, 
    textAlign: 'center'
  }
})