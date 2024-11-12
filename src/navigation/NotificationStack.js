import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CustomHeader from '../components/headers/CustomHeader'
import Notifications from '../components/presentational/stackNotifications/Notifications'

const Stack = createNativeStackNavigator()
const NotificationStack = () => {

  
  return (
    <Stack.Navigator
        initialRouteName='Notifications'
        screenOptions={({navigation, route})=>{
            return {
                header: () => {
                    return <CustomHeader 
                            title={route.name === "Notifications" ? "Notificaciones" : "Detalle"} 
                            navigation={navigation}
                            />                
                }
            }
        }}

    >
        <Stack.Screen name='Notifications' component={Notifications}/>
    </Stack.Navigator>
  )
}

export default NotificationStack