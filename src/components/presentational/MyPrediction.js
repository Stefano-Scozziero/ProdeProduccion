import { StyleSheet,View,Image, ImageBackground, Text } from 'react-native'
import { OrientationContext } from '../../utils/globals/context'
import { useContext } from 'react'


const MyPrediction = ({navigation}) => {


  const portrait = useContext(OrientationContext)



  return (
    <>
        <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
            <Categories navigation={navigation}/>  
        </ImageBackground>
    </>
    
)}

export default MyPrediction

const styles = StyleSheet.create({
    main:{
        flex: 1
    },
    mainLandScape:{
        flexDirection: 'row'
    }
    
})