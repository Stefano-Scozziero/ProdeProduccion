import { StyleSheet,View,Image, ImageBackground, Text, Pressable, TouchableOpacity } from 'react-native'
import { OrientationContext } from '../../../utils/globals/context'
import { useContext } from 'react'
import NewsByCategory from './NewsByCategory'


const News = ({navigation}) => {


  const portrait = useContext(OrientationContext)



  return (
    <>
        <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
            <NewsByCategory navigation={navigation}/> 
        </ImageBackground>
    </>
    
)}

export default News

const styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems: 'center'
    },
    mainLandScape:{
        flexDirection: 'row'
    }
})