import { StyleSheet, Text, View,TextInput } from 'react-native'
import colors from '../../../utils/globals/colors'


const InputFormProfile = ({label,value, onChangeText,isSecure,error, editable}) => {


  return (
    <View style={styles.inputContainer}>
        <TextInput  
            value={value}  
            onChangeText={onChangeText} 
            style={styles.input}
            secureTextEntry={isSecure}
            placeholder={label}
            placeholderTextColor={colors.black}
            editable={editable}
            
            
        />
        {error ? <View><Text style={styles.error}>{error}</Text></View> : null}
    </View>
  )
}


export default InputFormProfile


const styles = StyleSheet.create({
    inputContainer:{
        width:"100%",
        alignItems: 'center'
    },
    input:{
        width:"70%",
        borderWidth:0,
        borderWidth:1,
        borderColor: colors.orange,
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