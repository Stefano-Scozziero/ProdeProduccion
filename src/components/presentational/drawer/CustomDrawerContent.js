import { DrawerContentScrollView } from '@react-navigation/drawer';
import { StyleSheet, View, Text, Image, Pressable, Switch, TouchableOpacity } from 'react-native';
import colors from '../../../utils/globals/colors';
import { Drawer } from 'react-native-paper';
import DrawerItem from './DrawerItem';
import DrawerIcon from './DrawerIcon';
import { clearUser } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteSession } from "../../../utils/db";
import { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { database, auth } from '../../../app/services/firebase/config';
import { DrawerActions } from '@react-navigation/native';
import { toggleRankedMode, toggleDarkMode } from '../../../features/preferences/preferencesSlice';

const CustomDrawerContent = (props) => {
  const { state, navigation } = props;
  const activeRoute = state.routes[state.index].name;
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.idToken);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const isRankedMode = useSelector((state) => state.preferences.isRankedMode); // Obtén el estado de Redux
  const isDarkMode = useSelector((state) => state.preferences.isDarkMode);
  const [profile, setProfile] = useState({});
  const user = auth().currentUser;
  const db = database();


  useEffect(() => {
    if (user && user.uid) {
      const profileRef = db.ref(`/profiles/${user.uid}`);
      profileRef.on('value', snapshot => {
        if (snapshot.exists()) {
          setProfile({
            email: user.email,
            ...snapshot.val()
          });
        }
      }, error => {
        console.error(error);
      });
      
      return () => profileRef.off('value'); // Cleanup del listener
    }
  }, [user]);

  const onLogout = async () => {
    try {
      if (profile?.email !== null) {
        await GoogleSignin.signOut();
      }
      await auth().signOut();
      await navigation.dispatch(DrawerActions.closeDrawer());
      dispatch(clearUser());
      deleteSession();
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  const goToRoute = (routeName, screenName) => {
    navigation.navigate(routeName, { screen: screenName });
  };

  const goToHome = () => {
    navigation.navigate('Inicio', { screen: 'Home' });
  };

  const handleToggleRankedMode = () => {
    dispatch(toggleRankedMode());
    // Aquí puedes agregar lógica adicional si es necesario
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
    // Aquí puedes agregar lógica adicional si es necesario
  };

  return (
    <DrawerContentScrollView {...props} style={styles.containerItems}>
      <View style={styles.containerHeader}>
        <View style={styles.profileContainer}>
          <Image
            source={profile?.image ? { uri: profile.image } : user?.photoURL ? { uri: user.photoURL } : require('../../../../assets/usuario.png')}
            style={styles.profileImage}
            resizeMode='cover'
          />
          <Text style={styles.profileText}>{profile?.username || user?.displayName || "Nombre de Usuario"}</Text>
          <Text style={styles.profileText}>{profile?.email || user?.email || "Correo Electrónico"}</Text>
          {isRankedMode && (
            <View style={styles.coinsContainer}>
              <Text style={styles.coinsText}>Boletos: {profile?.boletos || 0}</Text>
              {/*onPress={() => navigation.navigate('AumentarCoins')*/}
              <TouchableOpacity style={styles.addCoinsButton} >
                <Text style={styles.addCoinsButtonText}>Añadir</Text>
              </TouchableOpacity>
          </View>
          )}
        </View>
      </View>

      {/* Switch para cambiar de modo */}
      <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Modo Ranked</Text>
          <Switch
          trackColor={{ false: colors.gray, true: colors.orange }}
          thumbColor={isRankedMode ? colors.black : colors.white}
          ios_backgroundColor={colors.gray}
          onValueChange={handleToggleRankedMode}
          value={isRankedMode}
        />
      </View>
      {/* Switch para cambiar Modo Oscuro 
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Modo Oscuro</Text>
        <Switch
          trackColor={{ false: colors.gray, true: colors.orange }}
          thumbColor={isDarkMode ? colors.black : colors.white}
          ios_backgroundColor={colors.gray}
          onValueChange={handleToggleDarkMode}
          value={isDarkMode}
        />
      </View>*/}
      <Drawer.Section>
        <Pressable style={[styles.drawerButton, activeRoute === 'Inicio' ? styles.drawerItemActive : styles.drawerItemInactive]} onPress={goToHome}>
          <DrawerIcon nameIcon="home" focused={activeRoute === 'Inicio'} />
          <Text style={[styles.text, activeRoute === 'Inicio' ? styles.activeText : styles.inactiveText]}>Inicio</Text>
        </Pressable>
        <DrawerItem navigation={navigation} activeRoute={activeRoute} route='¿Como Jugar?' icon='help' title='¿Como Jugar?' />
        <DrawerItem navigation={navigation} activeRoute={activeRoute} route='Mensajes' icon='paper-plane' title='Notificaciones' />
      </Drawer.Section>

      <Drawer.Section>
        <Text style={styles.textGroups}>Social</Text>
        <DrawerItem navigation={navigation} activeRoute={activeRoute} route='Amigos' icon='slideshare' title='Amigos' />
        <DrawerItem navigation={navigation} activeRoute={activeRoute} route='Compartir' icon='link' title='Compartir' />
      </Drawer.Section>

      <Drawer.Section>
        <Text style={styles.textGroups}>Cuenta</Text>
        <DrawerItem navigation={navigation} activeRoute={activeRoute} route='Editar Perfil' icon='user' title='Editar Perfil' />
        {/*<DrawerItem navigation={navigation} activeRoute={activeRoute} route='Preferencias' icon='cog' title='Preferencias' />*/}
        {idToken && (
          <Pressable style={styles.drawerButton} onPress={onLogout}>
            <DrawerIcon nameIcon="log-out" focused={activeRoute === 'Cerrar Sesion'} />
            <Text style={[styles.text, activeRoute === 'Cerrar Sesion' ? styles.activeText : styles.inactiveText]}>Cerrar Sesion</Text>
          </Pressable>
        )}
      </Drawer.Section>
      
      {isAdmin && (
        <Drawer.Section>
          <Pressable style={[styles.drawerButton, activeRoute === 'Administrador' ? styles.drawerItemActive : styles.drawerItemInactive]} onPress={() => goToRoute('Administrador', 'Administrador')}>
            <DrawerIcon nameIcon="game-controller" focused={activeRoute === 'Administrador'} />
            <Text style={[styles.text, activeRoute === 'Administrador' ? styles.activeText : styles.inactiveText]}>Administrador</Text>
          </Pressable>
        </Drawer.Section>
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  profileContainer: {
    height: '90%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 5
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileText: {
    width: '100%',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: '400',
    color: colors.white,
    paddingTop: 5,
  },
  boletosText: {
    width: '100%',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.white,
    paddingTop: 5,
  },
  sumText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.white,
    paddingTop: 5,
  },
  containerHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  textGroups: {
    left: 27,
    marginVertical: 10,
    fontSize: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: colors.white
  },
  containerItems: {
    flex: 1,
    backgroundColor: colors.blackGray,
    color: colors.white,
  },
  drawerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  text: {
    left: 27,
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: colors.orange,
  },
  inactiveText: {
    color: colors.white,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255, 87, 34, 0.15)',
  },
  drawerItemInactive: {
    backgroundColor: colors.blackGray,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.white,
  },
  coinsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  addCoinsButton: {
    backgroundColor: colors.orange,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addCoinsButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
});
