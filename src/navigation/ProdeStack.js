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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../components/presentational/stackProde/Home';
import CustomHeader from '../components/headers/CustomHeader';
import Competencies from '../components/presentational/stackProde/Competencies';
import Fixture from '../components/presentational/stackProde/Fixture';
import PredictsByCategory from '../components/presentational/stackProde/PredictsByCategory';
import LeaderBoard from '../components/presentational/stackProde/LeaderBoard';
import News from '../components/presentational/stackProde/News';

const Stack = createNativeStackNavigator();
>>>>>>> testing/master

const ProdeStack = () => {
  const routeTitles = {
    Home: "Inicio",
    Competencies: "Competencias",
    Fixture: "Fixture",
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
  };

  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={({ route, navigation }) => {
        // Determinar si la pantalla actual es Home
        const isHome = route.name === 'Home';

        return {
          animationEnabled: false,
          header: () => (
            <CustomHeader 
              title={routeTitles[route.name] || "Detalle"} 
              navigation={navigation}
              showExtraIcon={isHome} // Pasar true solo si es Home
            />
          ),
        };
      }}
    >
      <Stack.Screen name='Home' component={Home}/>
      <Stack.Screen name='Competencies' component={Competencies}/>
      <Stack.Screen name="PredictsByCategory" component={PredictsByCategory}/>
      <Stack.Screen name='Fixture' component={Fixture}/>
      <Stack.Screen name='LeaderBoard' component={LeaderBoard}/>
      <Stack.Screen name='News' component={News}/>
    </Stack.Navigator>
  );
};

export default ProdeStack;
>>>>>>> testing/master
