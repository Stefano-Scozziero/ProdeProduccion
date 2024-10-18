<<<<<<< HEAD
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../components/presentational/stackProde/Home'
import CustomHeader from '../components/headers/CustomHeader'
import Competencies from '../components/presentational/stackProde/Competencies'
import Fixture from '../components/presentational/stackProde/Fixture'
import PredictsByCategory from '../components/presentational/stackProde/PredictsByCategory'
import LeaderBoard from '../components/presentational/stackProde/LeaderBoard'
import News from '../components/presentational/stackProde/News'


const Stack = createNativeStackNavigator()
=======
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
>>>>>>> testing/master

const ProdeStack = () => {
  const selectedCategory = useSelector(state => state.category.selectedCategory);

  const routeTitles = {
    Home: selectedCategory || "Inicio",
    Fixture: "Fixture",
<<<<<<< HEAD
    PredictsByCategory: "Mis Predicciones",
<<<<<<< HEAD
    LeaderBoard: "Tabla de Lideres",
    News: "Noticias"
  }

  return (
    <Stack.Navigator
            initialRouteName='Home'
            screenOptions={( {route,navigation})=>{
                return {
                  animationEnabled: false,
                header: () =>{
                    return <CustomHeader title={routeTitles[route.name] || "Detalle"} navigation={navigation}/>          
                }
                }
            }}
        >
            <Stack.Screen name='Home' component={Home}/>
            <Stack.Screen name='Competencies' component={Competencies}/>
            <Stack.Screen name="PredictsByCategory" component={PredictsByCategory}/>
            <Stack.Screen name='Fixture' component={Fixture}/>
            <Stack.Screen name='LeaderBoard' component={LeaderBoard}/>
            <Stack.Screen name='News' component={News}/>
        </Stack.Navigator>
  )
}

export default ProdeStack
=======
    LeaderBoard: "Tabla de Líderes",
    News: "Noticias"
=======
    Predictions: "Mis Predicciones",
    Leader: "Tabla de Líderes",
    News: "Noticias",
    Keys: "Llaves"
>>>>>>> testing/master
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
>>>>>>> testing/master
