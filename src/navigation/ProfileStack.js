import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Profile from '../components/presentational/Profile'
import CustomHeader from '../components/headers/CustomHeader'

const Stack = createNativeStackNavigator()
const ProfileStack = () => {

  
  return (
    <Stack.Navigator
        initialRouteName='Profile'
        screenOptions={({navigation, route})=>{
            return {
                header: () => {
                    return <CustomHeader 
                            title={route.name === "Profile" ? "Editar Perfil" : "Detalle"} 
                            navigation={navigation}
                            />                
                }
            }
        }}

    >
        <Stack.Screen name='Profile' component={Profile}/>
    </Stack.Navigator>
  )
}

export default ProfileStack