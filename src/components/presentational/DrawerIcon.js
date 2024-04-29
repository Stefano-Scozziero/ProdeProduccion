import { StyleSheet, Text, View } from 'react-native'
import {Entypo} from '@expo/vector-icons'
import colors from '../../utils/globals/colors'

const DrawerIcon = ({title, nameIcon, focused, portrait}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, !portrait && styles.iconContainerLandscape]}>
        <Entypo name={nameIcon} size={15} color={focused ? colors.orange : colors.white}/> 
        <Text style={[styles.text, !focused && styles.textFocused]} >{title}</Text>
      </View>
    </View>
  )
}

export default DrawerIcon

const styles = StyleSheet.create({

  container:{
    
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainerLandscape:{
    justifyContent: 'center',
    alignItems: 'center',
   
  },

})
