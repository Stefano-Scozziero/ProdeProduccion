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
<<<<<<< HEAD
import ModalMessage from '../../components/presentational/modal/ModalMessage';
import auth from '@react-native-firebase/auth';
import { db } from '../../app/services/firebase/config';
=======
import CustomModal from '../../components/presentational/modal/CustomModal';
import { database, auth } from '../../app/services/firebase/config';
>>>>>>> testing/master
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
<<<<<<< HEAD
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handlerCloseModal = () => {
    setModalVisible(false);
=======
  const [modalMessage, setModalMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [navigateToLogin, setNavigateToLogin] = useState(false); // Nuevo estado para manejar la navegación
  const db = database()

  const handlerCloseModal = () => {
    setModalVisible(false);
    if (navigateToLogin) {
      navigation.navigate("Login");
    }
>>>>>>> testing/master
  };

  const checkIfAdmin = async (userId) => {
    const adminRef = db.ref(`admins/${userId}`);
    const snapshot = await adminRef.once('value');
    return snapshot.exists();
  };

  const onSubmit = async () => {
    try {
<<<<<<< HEAD
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
=======
      setIsLoggingIn(true);
      Keyboard.dismiss();

      // Validar los datos con `yup`
      try {
        await registerSchema.validate({ email, password, confirmPassword }, { abortEarly: false });
      } catch (validationErrors) {
        validationErrors.inner.forEach((error) => {
          if (error.path === 'email') {
            setErrorEmail(error.message);
          } else if (error.path === 'password') {
            setErrorPassword(error.message);
          } else if (error.path === 'confirmPassword') {
            setErrorConfirmPassword(error.message);
          }
        });
        setIsLoggingIn(false); // Desactivar el spinner si hay errores de validación
        return;
      }

      // Registro del usuario con Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Enviar verificación de email
      try {
        await userCredential.user.sendEmailVerification();
        setModalMessage('Se ha enviado un enlace para verificar tu email. Revisa tu casilla de Correo');
        setModalVisible(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNavigateToLogin(true); // Marca que después de cerrar el modal se debe navegar a Login
        setIsLoggingIn(false); // Desactivar el spinner después de la operación exitosa
      } catch (error) {
        setModalMessage("Error al enviar el email de verificación");
        setModalVisible(true);
        console.error("Error al enviar email de verificación:", error);
        setIsLoggingIn(false); // Desactivar el spinner en caso de error
      }

      // Verificar si el usuario es administrador
      const isAdmin = await checkIfAdmin(userCredential.user.uid);

      // Guardar la sesión en la base de datos local
      await deleteSession();
      await insertSession({
        email: userCredential.user.email,
        idToken: await userCredential.user.getIdToken(),
        localId: userCredential.user.uid,
        name: userCredential.user.displayName,
        image: userCredential.user.photoURL,
      });

      // Actualizar el estado en Redux
      dispatch(setUser({
        idToken: await userCredential.user.getIdToken(),
        localId: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        image: userCredential.user.photoURL,
      }));
      dispatch(setAdmin(isAdmin));

    } catch (error) {
      // Manejo de errores de Firebase
      setErrorEmail("");
      setErrorPassword("");
      setErrorConfirmPassword("");
      setIsLoggingIn(false); // Asegúrate de desactivar el spinner en caso de error

      switch (error.code) {
        case "auth/invalid-email":
          setErrorEmail("Email no válido");
          break;
        case "auth/email-already-in-use":
          setErrorEmail("El email ya está en uso");
>>>>>>> testing/master
          break;
        case "auth/weak-password":
          setErrorPassword("Contraseña débil");
          break;
        default:
<<<<<<< HEAD
          setErrorEmail("Error en el registro");
          break;
      }
    }
  }
  
=======
          setModalMessage("Error en el registro");
          setModalVisible(true);
          break;
      }
    }
  };
>>>>>>> testing/master

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
<<<<<<< HEAD
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
=======

      {isLoggingIn && <LoadingSpinner message={'Cargando...'} />}

      <CustomModal
        text={modalMessage}
        secondaryButtonText="Aceptar"
        modalVisible={modalVisible}
        onPrimaryAction={handlerCloseModal} // Navegación ocurre después de cerrar el modal
        onClose={handlerCloseModal} // Manejo de cierre del modal
      />
    </>
  );
};

>>>>>>> testing/master

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
