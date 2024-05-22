import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomHeader from '../components/headers/CustomHeader'
import Admin from '../components/presentational/stackAdmin/Administrador'
import DatesLigue from '../components/presentational/stackAdmin/DatesLigue'

const Stack = createNativeStackNavigator()
const Administrador = () => {

    const routeTitles = {
        Admin: "Administrador",
        DatesLigue: "Datos de la Liga",
      }

  return (
    <Stack.Navigator
        initialRouteName='Administrador'
        screenOptions={({navigation, route})=>{
            return {
                header: () => {
                    return <CustomHeader 
                            title={routeTitles[route.name] || "Detalle"} navigation={navigation}/>                
                }
            }
        }}

    >
        <Stack.Screen name='Admin' component={Admin}/>
        <Stack.Screen name='DatesLigue' component={DatesLigue}/>
    </Stack.Navigator>
  )
}

export default Administrador