<<<<<<< HEAD
import { StyleSheet, Text, Pressable } from 'react-native'
import {Entypo, AntDesign} from '@expo/vector-icons'
import React from 'react'
import Header from './Header';
import colors from '../../utils/globals/colors';

const CustomHeader = React.memo(({ title, navigation }) => {
  const isGoBackVisible = navigation.canGoBack() && navigation.getState().routes.length > 1;

  return (
    <Header title={title} navigation={navigation}>
=======
// src/components/headers/CustomHeader.js
import { Pressable, View } from 'react-native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import React from 'react';
import Header from './Header';
import colors from '../../utils/globals/colors';
import { useDispatch } from 'react-redux';
import { openCategoriesModal } from '../../features/slice/uiSlice'; // Ajusta la ruta según tu estructura

const CustomHeader = React.memo(({ title, navigation, showExtraIcon }) => {
  const isGoBackVisible = navigation.canGoBack() && navigation.getState().routes.length > 1;
  const dispatch = useDispatch();

  return (
    <Header title={title} navigation={navigation}>
      {/* Ícono de menú */}
>>>>>>> testing/master
      <Entypo
        onPress={() => navigation.openDrawer()}
        name='menu'
        size={35}
        color={colors.black}
      />
<<<<<<< HEAD
      {isGoBackVisible && 
        <Pressable style={styles.goBack} onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={30} color="white"/>
        </Pressable>}
    </Header>
  )
})

export default CustomHeader

const styles = StyleSheet.create({})
=======
      
      {/* Ícono de retroceso (si es aplicable) */}
      {isGoBackVisible && 
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={30} color="white"/>
        </Pressable>
      }
      
      {/* Ícono adicional para listar categorías (solo en Home) */}
      {showExtraIcon && (
        <Entypo
          onPress={() => dispatch(openCategoriesModal())}
          name='trophy' // Puedes cambiar el nombre del ícono según prefieras
          size={30}
          color={colors.black}
          style={{ marginLeft: 10 }}
        />
      )}
    </Header>
  );
});

export default CustomHeader;
>>>>>>> testing/master
