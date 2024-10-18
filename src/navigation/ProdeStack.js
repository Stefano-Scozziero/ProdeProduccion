// ProdeStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Home from '../components/presentational/stackProde/Home';
import CustomHeader from '../components/headers/CustomHeader';
import Fixture from '../components/presentational/stackProde/Fixture';
import Predictions from '../components/presentational/stackProde/Predictions';
import Leader from '../components/presentational/stackProde/Leader';
import News from '../components/presentational/stackProde/News';
import Keys from '../components/presentational/stackProde/Keys';

const Stack = createNativeStackNavigator();

const ProdeStack = () => {
  const selectedCategory = useSelector(state => state.category.selectedCategory);

  const routeTitles = {
    Home: selectedCategory || "Inicio",
    Fixture: "Fixture",
    Predictions: "Mis Predicciones",
    Leader: "Tabla de Líderes",
    News: "Noticias",
    Keys: "Llaves"
  };

  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={({ route, navigation }) => {
        const isHome = route.name === 'Home';
        return {
          animationEnabled: false,
          header: () => (
            <CustomHeader 
              title={routeTitles[route.name] || "Detalle"} 
              navigation={navigation}
              showExtraIcon={isHome} // Mostrar icono adicional solo en Home
              isHome={isHome} // Pasar prop isHome
            />
          ),
        };
      }}
    >
      <Stack.Screen name='Home' component={Home}/>
      <Stack.Screen name="Predictions" component={Predictions}/>
      <Stack.Screen name='Fixture' component={Fixture}/>
      <Stack.Screen name='Leader' component={Leader}/>
      <Stack.Screen name='News' component={News}/>
      <Stack.Screen name='Keys' component={Keys}/>
    </Stack.Navigator>
  );
};

export default ProdeStack;
