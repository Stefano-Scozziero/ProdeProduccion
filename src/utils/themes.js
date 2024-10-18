// src/utils/themes.js
import { DefaultTheme, DarkTheme } from 'react-native-paper';
import colors from './globals/colors';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.orange,
    background: colors.white,
    text: colors.black,
    // Agrega o sobrescribe otros colores según sea necesario
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.orange,
    background: colors.blackGray,
    text: colors.white,
    // Agrega o sobrescribe otros colores según sea necesario
  },
};
 