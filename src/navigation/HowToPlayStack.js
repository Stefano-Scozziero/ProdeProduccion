import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomHeader from '../components/headers/CustomHeader'
import HowToPlay from '../components/presentational/HowToPlay'

const Stack = createNativeStackNavigator()
const HowToPlayStack = () => {

  
  return (
    <Stack.Navigator
        initialRouteName='HowToPlay'
        screenOptions={({navigation, route})=>{
            return {
                header: () => {
                    return <CustomHeader 
                            title={route.name === "HowToPlay" ? "¿Como Jugar?" : "Detalle"} 
                            navigation={navigation}
                            />                
                }
            }
        }}

    >
        <Stack.Screen name='HowToPlay' component={HowToPlay}/>
    </Stack.Navigator>
  )
}

export default HowToPlayStack