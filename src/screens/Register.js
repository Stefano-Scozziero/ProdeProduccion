import { StyleSheet, Text, View, Pressable, Image, ImageBackground } from 'react-native'
import InputForm from '../components/presentational/inputText/InputForm'
import SubmitButton from '../components/presentational/buttons/SubmitButton'
import {useState} from 'react'
import colors from '../utils/globals/colors'
import fonts from '../utils/globals/fonts'
import { useRegisterMutation } from '../app/services/auth'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/authSlice'
import { registerSchema } from '../utils/validations/authSchema'
import { deleteSession, insertSession } from '../utils/db'
import ModalMessage from '../components/presentational/modal/ModalMessage'

const Register = ({navigation}) => {

  const dispatch = useDispatch()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [errorEmail,setErrorEmail] = useState("")
  const [errorPassword,setErrorPassword] = useState("")
  const [errorConfirmPassword,setErrorConfirmPassword] = useState("")
  const [triggerRegister] = useRegisterMutation()
  const [modalVisible, setModalVisible] = useState(false)

  const handlerCloseModal = () => {
    setModalVisible(false)
  }


  const onSubmit = async () => {
    try {
      registerSchema.validateSync({email,password,confirmPassword})
      const {data,error} = await  triggerRegister({email,password})

      if(error){
        //console.log(error.data.error.message)
        setModalVisible(true)
      }

      deleteSession()
      insertSession(data)
      dispatch(setUser({email:data.email,idToken:data.idToken,localId:data.localId}))
    } catch (error) {
      setErrorEmail("")
      setErrorPassword("")
      setErrorConfirmPassword("")
      switch(error.path){
        case "email":
          setErrorEmail(error.message)
          break
        case "password":
          setErrorPassword(error.message)
          break
        case "confirmPassword":
          setErrorConfirmPassword(error.message)
          break
        default:
          break
      }
    }

  }

  return (
    <>
      <ImageBackground source={require('../../assets/fondodefinitivo.png')} style={styles.main}>
        <Image  source={require('../../assets/logo.png')} style={styles.image} resizeMode='contain'/>
        <Text style={styles.title}>REGISTRO</Text>
        <View style={styles.container}>
          <InputForm
            label="Email"
            value={email}
            onChangeText={(t) => setEmail(t)}
            isSecure={false}
            error={errorEmail}
          />
          <InputForm
            label="Password"
            value={password}
            onChangeText={(t) => setPassword(t)}
            isSecure={true}
            error = {errorPassword}
          />
          <InputForm
            label="Confirmar Password"
            value={confirmPassword}
            onChangeText={(t) => setConfirmPassword(t)}
            isSecure={true}
            error={errorConfirmPassword}
          />
          <SubmitButton onPress={onSubmit} title="CREAR CUENTA"/>
          <Text style={styles.sub}>Ya tenes una cuenta?</Text>
          <Pressable onPress={()=> navigation.navigate("Login")} >
            <Text style={styles.subLink}>INICIAR SESION</Text>
          </Pressable>
        </View>
      </ImageBackground>
      <ModalMessage 
      textButton='Volver a intentar' 
      text="Error en el registro" 
      modalVisible={modalVisible} 
      onclose={handlerCloseModal}/>
      </>
  )
}

export default Register

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
      paddingVertical:20,
    },
    title:{
      fontFamily:fonts.russoOne,
      fontSize:55,
      color: colors.white,
      bottom: 30
    },
    sub:{
      fontSize:14,
      fontFamily:fonts.JosefinSansBold
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
})