import { StyleSheet, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import colors from '../../../utils/globals/colors'

const AddButton = ({title, onPress}) => {
  return (
    <TouchableOpacity style= {styles.container} onPress={onPress}>
        <Text style= {styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default AddButton

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.orange,
        width: "70%",
        paddingVertical: 8,
        margin: 10,
    },
    text:{
        color: colors.black,
        textAlign: 'center',
        fontSize: 18
    }
})