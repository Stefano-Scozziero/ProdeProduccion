import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomHeader from '../components/headers/CustomHeader'
import GoPremium from '../components/presentational/GoPremium'

const Stack = createNativeStackNavigator()
const GoPremiumStack = () => {

  
  return (
    <Stack.Navigator
        initialRouteName='GoPremium'
        screenOptions={({navigation, route})=>{
            return {
                header: () => {
                    return <CustomHeader 
                            title={route.name === "GoPremium" ? "Hazte Premium" : "Detalle"} 
                            navigation={navigation}
                            />                
                }
            }
        }}

    >
        <Stack.Screen name='GoPremium' component={GoPremium}/>
    </Stack.Navigator>
  )
}

export default GoPremiumStack