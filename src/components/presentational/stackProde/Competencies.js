import { StyleSheet,View,Image, ImageBackground, Text, Pressable, TouchableOpacity } from 'react-native'
import { OrientationContext } from '../../../utils/globals/context'
import { useContext } from 'react'
import Categories from '../../logical/Categories'


const Competencies = ({navigation}) => {

  const portrait = useContext(OrientationContext)
  return (
    <>
        <ImageBackground source={require('../../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
            <Categories navigation={navigation}/>  
        </ImageBackground>
    </>
    
)}

export default Competencies

const styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainLandScape:{
        flexDirection: 'row'
    },
    
})