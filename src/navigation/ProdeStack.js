import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import CustomHeader from '../components/headers/CustomHeader'
import Competencies from '../components/presentational/Competencies'
import Fixture from '../components/presentational/Fixture'
import PredictsByCategory from '../screens/PredictsByCategory'


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