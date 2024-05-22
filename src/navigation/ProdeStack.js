import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../components/presentational/stackProde/Home'
import CustomHeader from '../components/headers/CustomHeader'
import Competencies from '../components/presentational/stackProde/Competencies'
import Fixture from '../components/presentational/stackProde/Fixture'
import PredictsByCategory from '../components/presentational/stackProde/PredictsByCategory'


const Stack = createNativeStackNavigator()

const ProdeStack = () => {
  const routeTitles = {
    Home: "Inicio",
    Competencies: "Competencias",
    Fixture: "Fixture",
    PredictsByCategory: "Mis Predicciones"
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
        </Stack.Navigator>
  )
}

export default ProdeStack