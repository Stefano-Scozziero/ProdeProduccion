// Importaciones necesarias
import { StyleSheet, View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import AddButton from '../presentational/buttons/AddButton';
import DeleteButton from '../presentational/buttons/DeleteButton';
import { OrientationContext } from '../../utils/globals/context';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import { AntDesign } from "@expo/vector-icons";
import InputFormProfile from './inputText/InputFormProfile';
import LoadingSpinner from './LoadingSpinner';
import CustomModal from './modal/CustomModal';
import colors from '../../utils/globals/colors';
import fonts from '../../utils/globals/fonts';
import { auth, database, storage } from '../../app/services/firebase/config';
import ModalCamera from './modal/ModalCamera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

// Importaciones adicionales
import { useDispatch } from 'react-redux';
import { clearUser } from '../../features/auth/authSlice'; // Asegúrate de que la ruta sea correcta
import { deleteSession } from '../../utils/db';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalCameraVisible, setModalCameraVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const portrait = useContext(OrientationContext);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth().currentUser;
  const db = database();
  const storageInstance = storage();
  const dispatch = useDispatch();
  const [accountDeletedModalVisible, setAccountDeletedModalVisible] = useState(false);

  // useEffect para cargar los datos de perfil desde la base de datos
  useEffect(() => {
    if (user && user.uid) {
      const profileRef = db.ref(`/profiles/${user.uid}`);
      profileRef.on('value', snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const userName = data.username || user.displayName || '';
          setUsername(userName);
          setPhone(data.phone || '');
          setImage(data.image || '');
        }
        setIsLoading(false);
      });
      return () => profileRef.off('value');
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handlerCloseModal = () => setModalVisible(false);
  const handlerCloseModalCamera = () => setModalCameraVisible(false);

  // Funciones adicionales
  const clearUserData = async () => {
    try {
      // Si el usuario inició sesión con Google, cierra sesión de Google
      if (user?.providerData?.some(provider => provider.providerId === 'google.com')) {
        await GoogleSignin.signOut();
      }
      // Limpia el estado de Redux
      dispatch(clearUser());
      // Elimina la sesión almacenada
      await deleteSession();
    } catch (error) {
      console.error('Error during user data cleanup:', error);
    }
  };

  // Función para confirmar y eliminar la cuenta
  const confirmDeleteAccount = async () => {
    setDeleteConfirmVisible(false);
    setIsLoading(true);
    try {
      if (user) {
        // Eliminar datos del perfil en la base de datos
        await db.ref(`/profiles/${user.uid}`).remove();

        // Verificar si hay una imagen antes de intentar eliminarla
        if (image) {
          const imageRef = storageInstance.ref(`profiles/${user.uid}/profilePicture.png`);
          await imageRef.delete().catch((storageError) => {
            if (storageError.code !== 'storage/object-not-found') {
              throw storageError;
            }
          });
        }

        // Eliminar la cuenta de usuario
        await user.delete();

        // Realizar limpieza adicional
        await clearUserData();

      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error al eliminar la cuenta:', error);

      if (error.code === 'auth/requires-recent-login') {
        setModalVisible(true);
        setModalMessage('Por razones de seguridad, por favor vuelve a iniciar sesión y vuelve a intentar.');
      } else {
        setModalVisible(true);
        setModalMessage(`Error al eliminar la cuenta: ${error.message}`);
      }
    }
  };

  // Función para manejar el clic en "Eliminar cuenta"
  const handleDeleteAccount = () => {
    setDeleteConfirmVisible(true);
  };

  // Función para elegir una imagen desde la cámara o la galería
  const pickImage = async (camera, cameraType = ImagePicker.CameraType.front) => {
    let result;
    if (camera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        cameraType: cameraType,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
    }

    if (!result.canceled) {
      let imageUri = result.assets[0].uri;
      // Llama a la función para subir la imagen
      updateProfileImage(imageUri);
    }
    setModalCameraVisible(false);
  };

  // Función para actualizar la imagen del perfil en Firebase Storage
  const updateProfileImage = async (imageUri) => {
    if (user && user.uid) {
      setIsLoading(true);
      try {
        // Opcional: Comprimir la imagen antes de subirla
        const compressedUri = await compressImage(imageUri);

        // Convierte la URI en un blob
        const response = await fetch(compressedUri);
        const blob = await response.blob();

        // Sube el blob a Firebase Storage
        const reference = storageInstance.ref(`profiles/${user.uid}/profilePicture.png`);
        await reference.put(blob);

        // Obtiene la URL de descarga
        const imageUrl = await reference.getDownloadURL();

        // Actualiza la imagen en la base de datos
        db.ref(`/profiles/${user.uid}`).update({
          image: imageUrl
        });

        setImage(imageUrl);
      } catch (error) {
        setModalVisible(true);
        setModalMessage('Error al subir la imagen');
        console.log('Error al subir la imagen:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Función para comprimir la imagen (opcional)
  const compressImage = async (uri) => {
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return compressedImage.uri;
  };

  // Función para actualizar los datos del perfil en la base de datos
  const onSubmit = async () => {
    if (user && user.uid) {
      setIsLoading(true);
      db.ref(`/profiles/${user.uid}`).update({
        username: username,
        phone: phone,
        image: image
      }, (error) => {
        if (error) {
          setModalVisible(true);
          setModalMessage('Error al actualizar los datos');
        }
        setIsLoading(false);
      });
    }
  };

  



  // Mostrar spinner si se está cargando
  if (isLoading) return <LoadingSpinner message={'Procesando...'} />;

  return (
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
      <View style={[styles.container, !portrait && styles.containerLandScape]}>
        <Text style={styles.title}> Agregar imagen de perfil</Text>
        <ImageBackground
          source={image ? { uri: image } : user?.photoURL ? { uri: user.photoURL } : require('../../../assets/usuario.png')}
          style={[styles.image, !portrait && styles.imageLandScape]}>
          <TouchableOpacity style={styles.containerImage} onPress={() => setModalCameraVisible(true)}>
            <AntDesign name='pluscircleo' color={colors.white} size={50} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={[styles.Button, !portrait && styles.ButtonLandScape]}>
          <InputFormProfile
            label="Usuario"
            value={username}
            onChangeText={(text) => setUsername(text)}
            isSecure={false}
          />
          <InputFormProfile
            label="Celular"
            value={phone}
            isSecure={false}
            onChangeText={(text) => setPhone(text)}
          />
          <AddButton title={"Actualizar Datos"} onPress={onSubmit} />
          <DeleteButton title='Eliminar cuenta' onPress={handleDeleteAccount} />
        </View>
      </View>
      <CustomModal
        text={modalMessage}
        secondaryButtonText="Aceptar"
        modalVisible={modalVisible}
        onPrimaryAction={handlerCloseModal}
        onClose={handlerCloseModal}
      />
      <CustomModal
        text="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
        secondaryButtonText="Cancelar"
        primaryButtonText="Eliminar"
        modalVisible={deleteConfirmVisible}
        onPrimaryAction={confirmDeleteAccount}
        onClose={() => setDeleteConfirmVisible(false)}
      />
      <ModalCamera
        textButton='Volver'
        textCamera={'Camara'}
        textGallery={'Galeria'}
        modalVisible={modalCameraVisible}
        onclose={handlerCloseModalCamera}
        pickImage={pickImage}
      />
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  mainLandScape: {
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLandScape: {
    flexDirection: 'row',
    marginTop: 0,
  },
  image: {
    width: 210,
    height: 210,
    borderRadius: 105,
    overflow: 'hidden', 
    borderWidth: 2,
    borderColor: colors.black,
  },
  imageLandScape: {
    width: 150,
    height: 150,
    bottom: '4%'
  },
  containerImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Button: {
    marginTop: 10,
    alignItems: 'center',
    width: 300
  },
  ButtonLandScape: {
    flexDirection: 'column',
    marginTop: 0,
    bottom: '3%'
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.black,
    bottom: 10,
    fontFamily: fonts.russoOne,
  },
  text: {
    fontSize: 19,
    top: 7,
    color: colors.white,
    fontFamily: fonts.russoOne,
  },
});
