import { StyleSheet,View,Image, ImageBackground, Text, Pressable, TouchableOpacity } from 'react-native'
import { OrientationContext } from '../../../utils/globals/context'
import { useContext } from 'react'
import FixtureDates from '../../logical/FixtureDates'


const Fixture = ({navigation}) => {


  const portrait = useContext(OrientationContext)



  return (
    <>
        <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
            <FixtureDates navigation={navigation}/>  
        </ImageBackground>
    </>
    
)}

export default Fixture

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