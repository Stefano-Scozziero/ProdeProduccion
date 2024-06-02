import { StyleSheet, Text, View, Pressable, Image, ImageBackground, Keyboard } from 'react-native';
import InputForm from '../../components/presentational/inputText/InputForm';
import SubmitButton from '../../components/presentational/buttons/SubmitButton';
import { useState } from 'react';
import colors from '../../utils/globals/colors';
import fonts from '../../utils/globals/fonts';
import { useDispatch } from 'react-redux';
import { setUser, setAdmin } from '../../features/auth/authSlice';
import { registerSchema } from '../../utils/validations/authSchema';
import { deleteSession, insertSession } from '../../utils/db';
import ModalMessage from '../../components/presentational/modal/ModalMessage';
import auth from '@react-native-firebase/auth';
import { db } from '../../app/services/firebase/config';
import LoadingSpinner from '../../components/presentational/LoadingSpinner2';

const Register = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handlerCloseModal = () => {
    setModalVisible(false);
  };

  const checkIfAdmin = async (userId) => {
    const adminRef = db.ref(`admins/${userId}`);
    const snapshot = await adminRef.once('value');
    return snapshot.exists();
  };

  const onSubmit = async () => {
    try {
      setIsLoggingIn(true)
      Keyboard.dismiss();
      registerSchema.validateSync({ email, password, confirmPassword });

      // Realizar el registro del usuario con Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      try {
        await userCredential.user.sendEmailVerification();
        alert('Se ha enviado un enlace para verificar tu email. Revise su casilla de Correo');
        navigation.navigate("Login"); // Opcional: Redirige al usuario al login tras el envío
      } catch (error) {
        alert("Error al enviar el email");
        console.error("Error al enviar email de restablecimiento:", error);
      }
     

      if (userCredential && userCredential.user) {
        // Obtener el idToken del usuario registrado
        const idToken = await userCredential.user.getIdToken();

        const { email, uid, displayName, photoURL } = userCredential.user;

        // Inserta la sesión en la base de datos local
        await deleteSession();
        await insertSession({
          email: email,
          idToken: idToken,
          localId: uid,
          name: displayName,
          image: photoURL
        });

        // Verifica si el usuario es administrador
        const isAdmin = await checkIfAdmin(uid);

        // Despacha el estado del usuario registrado y el estado de admin en Redux
        dispatch(setUser({
          idToken: idToken,
          localId: uid,
          email: email,
          name: displayName,
          image: photoURL
        }));
        dispatch(setAdmin(isAdmin));
        setIsLoggingIn(false)
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      setErrorEmail("");
      setErrorPassword("");
      setIsLoggingIn(false)
      setErrorConfirmPassword("");
      switch (error.code) {
        case "auth/invalid-email":
          setErrorEmail("Email no válido");
          
          break;
        case "auth/email-already-in-use":
          setErrorEmail("Email ya está en uso");
          break;
        case "auth/weak-password":
          setErrorPassword("Contraseña débil");
          break;
        default:
          setErrorEmail("Error en el registro");
          break;
      }
    }
  }
  

  return (
    <>
      <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={styles.main}>
        <Image source={require('../../../assets/logo.png')} style={styles.image} resizeMode='contain' />
        <Text style={styles.title}>REGISTRO</Text>
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
          <InputForm
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={(t) => setConfirmPassword(t)}
            isSecure={true}
            error={errorConfirmPassword}
          />
          <SubmitButton onPress={onSubmit} title="CREAR CUENTA" />
          <Text style={styles.sub}>¿Ya tienes una cuenta?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.subLink}>INICIAR SESIÓN</Text>
          </Pressable>
        </View>
      </ImageBackground>
      {isLoggingIn && 
      <LoadingSpinner
        message={'Cargando...'}
      />}
      <ModalMessage 
        textButton='Volver a intentar' 
        text="Error en el registro" 
        modalVisible={modalVisible} 
        onclose={handlerCloseModal}
      />
    </>
  );
}

export default Register;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    width: "90%",
    gap: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontFamily: fonts.russoOne,
    fontSize: 55,
    color: colors.white,
    bottom: 30
  },
  sub: {
    fontSize: 14,
    fontFamily: fonts.JosefinSansBold
  },
  subLink: {
    fontSize: 14,
    fontFamily: fonts.JosefinSansBold,
    color: colors.orange
  },
  image: {
    width: '100%',
    height: 130,
    bottom: '6.5%'
  },
});
