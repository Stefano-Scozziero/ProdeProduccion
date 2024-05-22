import { StyleSheet,View, ImageBackground, Text, TouchableOpacity } from 'react-native'
import AddButton from '../presentational/buttons/AddButton'
import DeleteButton from '../presentational/buttons/DeleteButton'
import { OrientationContext } from '../../utils/globals/context'
import * as ImagePicker from 'expo-image-picker'
import { useContext, useEffect, useState } from 'react'
import { AntDesign } from "@expo/vector-icons"
import InputFormProfile from './inputText/InputFormProfile'
import LoadingSpinner from './LoadingSpinner'
import ModalMessage from './modal/ModalMessage'
import colors from '../../utils/globals/colors'
import fonts from '../../utils/globals/fonts'
import { db, st as storage } from '../../app/services/firebase/config'
import auth from '@react-native-firebase/auth'
import ModalCamera from './modal/ModalCamera'

const Profile = () => {

    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')
    const [image, setImage] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [modalCameraVisible, setModalCameraVisible] = useState(false)
    const portrait = useContext(OrientationContext)
    const [isLoading, setIsLoading] = useState(true)
    const user = auth().currentUser
    const localId = user ? user.uid : null
    
    // Cargar los datos del usuario al iniciar
    useEffect(() => {
        if (user.uid) {
            const profileRef = db.ref(`/profiles/${user.uid}`)
            profileRef.on('value', snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    setUsername(data.username || user.displayName || '') // Utiliza user.displayName si username está vacío
                    setPhone(data.phone || '')
                    setImage(data.image || '')
                } else {
                }
                setIsLoading(false)
            })
    
            // Cleanup on unmount
            return () => profileRef.off('value')
        }
    }, [localId]);

    const handlerCloseModal = () => {
        setModalVisible(false)
    }
    const handlerCloseModalCamera = () => {
        setModalCameraVisible(false)
    }

    const pickImage = async (camera) => {
        let result;
        if (camera) {
          result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: true
          });
        } else {
          result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            base64: true
          });
        }
    
        // Verifica si el usuario canceló la toma de la foto
        if (!result.canceled) {
            // Codifica la imagen en base64 para enviar a Firebase
            
            const imageBase64 =  'data:image/jpeg;base64,' + result.assets[0].base64;
            updateProfileImage(imageBase64) // Llama a la función para actualizar la imagen en Firebase
        }
        setModalCameraVisible(false)
      };

      

    const updateProfileImage = async (imageBase64) => {
        if (user) {
            setIsLoading(true);
            // Guarda la imagen en el almacenamiento de Firebase
            const reference = storage().ref(`profiles/${user.uid}/profilePicture.png`);
            await reference.putString(imageBase64, 'data_url');
    
            // Obtiene la URL de la imagen almacenada
            const imageUrl = await reference.getDownloadURL();
    
            // Actualiza la base de datos en tiempo real con la URL de la imagen
            db.ref(`/profiles/${user.uid}`).update({
                image: imageUrl
            }, error => {
                if (error) {
                    console.log(error)
                    setModalVisible(true)
                } else {
                    console.log(error)
                    setImage(imageUrl)
                    
                }
                setIsLoading(false)
                
            })
        }
    }
    
    // Función para actualizar el perfil del usuario
    const onSubmit = async () => {
        if (user.uid) {
            setIsLoading(true);
            db.ref(`/profiles/${user.uid}`).update({
                username: username,
                phone: phone,
                image: image
            }, (error) => {
                if (error) {
                    setModalVisible(true)
                }
                setIsLoading(false)
            })
        }
    }


    if (isLoading) return <LoadingSpinner />;

  return (
    <ImageBackground source={require('../../../assets/fondodefinitivo.png')} style={[styles.main, !portrait && styles.mainLandScape]}>
        <View style={[styles.container, !portrait && styles.containerLandScape]}>
            <Text style={styles.title}> Agregar imagen de perfil</Text>
            <ImageBackground
                source={image ? { uri: image } : user?.photoURL ? { uri: user.photoURL } : require('../../../assets/usuario.png')}
                style={[styles.image, !portrait && styles.imageLandScape]}>
                <TouchableOpacity style={styles.containerImage} onPress={() => setModalCameraVisible(true)}>
                    <AntDesign name='pluscircleo' color={"white"} size={60}/>
                </TouchableOpacity>
            </ImageBackground>
            <View style={[styles.Button, !portrait && styles.ButtonLandScape]}>
                <InputFormProfile
                    label="Usuario"
                    value={username ? username : user.displayName}
                    onChangeText={(text) => setUsername(text)} // Agrega un manejador para el cambio de texto
                    isSecure={false}
                />
                <InputFormProfile
                    label="Celular"
                    value={phone ? phone : user.phoneNumber}
                    isSecure={false}
                    onChangeText={(text) => setPhone(text)}
                    
                />
                <AddButton title={"Actualizar Datos"} onPress={onSubmit}/>
                <DeleteButton title='Eliminar cuenta'/>
            </View>
        </View>
        <ModalMessage 
            textButton='Volver a intentar' 
            text="No se pudo guardar informacion" 
            modalVisible={modalVisible} 
            onclose={handlerCloseModal}/>
        <ModalCamera 
            textButton='Volver'
            textCamera={'Camara'}
            textGallery={'Galeria'}
            modalVisible={modalCameraVisible} 
            onclose={handlerCloseModalCamera}
            pickImage={pickImage}
        /> 
        
    </ImageBackground>
  )
}

export default Profile

const styles = StyleSheet.create({
    main:{
        flex: 1,
        width: '100%',
        height: '100%'
    },
    mainLandScape:{
        flexDirection: 'row'
    },
    container:{
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerLandScape:{
        flexDirection: 'row',
        marginTop: 0,
    },
    image:{
        width: 210,
        height: 210,
        borderRadius: 100
    },
    imageLandScape:{
        width: 150,
        height: 150,
        bottom: '4%'
    },
    containerImage:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Button:{
        marginTop: 10,
        alignItems: 'center',
        width: 300
    },
    ButtonLandScape:{
        flexDirection: 'column',
        marginTop: 0,
        bottom: '3%'
    },
    title:{
        fontSize:19,
        textAlign: 'center',
        color: colors.white,
        bottom: 10,
        fontFamily:fonts.russoOne,
    },
    text:{
        fontSize:19,
        top: 7,
        color: colors.white,
        fontFamily:fonts.russoOne,
    },
    
})