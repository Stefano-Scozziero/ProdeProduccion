import { StyleSheet, Text, View, Pressable, StatusBar, Platform } from 'react-native'
import colors from '../../utils/globals/colors'
import { OrientationContext } from '../../utils/globals/context'
import { useContext } from 'react'

const Header = ({title= "ProdeSco", navigation, children}) => {

  const portrait = useContext(OrientationContext)


  return (
    <View style={[styles.container, !portrait && styles.containerLandScape]}>
      
      <View style={[styles.containerTitle, !portrait && styles.containerTitle]}>
        {children}
        <View style={styles.centerContainer}>
          <Text style={[styles.text, !portrait && styles.textLandScape]}>{title}</Text>
        </View>
        
      </View>
      
    </View>
  ) 
  
        
  
}

export default Header

const styles = StyleSheet.create({

    container:{
      backgroundColor: colors.orange,
      height: 90,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      
    },
    containerTitle:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 15,
    },
    centerContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerLandScape:{
      height: 70,
    },
    text: {
      fontSize: 30,
      color:colors.black
    },
    textLandScape: {
      bottom: 13
    },
})
