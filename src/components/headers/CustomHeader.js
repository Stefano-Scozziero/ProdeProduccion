import { StyleSheet, Text, Pressable } from 'react-native'
import {Entypo, AntDesign} from '@expo/vector-icons'
import React from 'react'
import Header from './Header';
import colors from '../../utils/globals/colors';

const CustomHeader = React.memo(({ title, navigation }) => {
  const isGoBackVisible = navigation.canGoBack() && navigation.getState().routes.length > 1;

  return (
    <Header title={title} navigation={navigation}>
      <Entypo
        onPress={() => navigation.openDrawer()}
        name='menu'
        size={35}
        color={colors.black}
      />
      {isGoBackVisible && 
        <Pressable style={styles.goBack} onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={30} color="white"/>
        </Pressable>}
    </Header>
  )
})

export default CustomHeader

const styles = StyleSheet.create({})