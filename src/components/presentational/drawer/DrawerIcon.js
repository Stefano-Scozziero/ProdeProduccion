import { StyleSheet, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import colors from '../../../utils/globals/colors';

const DrawerIcon = ({ nameIcon, focused }) => {
  return (
    <View style={styles.iconContainer}>
      <Entypo name={nameIcon} size={15} color={focused ? colors.orange : colors.white} />
    </View>
  );
};

export default DrawerIcon;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
