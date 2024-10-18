import { StyleSheet, Text, View, Image, Pressable, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import InputForm from '../../components/presentational/inputText/InputForm'
import fonts from '../../utils/globals/fonts'
import colors from '../../utils/globals/colors'
import SubmitButton from '../../components/presentational/buttons/SubmitButton'
import { auth } from '../../app/services/firebase/config';


const ForgotYourPass = ({navigation}) => {
  const [email,setEmail] = useState("")

  const onSubmit = async () => {
    if (email.trim() === "") {
      alert("Por favor, ingresa un email válido.");
      return;
    }
    
    try {
      await auth().sendPasswordResetEmail(email);
      alert('Se ha enviado un enlace para restablecer tu contraseña a tu email.');
      navigation.navigate("Login"); // Opcional: Redirige al usuario al login tras el envío
    } catch (error) {
      alert("Error al enviar el email, verifica que el email esté registrado o intenta más tarde.");
      console.error("Error al enviar email de restablecimiento:", error);
    }
  }
  

  return (
    <>
    
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={styles.main}>
      <Image source={require('../../../assets/logo.png')} style={styles.image} resizeMode='contain'/>
      <Text style={styles.title}>PRODESCO</Text>
      <View style={styles.container}>
        <InputForm
          label="Correo Electronico"
          value={email}
          onChangeText={(t) => setEmail(t)}
          isSecure={false}
        />
        <SubmitButton onPress={onSubmit} title="RESTABLECER"/>
        <Pressable onPress={()=> navigation.navigate("Login")} >
          <Text style={styles.subLink}>VOLVER AL LOGIN</Text>
        </Pressable>
      </View>
    </ImageBackground>
  </>
  )

}

export default ForgotYourPass

const styles = StyleSheet.create({
  main:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  container:{
    width:"90%",
    gap:15,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:20
  },
  subLink:{
    fontSize:14,
    fontFamily:fonts.JosefinSansBold,
    color: colors.orange
  },
  image: {
    width: '100%',
    height: 130,
    bottom: '6.5%'
  },
  title:{
    fontSize:50,
    textAlign: 'center',
    color: colors.white,
    bottom: 30,
    fontFamily:fonts.russoOne,
  },
})