import { StyleSheet, Text, View,TextInput } from 'react-native'
import colors from '../../../utils/globals/colors'


const InputForm = ({label,value, onChangeText,isSecure,error}) => {


  return (
    <View style={styles.inputContainer}>
        <TextInput  
            value={value}  
            onChangeText={onChangeText} 
            style={styles.input}
            secureTextEntry={isSecure}
            placeholder={label}
            placeholderTextColor={colors.white}
            
        />
        {error ? <View><Text style={styles.error}>{error}</Text></View> : null}
    </View>
  )
}


export default InputForm


const styles = StyleSheet.create({
    inputContainer:{
        width:"100%",
        alignItems: 'center'
    },
    input:{
        width:"70%",
        borderWidth:0,
        borderBottomWidth:1,
        borderColor: colors.white,
        padding:2,
        fontSize:14,
        marginHorizontal:"5%",
        marginVertical:10
      },
      titleInput:{
        width:"90%",
        marginHorizontal:"5%",
        fontSize:16,
      },
      error:{
        fontSize:16,
        color:"red",
        fontStyle:"italic",
        marginLeft:20
      }
})