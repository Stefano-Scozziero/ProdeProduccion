import { StyleSheet, View, ImageBackground, Text, ScrollView, TouchableOpacity } from 'react-native';
import { OrientationContext } from '../../../utils/globals/context';
import { useContext, useState } from 'react';
import colors from '../../../utils/globals/colors';

const Notifications = ({ navigation }) => {
  const portrait = useContext(OrientationContext);


  return (
    <ImageBackground
      source={require('../../../../assets/fondodefinitivo.png')}
      style={[styles.main, !portrait && styles.mainLandscape]}
    >
      
    </ImageBackground>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  mainLandscape: {
    flexDirection: 'row',
  },
});
