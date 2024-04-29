import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react'
import ProfileStack from './ProfileStack';
import ProdeStack from './ProdeStack';
import CustomDrawerContent from '../components/presentational/drawer/CustomDrawerContent';
import PredictionStack from './PredictionStack';
import HowToPlayStack from './HowToPlayStack';
import GoPremiumStack from './GoPremiumStack';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    
  return (
    
            <Drawer.Navigator
            initialRouteName='ProdeStack'
            screenOptions={{
                headerShown:false,
                animationEnabled: false,
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
            >
                <Drawer.Screen
                    name='Inicio'
                    component={ProdeStack}
                />
                <Drawer.Screen
                    name='Predicciones'
                    component={PredictionStack}
                />
                <Drawer.Screen 
                    name='Editar Perfil' 
                    component={ProfileStack}
                />
                <Drawer.Screen 
                    name='¿Como Jugar?' 
                    component={HowToPlayStack}
                />
                <Drawer.Screen 
                    name='Hazte Premium' 
                    component={GoPremiumStack}
                />
           </Drawer.Navigator>
  )
}

export default DrawerNavigator