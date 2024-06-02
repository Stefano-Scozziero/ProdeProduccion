import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../components/presentational/stackProde/Home'
import CustomHeader from '../components/headers/CustomHeader'
import Competencies from '../components/presentational/stackProde/Competencies'
import Fixture from '../components/presentational/stackProde/Fixture'
import PredictsByCategory from '../components/presentational/stackProde/PredictsByCategory'
import LeaderBoard from '../components/presentational/stackProde/LeaderBoard'
import News from '../components/presentational/stackProde/News'


const Stack = createNativeStackNavigator()

const ProdeStack = () => {
  const routeTitles = {
    Home: "Inicio",
    Competencies: "Competencias",
    Fixture: "Fixture",
    PredictsByCategory: "Mis Predicciones",
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