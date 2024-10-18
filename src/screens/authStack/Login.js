import { StyleSheet, Text, View, ImageBackground, Image, Pressable, Keyboard } from 'react-native'
import InputForm from '../../components/presentational/inputText/InputForm'
import { useState, useEffect } from 'react'
import SubmitButton from '../../components/presentational/buttons/SubmitButton'
import SubmitButtonBgn from '../../components/presentational/buttons/SubmitButtonbgn'
import colors from '../../utils/globals/colors'
import fonts from '../../utils/globals/fonts'
import { useDispatch } from 'react-redux'
import { setUser, setAdmin } from '../../features/auth/authSlice'
import { loginSchema } from '../../utils/validations/authSchema'
import { deleteSession, insertSession } from '../../utils/db'
import ModalMessage from '../../components/presentational/modal/ModalMessage'
import { GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin'
import { database, auth } from '../../app/services/firebase/config'
import LoadingSpinner from '../../components/presentational/LoadingSpinner2'

const Login = ({navigation}) =>  {

    const dispatch = useDispatch()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const db = database()

    const handlerCloseModal = () => {
      setModalVisible(false)
    }

    const checkIfAdmin = async (userId) => {
      const adminRef = db.ref(`admins/${userId}`);
      const snapshot = await adminRef.once('value');
      return snapshot.exists();
    };
    
    const authWithGoogle = async () => {
      try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()

        // Verifica si userInfo o userInfo.data.idToken son nulos o indefinidos
        if (!userInfo || !userInfo.data || !userInfo.data.idToken) {
          return; // Sale de la función si el usuario canceló la autenticación
        }

        setIsLoggingIn(true)
        const googleCredential = auth.GoogleAuthProvider.credential(userInfo?.data?.idToken)
        const userCredential = await auth().signInWithCredential(googleCredential)
        if (userCredential && userCredential.user) {
          const { email, uid, displayName, photoURL, emailVerified } = userCredential.user
          const idToken = await userCredential.user.getIdToken()
          await insertSession({
            email,
            idToken,
            localId: uid,
            name: displayName,
            image: photoURL,
            emailVerified
          })
    
          const isAdmin = await checkIfAdmin(uid)
          dispatch(setUser({
            email,
            idToken,
            localId: uid,
            name: displayName,
            image: photoURL,
            emailVerified
          }))
          dispatch(setAdmin(isAdmin))
        } else {
          console.log("No se pudo autenticar el usuario con Firebase usando Google.")
        }
        setIsLoggingIn(false)
      } catch (error) {
        if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
          console.error("Error durante la autenticación con Google:", error)
          setIsLoggingIn(false)
        }
      }
    }
    
    useEffect(() => {
      const checkAuthStatus = async () => {
        const user = await GoogleSignin.getCurrentUser()
        if (user !== null) {
          authWithGoogle()
        }
      }
    
      checkAuthStatus()
    }, [dispatch])
  
    const onSubmit = async () => {
      try {
        Keyboard.dismiss()
        setIsLoggingIn(true)
        await loginSchema.validate({ email, password })
        const userCredential = await auth().signInWithEmailAndPassword(email, password)
        if (userCredential && userCredential.user) {
          const { email, uid, displayName, photoURL, emailVerified } = userCredential.user
          if (!emailVerified) {
            setIsLoggingIn(false)
            setErrorEmail("El correo electrónico no está verificado.")
            return
          }
          const idToken = await userCredential.user.getIdToken()
  
          await deleteSession()
          await insertSession({
            localId: uid,
            email,
            idToken,
            name: displayName,
            image: photoURL,
            emailVerified
          })
  
          const isAdmin = await checkIfAdmin(uid)
          dispatch(setUser({
            localId: uid,
            email,
            idToken,
            name: displayName,
            image: photoURL,
            emailVerified
          }))
          dispatch(setAdmin(isAdmin))
        } else {
          setErrorEmail("Usuario no autenticado")
          setErrorPassword("")
        }
        setIsLoggingIn(false)
      } catch (error) {
        setIsLoggingIn(false)
        if (error.name === 'ValidationError') {
          if (error.path === 'email') {
            setErrorEmail(error.message)
          } else if (error.path === 'password') {
            setErrorPassword(error.message)
          }
        } else {
          setErrorEmail("")
          setErrorPassword("")
          switch (error.code) {
            case "auth/user-not-found":
            case "auth/invalid-credential":
              setErrorPassword("Email o Contraseña invalido")
              break
            default:
              console.error("Error durante la autenticación con Firebase:", error)
              setModalVisible(true)
              break
          }
        }
      }
    }
  
  return (
    <>
      <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={styles.main}>
        <Image source={require('../../../assets/logo.png')} style={styles.image} resizeMode='contain'/>
            <Text style={styles.title}>PRODESCO</Text>
            <View style={styles.container}>
              <InputForm
                  label="Correo Electrónico"
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
              <SubmitButton  onPress={onSubmit} title="INICIAR SESIÓN"/>
              
              <SubmitButtonBgn onPress={()=> navigation.navigate("Register")} title="REGÍSTRESE AQUÍ"/>
              <Pressable onPress={()=> navigation.navigate("ForgotYourPass")}>
                <Text style={styles.btnText}>¿Olvidó su contraseña?</Text>
              </Pressable> 
            </View>
            <View style={styles.containerImages}>
              <Pressable style={styles.btnImages}>
                <Image source={require('../../../assets/facebook.png')} style={styles.images} resizeMode='contain'/>
                <Text style={styles.btnText}>Facebook</Text>
              </Pressable>
              <Pressable style={styles.btnImages} onPress={authWithGoogle}>
                <Image source={require('../../../assets/google.png')} style={styles.images} resizeMode='contain'/>
                <Text style={styles.btnText}>Google</Text>
              </Pressable> 
            </View>
            
      </ImageBackground>
      {isLoggingIn && 
      <LoadingSpinner
        message='Iniciando Sesion...'
      />}
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
      top: '10%'
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