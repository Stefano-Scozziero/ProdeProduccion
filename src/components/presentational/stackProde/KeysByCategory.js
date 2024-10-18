import { StyleSheet, ImageBackground } from 'react-native'
import { OrientationContext } from '../../../utils/globals/context'
import { useContext } from 'react'


const KeysByCategory = ({navigation}) => {


  const portrait = useContext(OrientationContext)



  return (
    <>
        <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
             
        </ImageBackground>
    </>
    
)}

export default KeysByCategory

const styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems: 'center'
    },
    mainLandScape:{
        flexDirection: 'row'
    },
    containerText: {
        width: '90%',
        height: 20,
        alignItems: 'center', 
        justifyContent: 'center',
        marginVertical: 10,
    },
    text: {
        fontSize: 25,
        textAlign: 'center',
    }
    
})