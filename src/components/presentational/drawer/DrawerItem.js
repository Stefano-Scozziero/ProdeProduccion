import { StyleSheet, Text, View, Pressable } from 'react-native';
import colors from '../../../utils/globals/colors';
import DrawerIcon from './DrawerIcon';

const DrawerItem = ({ navigation, activeRoute, route, icon, title }) => {
  const isActive = activeRoute === route;
  
  return (
    <View style={[styles.drawerItemContainer, isActive ? styles.drawerItemActive : styles.drawerItemInactive]}>
      <Pressable style={styles.drawerButton} onPress={() => navigation.navigate(route)}>
        <DrawerIcon nameIcon={icon} focused={isActive} />
        <Text style={[styles.text, isActive ? styles.activeText : styles.inactiveText]}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default DrawerItem;

const styles = StyleSheet.create({
  drawerItemContainer: {
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(255, 87, 34, 0.15)',
  },
  drawerItemInactive: {
    backgroundColor: colors.blackGray,
  },
  drawerButton: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  activeText: {
    color: colors.orange,
  },
  inactiveText: {
    color: colors.white,
  },
  text: {
    left: 30,
    fontSize: 14,
    fontWeight: '500',
  },
});
