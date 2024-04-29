import { StyleSheet, Text, View , ImageBackground, Image, Pressable, } from 'react-native'
import InputForm from '../components/presentational/inputText/InputForm'
import {useState, useEffect} from 'react'
import SubmitButton from '../components/presentational/buttons/SubmitButton'
import SubmitButtonBgn from '../components/presentational/buttons/SubmitButtonbgn'
import colors from '../utils/globals/colors'
import fonts from '../utils/globals/fonts'
import { useLoginMutation } from '../app/services/auth'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/authSlice'
import { loginSchema } from '../utils/validations/authSchema'
import { deleteSession, insertSession } from '../utils/db'
import ModalMessage from '../components/presentational/modal/ModalMessage'
import { GoogleSignin} from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) =>  {

    const dispatch = useDispatch()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [triggerLogin] = useLoginMutation()
    const [modalVisible, setModalVisible] = useState(false)

    const handlerCloseModal = () => {
      setModalVisible(false)
    }

    const authWithGoogle = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken)
        const userCredential = await auth().signInWithCredential(googleCredential)
        if (userCredential && userCredential.user) {
            dispatch(setUser({
                email: userCredential.user.email,
                idToken: userInfo.idToken,
                localId: userCredential.user.uid,
                name: userCredential.user.displayName,
                image: userCredential.user.photoURL
            }));
            insertSession({
              email: userCredential.user.email,
              idToken: userInfo.idToken,
              localId: userCredential.user.uid,
              name: userCredential.user.displayName,
              image: userCredential.user.photoURL
          })
        } else {
            console.log("No se pudo autenticar el usuario con Firebase usando Google.")
        }
      } catch (error) {
          console.error("Error durante la autenticación con Google:", error)
      }
    }

    useEffect(() => {
      const checkAuthStatus = async () => {
        const user = await GoogleSignin.getCurrentUser();
        if (user !== null) {
          authWithGoogle()
        }
      }
    
      checkAuthStatus()
    }, [dispatch])
  

    const onSubmit = async () => {
      try {
        // Valida el formulario (si tienes validación de formulario como antes)
        loginSchema.validateSync({ email, password })
        // Realiza la mutación o solicitud, usando también el UID si necesario
        const { data, error } = await triggerLogin({ email, password }) // Suponiendo que puedas pasar UID
        if (error) {
            console.log("Error en la autenticación:", error)
            setModalVisible(true)
        } else {

            deleteSession()
            insertSession(data)
            dispatch(setUser({
                email: data.email, 
                idToken: data.idToken, 
                localId: data.localId
            }))
        }
        setErrorEmail("Usuario no autenticado")
        setErrorPassword("")
      } catch (error) {
          setErrorEmail("")
          setErrorPassword("")
          // Mostrar mensajes de error específicos según el campo que falló
          switch (error.path) {
              case "email":
                  setErrorEmail(error.message)
                  break
              case "password":
                  setErrorPassword(error.message)
                  break
              default:
                  break
          }
      }
  }
  
return (
    <>
      <ImageBackground source={require('../../assets/fondodefinitivo.png')} style={styles.main}>
        <Image source={require('../../assets/logo.png')} style={styles.image} resizeMode='contain'/>
            <Text style={styles.title}>PRODESCO</Text>
            <View style={styles.container}>
              <InputForm
                  label="Correo Electronico"
                  value={email}
                  onChangeText={(t) => setEmail(t)}
                  isSecure={false}
                  error={errorEmail}
                  
              />
              <InputForm
                  label="Contraseña"
                  value={password}
                  onChangeText={(t) => setPassword(t)}
                  isSecure={true}
                  error={errorPassword}
              />
              <SubmitButton  onPress={onSubmit} title="INICIAR SESION"/>
              <SubmitButtonBgn onPress={()=> navigation.navigate("Register")} title="REGISTRESE AQUI"/>
              <Pressable onPress={()=> navigation.navigate("ForgotYourPass")}>
                <Text style={styles.btnText}>Olvido su contraseña?</Text>
              </Pressable> 
            </View>
            <View style={styles.containerImages}>
              <Pressable style={styles.btnImages}>
                <Image source={require('../../assets/facebook.png')} style={styles.images} resizeMode='contain'/>
                <Text style={styles.btnText}>Facebook</Text>
              </Pressable>
              <Pressable style={styles.btnImages} onPress={authWithGoogle}>
                <Image source={require('../../assets/google.png')} style={styles.images} resizeMode='contain'/>
                <Text style={styles.btnText}>Google</Text>
              </Pressable> 
            </View>
            
      </ImageBackground>
      <ModalMessage 
      textButton='Volver a intentar' 
      text="Email o Contraseña invalido" 
      modalVisible={modalVisible} 
      onclose={handlerCloseModal}/>
    </>
  )
}


export default Login

const styles = StyleSheet.create({
    main:{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    container:{
      width:"70%",
      gap:15,
      borderRadius:10,
      justifyContent:"center",
      alignItems:"center"
    },
    containerImages:{
      flexDirection: 'row',
      justifyContent:"center",
      alignItems:"center",
      width: '80%',
      top: '20%'
    },
    title:{
      fontSize:50,
      textAlign: 'center',
      color: colors.white,
      bottom: 30,
      fontFamily:fonts.russoOne,
    },
    image: {
      width: '100%',
      height: 130,
      bottom: '8%'
    },
    images: {
      width: 40,
      height: 40,
      marginHorizontal: 10
    },
    btnImages: {
        width:"45%",
        borderWidth: 1,
        flexDirection: 'row',
        borderColor: colors.orange,
        marginHorizontal: 5,
        padding:5,
        alignItems:"center",
        justifyContent: 'center',
        borderRadius:10,
        bottom: '30%'
    },
    btnText: {
      fontSize: 14,
      color: colors.white
    }
})